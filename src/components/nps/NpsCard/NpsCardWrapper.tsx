import { cn } from '@/lib/utils'

interface NpsCardWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function NpsCardWrapper({ children, className, ...rest }: NpsCardWrapperProps) {
  return (
    <div {...rest} className={cn('flex flex-row justify-center', className)}>
      {children}
    </div>
  )
}
