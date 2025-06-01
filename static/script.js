// Lógica JavaScript da interface será adicionada aqui
console.log("Script carregado!");

document.addEventListener('DOMContentLoaded', () => {
    const formAdicionarAtividade = document.getElementById('formAdicionarAtividade');
    const btnAdicionarAtividade = formAdicionarAtividade.querySelector('button[type="submit"]');
    const listaAtividadesEl = document.getElementById('listaAtividades'); // Renomeado para clareza (El = Elemento)
    const selectAtividadeSessao = document.getElementById('selectAtividadeSessao');
    const feedbackAtividadeEl = document.getElementById('feedbackAtividade');

    const formAdicionarSessao = document.getElementById('formAdicionarSessao');
    const btnAdicionarSessao = formAdicionarSessao.querySelector('button[type="submit"]');
    const listaSessoesEl = document.getElementById('listaSessoes'); // Renomeado
    const feedbackSessaoEl = document.getElementById('feedbackSessao');

    // Modal Elements
    const confirmationModal = document.getElementById('confirmationModal');
    const modalMessage = document.getElementById('modalMessage');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');
    const closeModalButton = confirmationModal.querySelector('.close-button');
    let currentDeleteFunction = null; // Para armazenar a função de exclusão a ser chamada

    const API_BASE_URL = 'https://monitor-atividades-api.onrender.com';

    function showFeedback(element, message, type = 'error') {
        element.textContent = message;
        element.className = `feedback-message ${type}`;
        setTimeout(() => {
            element.textContent = '';
            element.className = 'feedback-message';
        }, 4000);
    }

    function setLoadingState(button, isLoading, defaultText = null) {
        if (isLoading) {
            if (!button.dataset.defaultText) {
                 button.dataset.defaultText = button.innerHTML; // Salva o HTML interno original
            }
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.defaultText || defaultText || 'Ação';
        }
    }

    // --- Funções do Modal ---
    function openModal(message, onDeleteConfirm) {
        modalMessage.textContent = message || 'Tem certeza que deseja excluir este item?';
        currentDeleteFunction = onDeleteConfirm;
        confirmationModal.style.display = 'flex';
    }

    function closeModal() {
        confirmationModal.style.display = 'none';
        currentDeleteFunction = null;
    }

    confirmDeleteButton.addEventListener('click', () => {
        if (currentDeleteFunction) {
            setLoadingState(confirmDeleteButton, true);
            currentDeleteFunction().finally(() => {
                 setLoadingState(confirmDeleteButton, false);
                 closeModal();
            });
        }
    });
    cancelDeleteButton.addEventListener('click', closeModal);
    closeModalButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => { // Fechar se clicar fora
        if (event.target === confirmationModal) {
            closeModal();
        }
    });

    // --- Funções para Atividades ---
    async function buscarAtividades() {
        try {
            const response = await fetch(`${API_BASE_URL}/atividades/`);
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            const atividades = await response.json();
            
            listaAtividadesEl.innerHTML = '';
            selectAtividadeSessao.innerHTML = '<option value="">Selecione uma atividade</option>';
            if (atividades.length === 0) {
                listaAtividadesEl.innerHTML = '<p class="empty-state">Nenhuma atividade cadastrada ainda.</p>';
            }
            atividades.forEach(atividade => {
                // Card para Atividade (simples, pois não há ações por enquanto)
                const card = document.createElement('div');
                card.className = 'card atividade-card';
                card.innerHTML = `<h4><i class="fas fa-tag"></i> ${atividade.nome}</h4><p>ID: ${atividade.id}</p>`;
                listaAtividadesEl.appendChild(card);

                const option = document.createElement('option');
                option.value = atividade.id;
                option.textContent = atividade.nome;
                selectAtividadeSessao.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao buscar atividades:', error);
            showFeedback(feedbackAtividadeEl, 'Erro ao carregar atividades.', 'error');
        }
    }

    formAdicionarAtividade.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nomeAtividade = document.getElementById('nomeAtividade').value.trim();
        if (!nomeAtividade) {
            showFeedback(feedbackAtividadeEl, 'O nome da atividade não pode ser vazio.', 'error');
            return;
        }
        setLoadingState(btnAdicionarAtividade, true);
        try {
            const response = await fetch(`${API_BASE_URL}/atividades/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: nomeAtividade }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Erro HTTP: ${response.status}`);
            }
            document.getElementById('nomeAtividade').value = '';
            showFeedback(feedbackAtividadeEl, 'Atividade adicionada com sucesso!', 'success');
            buscarAtividades(); 
        } catch (error) {
            console.error('Erro ao adicionar atividade:', error);
            showFeedback(feedbackAtividadeEl, `Erro: ${error.message}`, 'error');
        } finally {
            setLoadingState(btnAdicionarAtividade, false);
        }
    });

    // --- Funções para Sessões ---
    async function buscarSessoes() {
        try {
            const response = await fetch(`${API_BASE_URL}/sessoes/`);
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            const sessoes = await response.json();
            listaSessoesEl.innerHTML = '';

            if (sessoes.length === 0) {
                listaSessoesEl.innerHTML = '<p class="empty-state">Nenhuma sessão registrada ainda. Comece adicionando uma!</p>';
                return;
            }

            sessoes.forEach(sessao => {
                const card = document.createElement('div');
                card.className = 'card sessao-card';
                const nomeAtividade = sessao.atividade ? sessao.atividade.nome : 'Desconhecida';
                card.innerHTML = `
                    <h4><i class="fas fa-walking"></i> ${nomeAtividade}</h4>
                    <p class="card-meta"><i class="far fa-calendar-alt"></i> Data: ${sessao.data}</p>
                    <p class="card-meta"><i class="far fa-clock"></i> Duração: ${sessao.duracao_minutos} min</p>
                    <p>${sessao.observacoes || 'Sem observações.'}</p>
                    <div class="card-actions">
                        <button class="delete-btn" data-id="${sessao.id}"><i class="fas fa-trash-alt"></i> Excluir</button>
                    </div>
                `;
                listaSessoesEl.appendChild(card);
            });

            document.querySelectorAll('#listaSessoes .delete-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const sessaoId = event.target.closest('.delete-btn').dataset.id;
                    openModal('Tem certeza que deseja excluir esta sessão?', 
                        () => deletarSessao(sessaoId, event.target.closest('.delete-btn'))
                    );
                });
            });

        } catch (error) {
            console.error('Erro ao buscar sessões:', error);
            showFeedback(feedbackSessaoEl, 'Erro ao carregar sessões.', 'error');
        }
    }

    formAdicionarSessao.addEventListener('submit', async (event) => {
        event.preventDefault();
        const atividadeId = document.getElementById('selectAtividadeSessao').value;
        const dataSessao = document.getElementById('dataSessao').value;
        const duracaoSessaoInput = document.getElementById('duracaoSessao');
        const observacoesSessao = document.getElementById('observacoesSessao').value.trim();

        if (!atividadeId) {
            showFeedback(feedbackSessaoEl, 'Por favor, selecione uma atividade.', 'error');
            return;
        }
        if (!dataSessao) {
            showFeedback(feedbackSessaoEl, 'Por favor, informe a data da sessão.', 'error');
            return;
        }
        if (!duracaoSessaoInput.value || parseInt(duracaoSessaoInput.value) <= 0) {
            showFeedback(feedbackSessaoEl, 'Por favor, informe uma duração válida (maior que zero).', 'error');
            return;
        }
        const duracaoSessao = parseInt(duracaoSessaoInput.value);

        setLoadingState(btnAdicionarSessao, true);
        try {
            const response = await fetch(`${API_BASE_URL}/sessoes/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    atividade_id: parseInt(atividadeId),
                    data: dataSessao,
                    duracao_minutos: duracaoSessao,
                    observacoes: observacoesSessao,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Erro HTTP: ${response.status}`);
            }
            formAdicionarSessao.reset();
            showFeedback(feedbackSessaoEl, 'Sessão adicionada com sucesso!', 'success');
            buscarSessoes();
        } catch (error) {
            console.error('Erro ao adicionar sessão:', error);
            showFeedback(feedbackSessaoEl, `Erro: ${error.message}`, 'error');
        } finally {
            setLoadingState(btnAdicionarSessao, false);
        }
    });

    async function deletarSessao(sessaoId, buttonElement) {
        // A confirmação agora é feita pelo modal, não precisa do confirm() aqui.
        // buttonElement é passado para o setLoadingState no callback do modal.
        try {
            const response = await fetch(`${API_BASE_URL}/sessoes/${sessaoId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Erro HTTP: ${response.status}`);
            }
            showFeedback(feedbackSessaoEl, 'Sessão excluída com sucesso!', 'success');
            buscarSessoes(); // Atualiza a lista de sessões
        } catch (error) {
            console.error('Erro ao deletar sessão:', error);
            showFeedback(feedbackSessaoEl, `Erro: ${error.message}`, 'error');
        }
        // setLoadingState para o botão de confirmação do modal é tratado no listener do modal.
    }

    // Carregar dados iniciais
    buscarAtividades();
    buscarSessoes();
}); 