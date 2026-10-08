import { Quote } from 'lucide-react'
import { formatVisitDate } from '@/lib/format'

interface StoryBlockProps {
  story: string
  visitedAt: string
  dishName: string | null
}

/** "The story": who you met, what you learned about the owner. */
export function StoryBlock({ story, visitedAt, dishName }: StoryBlockProps) {
  return (
    <figure className="rounded-xl border border-sage-100 bg-sage-50 p-5">
      <Quote aria-hidden className="mb-2 h-5 w-5 text-sage-700" />
      <blockquote className="font-display text-lead leading-relaxed text-sage-800">
        {story}
      </blockquote>
      <figcaption className="mt-3 text-small text-sage-700">
        From your visit {formatVisitDate(visitedAt).toLowerCase()}
        {dishName ? ` · ${dishName}` : ''}
      </figcaption>
    </figure>
  )
}
