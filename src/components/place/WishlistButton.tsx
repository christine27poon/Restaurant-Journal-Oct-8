import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/toast/useToast'
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/queries'
import { cn } from '@/lib/cn'

/** Toggle: save a place to "Want to try" or take it off again. */
export function WishlistButton({ placeId }: { placeId: string }) {
  const toast = useToast()
  const wishlist = useWishlist()
  const add = useAddToWishlist()
  const remove = useRemoveFromWishlist()

  const entry = wishlist.data?.find((item) => item.place_id === placeId && item.status === 'want')
  const busy = add.isPending || remove.isPending || wishlist.isPending

  const toggle = () => {
    if (entry) {
      remove.mutate(entry.id, { onSuccess: () => toast.show('Removed from Want to try') })
    } else {
      add.mutate({ placeId }, { onSuccess: () => toast.show('Saved to Want to try') })
    }
  }

  return (
    <Button
      variant={entry ? 'primary' : 'secondary'}
      aria-pressed={Boolean(entry)}
      disabled={busy}
      onClick={toggle}
    >
      <Heart aria-hidden className={cn('h-5 w-5', entry && 'fill-current')} />
      {entry ? 'On your Want to try list' : 'Save to wishlist'}
    </Button>
  )
}
