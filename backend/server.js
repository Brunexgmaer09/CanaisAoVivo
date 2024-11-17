const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');

const app = express();
const cache = new NodeCache({ stdTTL: 300 });

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

const channelMap = {
    'tntsports': 'TNTSPORTS',
    'megapix': 'MPX',
    'space': 'SPA',
    'telecineaction': 'TC2',
    'telecinetouch': 'TC3',
    'telecinepremium': 'TC1',
    'hbo': 'HBO',
    'hboplus': 'HPL',
    'fx': 'CFX',
    'globomg': 'GRD'
};

async function scrapeChannelInfo(channel) {
    try {
        const url = `https://meuguia.tv/programacao/canal/${channelMap[channel]}`;
        console.log(`Fazendo scraping de: ${url}`);
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(response.data);
        
        // Encontra o programa atual (com NO AR)
        const currentProgramElement = $('li a.devicepadding').filter((i, el) => {
            return $(el).find('div.noar').length > 0;
        }).first();

        if (currentProgramElement.length) {
            // Extrai informações do programa atual
            const current = {
                time: currentProgramElement.find('div.lileft.time').text().trim(),
                title: currentProgramElement.find('div.licontent h2').text().trim(),
                genre: currentProgramElement.find('div.licontent h3').text().trim()
            };

            // Encontra o próximo programa
            const nextProgramElement = currentProgramElement.closest('li').nextAll('li').find('a.devicepadding').first();
            const next = {
                time: nextProgramElement.find('div.lileft.time').text().trim(),
                title: nextProgramElement.find('div.licontent h2').text().trim(),
                genre: nextProgramElement.find('div.licontent h3').text().trim()
            };

            console.log('Programa atual encontrado:', current);
            console.log('Próximo programa:', next);

            return {
                current,
                next: next.title ? next : {
                    time: "Próximo horário não disponível",
                    title: "Próximo programa não disponível",
                    genre: "Gênero não disponível"
                }
            };
        }

        // Se não encontrar o programa com NO AR, procura o primeiro programa do dia atual
        const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' })
            .replace('-feira', '')
            .replace(/^\w/, c => c.toUpperCase());
        
        const currentDayHeader = $('li.subheader.devicepadding').filter((i, el) => {
            return $(el).text().includes(today);
        }).first();

        if (currentDayHeader.length) {
            const firstProgram = currentDayHeader.nextUntil('li.subheader').find('a.devicepadding').first();
            if (firstProgram.length) {
                const program = {
                    time: firstProgram.find('div.lileft.time').text().trim(),
                    title: firstProgram.find('div.licontent h2').text().trim(),
                    genre: firstProgram.find('div.licontent h3').text().trim()
                };

                console.log('Primeiro programa do dia encontrado:', program);
                return {
                    current: program,
                    next: {
                        time: "Próximo horário não disponível",
                        title: "Próximo programa não disponível",
                        genre: "Gênero não disponível"
                    }
                };
            }
        }

        throw new Error(`Nenhum programa encontrado para ${channel}`);

    } catch (error) {
        console.error(`Erro ao buscar informações do canal ${channel}:`, error.message);
        return {
            current: {
                time: new Date().toLocaleTimeString().slice(0, 5),
                title: channelMap[channel],
                genre: "Informação temporariamente indisponível"
            },
            next: {
                time: "--:--",
                title: "Tente novamente mais tarde",
                genre: "---"
            }
        };
    }
}

app.get('/', (req, res) => {
    res.json({ 
        message: 'API de Programação de TV',
        endpoints: {
            programInfo: '/api/program/:channel',
            availableChannels: Object.keys(channelMap)
        }
    });
});

app.get('/api/program/:channel', async (req, res) => {
    const { channel } = req.params;
    
    if (!channelMap[channel]) {
        return res.status(400).json({ error: 'Canal não suportado' });
    }

    try {
        const cachedData = cache.get(channel);
        if (cachedData) {
            console.log('Retornando dados do cache para:', channel);
            return res.json(cachedData);
        }

        console.log('Buscando informações para:', channel);
        const programInfo = await scrapeChannelInfo(channel);
        
        if (programInfo) {
            cache.set(channel, programInfo);
            res.json(programInfo);
        } else {
            res.status(404).json({ 
                error: 'Informações não encontradas',
                channel: channel,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar informações',
            details: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse http://localhost:${PORT} para ver a documentação da API`);
}); 