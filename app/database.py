import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Para desenvolvimento local, podemos definir um fallback para SQLite
DEFAULT_SQLITE_URL = "sqlite:///./test.db"

# A DATABASE_URL será lida da variável de ambiente em produção (ex: no Render)
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_SQLITE_URL)

engine_args = {}
if DATABASE_URL.startswith("sqlite"):
    engine_args["connect_args"] = {"check_same_thread": False} # Necessário apenas para SQLite
    print(f"Conectando ao banco de dados SQLite: {DATABASE_URL}")
elif DATABASE_URL.startswith("postgresql") or DATABASE_URL.startswith("postgres"):
    # Em produção (ex: Render), não precisamos de connect_args especiais para PostgreSQL geralmente
    print(f"Conectando ao banco de dados PostgreSQL.") # Não logue a URL completa em produção por segurança
else:
    print(f"AVISO: DATABASE_URL desconhecida: {DATABASE_URL}. Usando SQLite por padrão.")
    DATABASE_URL = DEFAULT_SQLITE_URL # Fallback se o formato não for reconhecido
    engine_args["connect_args"] = {"check_same_thread": False}


engine = create_engine(DATABASE_URL, **engine_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Função para obter uma sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 