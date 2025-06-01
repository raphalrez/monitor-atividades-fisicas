// Lógica JavaScript da interface será adicionada aqui
console.log("Script carregado!");

document.addEventListener('DOMContentLoaded', () => {
    const formAdicionarAtividade = document.getElementById('formAdicionarAtividade');
    const btnAdicionarAtividade = formAdicionarAtividade.querySelector('button[type="submit"]');
    const listaAtividades = document.getElementById('listaAtividades');
    const selectAtividadeSessao = document.getElementById('selectAtividadeSessao');
    const feedbackAtividadeEl = document.getElementById('feedbackAtividade'); // Elemento de feedback

    const formAdicionarSessao = document.getElementById('formAdicionarSessao');
    const btnAdicionarSessao = formAdicionarSessao.querySelector('button[type="submit"]');
    const listaSessoes = document.getElementById('listaSessoes');
    const feedbackSessaoEl = document.getElementById('feedbackSessao'); // Elemento de feedback

    const API_BASE_URL = 'http://127.0.0.1:8000'; // Base URL da sua API FastAPI

    // Função auxiliar para exibir feedback
    function showFeedback(element, message, type = 'error') {
        element.textContent = message;
        element.className = `feedback-message ${type}`; // Aplica classe de erro ou sucesso
        // Limpa a mensagem após alguns segundos
        setTimeout(() => {
            element.textContent = '';
            element.className = 'feedback-message';
        }, 5000);
    }

    // Função para habilitar/desabilitar botão e mostrar loading
    function setLoadingState(button, isLoading, defaultText = "") {
        if (isLoading) {
            button.disabled = true;
            button.dataset.defaultText = button.textContent;
            button.textContent = 'Carregando...';
        } else {
            button.disabled = false;
            button.textContent = button.dataset.defaultText || defaultText;
        }
    }

    // --- Funções para Atividades ---
    async function buscarAtividades() {
        try {
            const response = await fetch(`${API_BASE_URL}/atividades/`);
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            const atividades = await response.json();
            
            listaAtividades.innerHTML = '';
            selectAtividadeSessao.innerHTML = '<option value="">Selecione uma atividade</option>';
            if (atividades.length === 0) {
                listaAtividades.innerHTML = '<li>Nenhuma atividade cadastrada.</li>';
            }
            atividades.forEach(atividade => {
                const li = document.createElement('li');
                li.textContent = `ID: ${atividade.id} - Nome: ${atividade.nome}`;
                listaAtividades.appendChild(li);
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
        const nomeAtividade = document.getElementById('nomeAtividade').value;
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
            // buscarSessoes(); // Não precisa mais se a exibição de sessões não depender de buscar atividades separadamente
        } catch (error) {
            console.error('Erro ao adicionar atividade:', error);
            showFeedback(feedbackAtividadeEl, `Erro ao adicionar atividade: ${error.message}`, 'error');
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
            listaSessoes.innerHTML = '';

            if (sessoes.length === 0) {
                listaSessoes.innerHTML = '<li>Nenhuma sessão registrada.</li>';
                return;
            }

            sessoes.forEach(sessao => {
                const li = document.createElement('li');
                // Agora acessamos sessao.atividade.nome diretamente
                const nomeAtividade = sessao.atividade ? sessao.atividade.nome : 'Atividade Desconhecida';
                li.innerHTML = `
                    Atividade: ${nomeAtividade} (ID Atv: ${sessao.atividade ? sessao.atividade.id : 'N/A'}) <br>
                    Data: ${sessao.data} | Duração: ${sessao.duracao_minutos} min <br>
                    Observações: ${sessao.observacoes || 'Nenhuma'}
                    <button class="delete-btn" data-id="${sessao.id}">Excluir</button>
                `;
                listaSessoes.appendChild(li);
            });

            document.querySelectorAll('#listaSessoes .delete-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const sessaoId = event.target.dataset.id;
                    await deletarSessao(sessaoId, event.target);
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
        const duracaoSessao = parseInt(document.getElementById('duracaoSessao').value);
        const observacoesSessao = document.getElementById('observacoesSessao').value;

        if (!atividadeId) {
            showFeedback(feedbackSessaoEl, 'Por favor, selecione uma atividade.', 'error');
            return;
        }
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
            showFeedback(feedbackSessaoEl, `Erro ao adicionar sessão: ${error.message}`, 'error');
        } finally {
            setLoadingState(btnAdicionarSessao, false);
        }
    });

    async function deletarSessao(sessaoId, buttonElement) {
        if (buttonElement) setLoadingState(buttonElement, true);
        try {
            const response = await fetch(`${API_BASE_URL}/sessoes/${sessaoId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Erro HTTP: ${response.status}`);
            }
            showFeedback(feedbackSessaoEl, 'Sessão excluída com sucesso!', 'success');
            buscarSessoes();
        } catch (error) {
            console.error('Erro ao deletar sessão:', error);
            showFeedback(feedbackSessaoEl, `Erro ao deletar sessão: ${error.message}`, 'error');
        } finally {
            if (buttonElement) setLoadingState(buttonElement, false);
        }
    }

    // Carregar dados iniciais
    buscarAtividades();
    buscarSessoes();
}); 