import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface NpsCardIconProps {
  icon: React.ElementType<React.SVGProps<SVGSVGElement>> | LucideIcon
  width?: string | number
  height?: string | number
  stroke?: string
  fill?: string
  color?: string
  style?: React.CSSProperties
  className?: string
}

export function NpsCardIcon({
  icon: Icon,
  width = 28,
  height = 28,
  className,
  style,
  ...rest
}: NpsCardIconProps) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center self-center',
        'w-[50px] h-[50px] max-[1536px]:w-[40px] max-[1536px]:h-[40px]',
        'bg-blue-50 dark:bg-[rgba(244,247,255,0.1)] border border-blue-100 dark:border-white/10',
        className,
      )}
      style={style}
    >
      <Icon width={width} height={height} {...rest} className="self-center" />
    </div>
  )
}
