import { cn } from '@/lib/utils'

interface NpsCardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  themeColor?: 'dark' | 'light'
  height?: string
}

export function NpsCardRoot({ children, className, themeColor: _themeColor, height, style, ...rest }: NpsCardRootProps) {
  return (
    <div
      {...rest}
      style={height ? { height, ...style } : style}
      className={cn(
        'flex flex-col justify-start place-self-center rounded-[15px] w-full p-0',
        'border border-gray-200 dark:border-gray-700/50',
        'bg-white dark:bg-[rgba(25,30,52,0.7)]',
        'shadow-sm',
        'h-40 2xl:h-36 max-[1536px]:h-[8.2rem]',
        height && 'h-auto 2xl:h-auto max-[1536px]:h-auto',
        className,
      )}
    >
      {children}
    </div>
  )
}
