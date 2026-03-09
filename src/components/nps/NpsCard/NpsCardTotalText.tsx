import { cn } from '@/lib/utils'

interface NpsCardTotalTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

export function NpsCardTotalText({ children, className, ...rest }: NpsCardTotalTextProps) {
  return (
    <p
      {...rest}
      className={cn(
        'font-semibold m-[2px] text-center text-gray-800 dark:text-white text-[45px] max-2xl:text-[35px]',
        className,
      )}
    >
      {children}
    </p>
  )
}
