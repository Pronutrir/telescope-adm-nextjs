'use client'

import NpsCard from './NpsCard'
import type { IRating } from '@/types/nps'

interface AnswersListCardsProps {
  data: IRating[]
  isSuccess: boolean
  calcPercent: (total: number, part: number) => string
}

export function AnswersListCards({ data, isSuccess, calcPercent }: AnswersListCardsProps) {
  const total = data.length
  const withComments = data.filter((i) => Boolean(i.comentario)).length
  const withoutComments = total - withComments
  const replied = data.filter((i) => i.reply).length
  const notReplied = data.filter((i) => !i.reply).length
  const pct = (n: number) => (isSuccess && total > 0 ? `${calcPercent(total, n)}%` : '0%')

  const cards = [
    { value: total, label: 'Total de pesquisas' },
    { value: withComments, label: 'Total com comentários', pct: pct(withComments) },
    { value: withoutComments, label: 'Total sem comentários', pct: pct(withoutComments) },
    { value: replied, label: 'Total respondidos', pct: pct(replied) },
    { value: notReplied, label: 'Total não respondidos', pct: pct(notReplied) },
  ]

  return (
    <div className="flex flex-wrap gap-4">
      {cards.map((c) => (
        <div key={c.label} className="flex-1 min-w-[140px] max-w-[200px]">
          <NpsCard.Root height="7.5rem" className="gap-0">
            <NpsCard.Wrapper>
              <NpsCard.TotalText>{c.value}</NpsCard.TotalText>
            </NpsCard.Wrapper>
            <NpsCard.Legend>{c.label}</NpsCard.Legend>
            {c.pct && <NpsCard.Legend>{c.pct}</NpsCard.Legend>}
          </NpsCard.Root>
        </div>
      ))}
    </div>
  )
}
