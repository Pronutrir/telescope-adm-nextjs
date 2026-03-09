import { cn } from '@/lib/utils'

interface NpsCardLegendProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
  fontSize?: string
}

export function NpsCardLegend({ children, className, fontSize, style, ...rest }: NpsCardLegendProps) {
  return (
    <p
      {...rest}
      style={fontSize ? { fontSize, ...style } : style}
      className={cn(
        'flex justify-start self-center text-center text-gray-600 dark:text-gray-300 p-0 m-0 font-medium',
        'max-[600px]:text-xs 2xl:text-sm max-[1536px]:text-xs',
        className,
      )}
    >
      {children}
    </p>
  )
}
