# 🏃‍♂️💨 Monitor de Atividades Físicas API & Web Interface

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi) ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

Uma aplicação web full-stack para registrar e monitorar atividades físicas. Desenvolvida com FastAPI para o backend, PostgreSQL como banco de dados, e uma interface web simples em HTML, CSS e JavaScript.

**✨ Aplicação em Produção:** [https://monitor-atividades-api.onrender.com/](https://monitor-atividades-api.onrender.com/)

## 🎯 Funcionalidades

*   **Cadastro de Tipos de Exercícios:** Permite adicionar novos tipos de atividades físicas (ex: Caminhada, Natação, Musculação).
*   **Registro de Sessões de Treino:** Registra sessões de atividades com data, duração e observações.
*   **Listagem de Dados:** Visualiza todas as atividades cadastradas e todas as sessões de treino.
*   **Filtragem de Sessões:** Permite buscar sessões por tipo de atividade ou por data (via API).
*   **Exclusão de Registros:** Remove sessões de treino específicas.
*   **Interface Web Intuitiva:** Uma interface de usuário simples para interagir com as funcionalidades da API.
*   **Deploy em PaaS:** Aplicação hospedada na plataforma Render.

## 🛠️ Tecnologias Utilizadas

*   **Backend:**
    *   Python 3.10+
    *   FastAPI (para a API RESTful)
    *   SQLAlchemy (ORM para interação com o banco de dados)
    *   Uvicorn (servidor ASGI)
*   **Banco de Dados:**
    *   PostgreSQL (em produção, via Render)
    *   SQLite (para desenvolvimento local)
*   **Frontend:**
    *   HTML5
    *   CSS3
    *   JavaScript (Vanilla JS para manipulação do DOM e chamadas API)
*   **Deployment:**
    *   Render (Plataforma como Serviço - PaaS)
    *   Git & GitHub (Controle de versão e hospedagem do código)

## 📂 Estrutura do Projeto

```
.
├── .gitignore          # Arquivos e pastas a serem ignorados pelo Git
├── README.md           # Este arquivo
├── requirements.txt    # Dependências Python do projeto
├── app/                # Diretório principal da aplicação FastAPI
│   ├── __init__.py
│   ├── crud.py         # Funções CRUD (Create, Read, Update, Delete) para o banco
│   ├── database.py     # Configuração da conexão com o banco de dados (SQLAlchemy)
│   ├── main.py         # Arquivo principal da API FastAPI (endpoints)
│   ├── models.py       # Modelos de tabelas do SQLAlchemy
│   └── schemas.py      # Modelos Pydantic (validação de dados da API)
└── static/             # Arquivos da interface web
    ├── index.html      # Página principal da interface
    ├── script.js       # Lógica JavaScript do frontend
    └── style.css       # Estilos CSS
```

## 🚀 Configuração e Execução Local

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

*   Python 3.10 ou superior
*   pip (gerenciador de pacotes Python)
*   Git

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/SEU_NOME_DE_USUARIO/NOME_DO_REPOSITORIO.git
    cd NOME_DO_REPOSITORIO
    ```
    *(Substitua `SEU_NOME_DE_USUARIO/NOME_DO_REPOSITORIO` pelo caminho correto do seu repositório no GitHub)*

2.  **Crie e ative um ambiente virtual (recomendado):**
    ```bash
    python -m venv venv
    ```
    *   No Windows:
        ```bash
        venv\Scripts\activate
        ```
    *   No macOS/Linux:
        ```bash
        source venv/bin/activate
        ```

3.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Execute a aplicação FastAPI:**
    ```bash
    uvicorn app.main:app --reload
    ```
    A API estará rodando em `http://127.0.0.1:8000`.

5.  **Acesse a aplicação:**
    *   **API (documentação interativa Swagger UI):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
    *   **API (documentação alternativa ReDoc):** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
    *   **Interface Web Local (se servida pelo FastAPI na raiz):** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
        *(Nota: A configuração atual serve o `index.html` na raiz. Para testar o `index.html` localmente sem rodar o servidor FastAPI, você pode abrir o arquivo `static/index.html` diretamente no navegador, mas certifique-se que a `API_BASE_URL` em `static/script.js` aponta para `http://127.0.0.1:8000` para testes locais ou para a URL de produção se quiser testar com a API em produção.)*

    Por padrão, a aplicação local usará um banco de dados SQLite chamado `test.db` criado na raiz do projeto.

## 📡 Endpoints da API

A URL base para os endpoints abaixo é a URL da sua aplicação (ex: `http://127.0.0.1:8000` localmente, ou `https://monitor-atividades-api.onrender.com` em produção).

### Atividades

*   **Cadastrar Nova Atividade**
    *   **Método:** `POST`
    *   **Path:** `/atividades/`
    *   **Corpo da Requisição (JSON):**
        ```json
        {
          "nome": "Corrida"
        }
        ```
    *   **Resposta (JSON):**
        ```json
        {
          "nome": "Corrida",
          "id": 1
        }
        ```

*   **Listar Todas as Atividades**
    *   **Método:** `GET`
    *   **Path:** `/atividades/`
    *   **Resposta (JSON):**
        ```json
        [
          {
            "nome": "Caminhada",
            "id": 1
          },
          {
            "nome": "Natação",
            "id": 2
          }
        ]
        ```

*   **Buscar Atividade por ID**
    *   **Método:** `GET`
    *   **Path:** `/atividades/{atividade_id}`
    *   **Resposta (JSON):**
        ```json
        {
          "nome": "Caminhada",
          "id": 1
        }
        ```

### Sessões

*   **Registrar Nova Sessão**
    *   **Método:** `POST`
    *   **Path:** `/sessoes/`
    *   **Corpo da Requisição (JSON):**
        ```json
        {
          "data": "2024-06-01",
          "duracao_minutos": 60,
          "observacoes": "Ritmo leve",
          "atividade_id": 1
        }
        ```
    *   **Resposta (JSON):**
        ```json
        {
          "data": "2024-06-01",
          "duracao_minutos": 60,
          "observacoes": "Ritmo leve",
          "id": 1,
          "atividade": {
            "nome": "Caminhada",
            "id": 1
          }
        }
        ```

*   **Listar Todas as Sessões**
    *   **Método:** `GET`
    *   **Path:** `/sessoes/`
    *   **Query Params (Opcionais):** `skip` (int, default 0), `limit` (int, default 100)
    *   **Resposta (JSON):** Lista de objetos de sessão (similar à resposta do POST).

*   **Listar Sessões por Tipo de Atividade**
    *   **Método:** `GET`
    *   **Path:** `/sessoes_por_tipo/`
    *   **Query Params Obrigatórios:** `tipo` (string, nome da atividade, ex: "Caminhada")
    *   **Query Params (Opcionais):** `skip`, `limit`
    *   **Resposta (JSON):** Lista de objetos de sessão filtrados.

*   **Listar Sessões por Data**
    *   **Método:** `GET`
    *   **Path:** `/sessoes_por_data/`
    *   **Query Params Obrigatórios:** `data` (string, formato YYYY-MM-DD, ex: "2024-06-01")
    *   **Query Params (Opcionais):** `skip`, `limit`
    *   **Resposta (JSON):** Lista de objetos de sessão filtrados.

*   **Excluir Sessão Registrada**
    *   **Método:** `DELETE`
    *   **Path:** `/sessoes/{sessao_id}`
    *   **Resposta (JSON):** O objeto da sessão excluída.

## 🤝 Contribuições

Contribuições são bem-vindas! Se você tiver sugestões ou encontrar problemas, sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.

---

_Desenvolvido como parte de um projeto de Aplicações Distribuídas._ 