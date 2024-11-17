// Dados estáticos de exemplo para cada canal
const channelPrograms = {
    'tntsports': {
        name: 'TNT Sports',
        category: 'Esportes',
        description: 'Transmissão de eventos esportivos ao vivo'
    },
    'megapix': {
        name: 'Megapix',
        category: 'Filmes',
        description: 'Os melhores filmes em HD'
    },
    'space': {
        name: 'Space',
        category: 'Filmes',
        description: 'Filmes de ação e aventura'
    },
    'telecineaction': {
        name: 'Telecine Action',
        category: 'Filmes de Ação',
        description: 'O melhor do cinema de ação'
    },
    'telecinetouch': {
        name: 'Telecine Touch',
        category: 'Filmes',
        description: 'Filmes emocionantes e românticos'
    },
    'telecinepremium': {
        name: 'Telecine Premium',
        category: 'Filmes',
        description: 'Grandes sucessos do cinema'
    },
    'hbo': {
        name: 'HBO',
        category: 'Filmes e Séries',
        description: 'O melhor do entretenimento premium'
    },
    'hboplus': {
        name: 'HBO Plus',
        category: 'Filmes e Séries',
        description: 'Mais opções de filmes e séries HBO'
    },
    'fx': {
        name: 'FX',
        category: 'Séries e Filmes',
        description: 'O melhor em séries originais e filmes'
    },
    'globomg': {
        name: 'Globo Minas',
        category: 'TV Aberta',
        description: 'Programação regional e nacional da Globo Minas'
    }
};

async function fetchProgramInfo(channel) {
    try {
        const response = await fetch(`http://localhost:3000/api/program/${channel}`);
        if (!response.ok) throw new Error('Erro na resposta da API');
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar informações do programa:', error);
        return null;
    }
}

export async function updateChannelInfo(channel) {
    const infoContainer = document.querySelector('.program-info');
    
    try {
        // Tenta buscar informações do backend
        const programInfo = await fetchProgramInfo(channel);
        
        if (programInfo && programInfo.current) {
            infoContainer.innerHTML = `
                <div class="program-details">
                    <div class="program-header">
                        <div class="program-main">
                            <span class="program-time">${programInfo.current.time}</span>
                            <h4 class="program-title">${programInfo.current.title}</h4>
                        </div>
                        <span class="program-genre">${programInfo.current.genre}</span>
                    </div>
                    ${programInfo.next ? `
                        <div class="program-next">
                            <span class="next-label">Próximo:</span>
                            <span class="next-time">${programInfo.next.time}</span>
                            <span class="next-title">${programInfo.next.title}</span>
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            // Usa informações estáticas como fallback
            const channelInfo = channelPrograms[channel];
            infoContainer.innerHTML = `
                <div class="program-details">
                    <div class="program-header">
                        <h4 class="program-title">${channelInfo.name}</h4>
                        <span class="program-genre">${channelInfo.category}</span>
                    </div>
                    <p class="program-description">${channelInfo.description}</p>
                </div>
            `;
        }
        
        infoContainer.classList.add('show');
        infoContainer.style.opacity = '0';
        setTimeout(() => {
            infoContainer.style.opacity = '1';
        }, 100);
    } catch (error) {
        console.error('Erro ao atualizar informações:', error);
    }
} 