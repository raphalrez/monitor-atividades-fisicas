from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from .database import engine, Base, get_db
from . import models, schemas, crud

# Cria as tabelas no banco de dados (apenas se não existirem)
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configuração do CORS
origins = [
    "*",  # Permite todas as origens. Para produção, restrinja!
    # Exemplos de origens específicas:
    # "http://localhost",
    # "http://localhost:8080", # Se você servir seu HTML de um servidor local diferente
    "null" # Adicionado para permitir requisições de file://
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"], # Permite todos os cabeçalhos
)

@app.get("/")
async def root():
    return {"message": "API de Registro e Monitoramento de Atividades Físicas"}

# Endpoints para Atividades
@app.post("/atividades/", response_model=schemas.Atividade)
def create_atividade_endpoint(atividade: schemas.AtividadeCreate, db: Session = Depends(get_db)):
    return crud.create_atividade(db=db, atividade=atividade)

@app.get("/atividades/", response_model=List[schemas.Atividade])
def read_atividades_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    atividades = crud.get_atividades(db, skip=skip, limit=limit)
    return atividades

@app.get("/atividades/{atividade_id}", response_model=schemas.Atividade)
def read_atividade_endpoint(atividade_id: int, db: Session = Depends(get_db)):
    db_atividade = crud.get_atividade(db, atividade_id=atividade_id)
    if db_atividade is None:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    return db_atividade

# Endpoints para Sessões
@app.post("/sessoes/", response_model=schemas.Sessao)
def create_sessao_endpoint(sessao: schemas.SessaoCreate, db: Session = Depends(get_db)):
    # Verifica se a atividade existe
    db_atividade = crud.get_atividade(db, atividade_id=sessao.atividade_id)
    if db_atividade is None:
        raise HTTPException(status_code=404, detail=f"Atividade com id {sessao.atividade_id} não encontrada")
    return crud.create_sessao(db=db, sessao=sessao)

@app.get("/sessoes/", response_model=List[schemas.Sessao])
def read_sessoes_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    sessoes = crud.get_sessoes(db, skip=skip, limit=limit)
    return sessoes

@app.get("/sessoes_por_tipo/", response_model=List[schemas.Sessao])
def read_sessoes_por_tipo_endpoint(tipo: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    sessoes = crud.get_sessoes_por_tipo(db, tipo_atividade=tipo, skip=skip, limit=limit)
    if not sessoes:
        return []
    return sessoes

@app.get("/sessoes_por_data/", response_model=List[schemas.Sessao])
def read_sessoes_por_data_endpoint(data: date, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    sessoes = crud.get_sessoes_por_data(db, data_sessao=data, skip=skip, limit=limit)
    if not sessoes:
        return []
    return sessoes

@app.delete("/sessoes/{sessao_id}", response_model=schemas.Sessao)
def delete_sessao_endpoint(sessao_id: int, db: Session = Depends(get_db)):
    db_sessao = crud.delete_sessao(db, sessao_id=sessao_id)
    if db_sessao is None:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    return db_sessao 