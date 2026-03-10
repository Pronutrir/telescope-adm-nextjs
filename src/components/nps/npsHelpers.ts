import type { IUnidades } from '@/types/nps'

// --- Constantes ---

export const UNIDADES: IUnidades[] = [
  { cdUnidade: '7', dsUnidade: 'PRONUTRIR ONCOLOGIA' },
  { cdUnidade: '8', dsUnidade: 'PRONUTRIR CARIRI' },
  { cdUnidade: '12', dsUnidade: 'PRONUTRIR SOBRAL' },
]

export const CLASSIFICATION_MAP: Record<string, string> = {
  '1': 'ELOGIO',
  '2': 'QUEIXA',
  '3': 'MELHORIA',
  '4': 'NOTIFICAÇÃO',
  '5': 'SUGESTÃO',
  '6': 'AGRADECIMENTO',
  '7': 'NEUTRO',
}

export const SUBCLASSIFICATION_MAP: Record<string, string> = {
  '1': 'Geral',
  '2': 'Equipe Médica',
  '3': 'Atendimento',
  '4': 'Estacionamento',
  '5': 'Infraestrutura',
  '6': 'Outros',
  '7': 'Atraso',
  '8': 'Café/Água',
  '9': 'Atraso na autorização',
  '10': 'Limpeza',
  '11': 'Comunicação com a empresa',
  '12': 'Serviços',
  '13': 'Especialidade',
}

export const CLASSIFICATION_NAME_MAP: Record<string, string> = {
  Praise: 'Elogio',
  Complaint: 'Queixa',
  Improvement: 'Melhoria',
  Notification: 'Notificação',
  Suggestion: 'Sugestão',
  Gratitude: 'Agradecimento',
  Neutral: 'Neutro',
}

export const SUBCLASSIFICATION_NAME_MAP: Record<string, string> = {
  General: 'Geral',
  MedicalTeam: 'Equipe Médica',
  Service: 'Atendimento',
  Parking: 'Estacionamento',
  Infrastructure: 'Infraestrutura',
  Others: 'Outros',
  Delay: 'Atraso',
  CoffeeWater: 'Café/Água',
  AuthorizationDelay: 'Atraso na autorização',
  Cleaning: 'Limpeza',
  CompanyComunication: 'Comunicação com a empresa',
  Services: 'Serviços',
  Specialty: 'Especialidade',
}

// --- Render helpers ---

export function renderUnidadeName(unidadeCode: string): string {
  const unidade = UNIDADES.find((u) => u.cdUnidade === unidadeCode)
  return unidade?.dsUnidade ?? '--'
}

export function renderClassification(code: string): string {
  return CLASSIFICATION_MAP[code] ?? '--'
}

export function renderSubclassification(code: string): string {
  return SUBCLASSIFICATION_MAP[code] ?? '--'
}

export function renderClassificationName(name: string): string {
  return CLASSIFICATION_NAME_MAP[name] ?? name
}

export function renderSubclassificationName(name: string): string {
  return SUBCLASSIFICATION_NAME_MAP[name] ?? name
}

export function renderQuestStars(rawValue?: string | null): string | null {
  if (!rawValue) return null

  const starCountFromRaw = rawValue.match(/⭐/g)?.length
  if (starCountFromRaw && starCountFromRaw > 0) {
    return '⭐️'.repeat(Math.min(5, starCountFromRaw))
  }

  const numeric = Number(String(rawValue).trim())
  if (!Number.isNaN(numeric) && numeric >= 1 && numeric <= 5) {
    return '⭐️'.repeat(numeric)
  }

  const normalized = String(rawValue)
    .replace(/[⭐️]/g, '')
    .replace(/_/g, ' ')
    .trim()
    .toLowerCase()

  const scoreMap: Record<string, number> = {
    'muito insatisfeito': 1,
    'insatisfeito': 2,
    'indiferente': 3,
    'satisfeito': 4,
    'muito satisfeito': 5,
  }

  const score = scoreMap[normalized]
  if (!score) return null

  return '⭐️'.repeat(score)
}
