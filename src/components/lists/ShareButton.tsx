import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/toast/useToast'
import { useShareList } from '@/hooks/queries'
import { copyText } from '@/lib/clipboard'

/** Copies the list's share link. For now the link is a placeholder from the data layer. */
export function ShareButton({ listId }: { listId: string }) {
  const toast = useToast()
  const share = useShareList()

  const onClick = async () => {
    const url = share.mutateAsync(listId)
    const copied = await copyText(url)
    if (copied) {
      toast.show('Link copied (placeholder link for now)')
    } else {
      // Couldn't touch the clipboard: show the link so it can still be copied by hand.
      toast.show(`Your link: ${await url.catch(() => 'unavailable right now')}`)
    }
  }

  return (
    <Button variant="secondary" onClick={onClick} disabled={share.isPending}>
      <Share2 aria-hidden className="h-5 w-5" />
      Share
    </Button>
  )
}
