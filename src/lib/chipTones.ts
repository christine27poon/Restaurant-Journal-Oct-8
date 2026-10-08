export type ChipTone = 'neutral' | 'honey' | 'leaf' | 'mist' | 'primary'

export const chipToneClasses: Record<ChipTone, string> = {
  neutral: 'bg-surface-sunken text-ink-soft',
  honey: 'bg-honey-bg text-honey-fg',
  leaf: 'bg-leaf-bg text-leaf-fg',
  mist: 'bg-mist-bg text-mist-fg',
  primary: 'bg-primary-50 text-primary-700',
}
