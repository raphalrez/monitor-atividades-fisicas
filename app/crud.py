from sqlalchemy.orm import Session, joinedload
from . import models, schemas
from datetime import date

# Funções CRUD para Atividades
def get_atividade(db: Session, atividade_id: int):
    return db.query(models.AtividadeDB).filter(models.AtividadeDB.id == atividade_id).first()

def get_atividades(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.AtividadeDB).offset(skip).limit(limit).all()

def create_atividade(db: Session, atividade: schemas.AtividadeCreate):
    db_atividade = models.AtividadeDB(nome=atividade.nome)
    db.add(db_atividade)
    db.commit()
    db.refresh(db_atividade)
    return db_atividade

# Funções CRUD para Sessões
def get_sessao(db: Session, sessao_id: int):
    return db.query(models.SessaoDB).options(joinedload(models.SessaoDB.atividade)).filter(models.SessaoDB.id == sessao_id).first()

def get_sessoes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.SessaoDB).options(joinedload(models.SessaoDB.atividade)).offset(skip).limit(limit).all()

def create_sessao(db: Session, sessao: schemas.SessaoCreate):
    db_sessao = models.SessaoDB(**sessao.dict())
    db.add(db_sessao)
    db.commit()
    db.refresh(db_sessao)
    return db_sessao

def delete_sessao(db: Session, sessao_id: int):
    db_sessao = db.query(models.SessaoDB).options(joinedload(models.SessaoDB.atividade)).filter(models.SessaoDB.id == sessao_id).first()
    if db_sessao:
        db.delete(db_sessao)
        db.commit()
        return db_sessao
    return None

def get_sessoes_por_tipo(db: Session, tipo_atividade: str, skip: int = 0, limit: int = 100):
    return db.query(models.SessaoDB).join(models.AtividadeDB).options(joinedload(models.SessaoDB.atividade)).filter(models.AtividadeDB.nome == tipo_atividade).offset(skip).limit(limit).all()

def get_sessoes_por_data(db: Session, data_sessao: date, skip: int = 0, limit: int = 100):
    return db.query(models.SessaoDB).options(joinedload(models.SessaoDB.atividade)).filter(models.SessaoDB.data == data_sessao).offset(skip).limit(limit).all() 