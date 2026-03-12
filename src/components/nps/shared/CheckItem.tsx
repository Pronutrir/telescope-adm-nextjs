import { cn } from '@/lib/utils'
import { Check, Minus } from 'lucide-react'

interface CheckItemProps {
  label: React.ReactNode
  checked: boolean
  indeterminate?: boolean
  onChange: (checked: boolean) => void
}

export function CheckItem({ label, checked, indeterminate, onChange }: CheckItemProps) {
  return (
    <label
      className="flex cursor-pointer items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm hover:bg-white dark:hover:bg-white/5 transition-colors group"
      onClick={() => onChange(!checked)}
    >
      <span
        className={cn(
          'flex items-center justify-center w-4 h-4 rounded border-2 shrink-0 transition-all duration-150',
          checked
            ? 'bg-cyan-600 border-cyan-600'
            : indeterminate
              ? 'bg-white dark:bg-transparent border-cyan-500'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent group-hover:border-cyan-400',
        )}
      >
        {checked && <Check size={10} className="text-white" strokeWidth={3} />}
        {!checked && indeterminate && <Minus size={10} className="text-cyan-500" strokeWidth={3} />}
      </span>
      <span className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors leading-tight">
        {label}
      </span>
    </label>
  )
}
