from pydantic import BaseModel
from typing import Optional, List
from datetime import date

# Modelos Pydantic (para validação e serialização)

# --- Modelos para Atividade ---
# Definir Atividade primeiro, pois Sessao depende dela.
class AtividadeBase(BaseModel):
    nome: str

class AtividadeCreate(AtividadeBase):
    pass

class Atividade(AtividadeBase):
    id: int
    # sessoes: List['Sessao'] = [] # Para dependência circular, usar string ou PostponedAnnotation
                                 # Mas vamos manter simples por agora, AtividadeComSessoes fará isso.
    class Config:
        from_attributes = True

# --- Modelos para Sessão ---
class SessaoBase(BaseModel):
    data: date
    duracao_minutos: int
    observacoes: Optional[str] = None

class SessaoCreate(SessaoBase):
    atividade_id: int # Para criação, ainda recebemos o ID

class Sessao(SessaoBase): # Este será o schema de resposta principal para sessões
    id: int
    atividade: Atividade # Agora Atividade está definida

    class Config:
        from_attributes = True


# --- Schemas Compostos (Opcional, para respostas mais ricas) ---

# Schema para Atividade que inclui suas Sessões
class AtividadeComSessoes(Atividade):
    # Para evitar NameError se Sessao fosse definida depois e Atividade precisasse dela:
    # sessoes: List["Sessao"] = [] # Usar string para forward reference
    # Mas como Sessao já está definida acima, podemos usar diretamente:
    sessoes: List[Sessao] = []

    class Config:
        from_attributes = True

# O schema SessaoComAtividade que tínhamos antes não é mais estritamente necessário
# se o schema Sessao principal já embute Atividade.
# Removendo para simplificar, mas pode ser recriado se um schema específico for desejado.
# class SessaoComAtividade(Sessao): 
# atividade: Atividade

# Podemos remover SessaoComAtividade se Sessao já inclui Atividade.
# Mantendo apenas para referência caso você queira um schema específico.
# Se não for usar SessaoComAtividade, pode deletar.
class SessaoComAtividadeAntigo(SessaoBase): # Exemplo se Sessao não tivesse Atividade embutido
    id: int
    atividade: Atividade
    class Config:
        from_attributes = True 