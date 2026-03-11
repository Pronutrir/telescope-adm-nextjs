/**
 * 🔔 NOTIFICATION SYSTEM EXPORTS
 * 
 * Arquivo de exportação centralizado para o sistema de notificações
 */

// Contexto e tipos
export {
  NotificationProvider,
  useNotifications,
  useNotify,
  useNotify as useQuickNotify, // Alias para facilitar o uso
  type Notification,
  type NotificationType,
  type NotificationPosition,
  type NotificationAction,
  type NotificationConfig
} from '@/contexts/NotificationContext'

// Componente visual
export { default as NotificationContainer } from './NotificationContainer'
