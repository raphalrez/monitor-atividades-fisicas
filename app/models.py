from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
from datetime import date # Importação necessária para o Column Date

# Modelos SQLAlchemy (Tabelas do Banco)
class AtividadeDB(Base):
    __tablename__ = "atividades"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)

    sessoes = relationship("SessaoDB", back_populates="atividade")

class SessaoDB(Base):
    __tablename__ = "sessoes"

    id = Column(Integer, primary_key=True, index=True)
    data = Column(Date) # Mantém o tipo Date do SQLAlchemy
    duracao_minutos = Column(Integer)
    observacoes = Column(String, nullable=True)
    atividade_id = Column(Integer, ForeignKey("atividades.id"))

    atividade = relationship("AtividadeDB", back_populates="sessoes")