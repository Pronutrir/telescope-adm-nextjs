import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utilitário para combinar classes CSS de forma inteligente
 * Combina clsx e tailwind-merge para resolver conflitos de classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utilitário para formatar números
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pt-BR').format(num)
}

/**
 * Utilitário para formatar moeda
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

/**
 * Utilitário para formatar porcentagem
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100)
}

/**
 * Utilitário para gerar cores aleatórias para avatares
 */
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-cyan-500'
  ]
  
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

/**
 * Utilitário para truncar texto
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
