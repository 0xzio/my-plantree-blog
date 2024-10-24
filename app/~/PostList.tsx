'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { loadPost, Post, postAtom } from '@/hooks/usePost'
import { postLoadingAtom } from '@/hooks/usePostLoading'
import { usePosts } from '@/hooks/usePosts'
import { PostStatus } from '@/lib/constants'
import { api } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { store } from '@/store'
import { format } from 'date-fns'
import { Edit3Icon, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface PostItemProps {
  post: Post
}

export function PostItem({ post }: PostItemProps) {
  const { push } = useRouter()
  const { refetch } = usePosts()

  async function toPost(needRoute = true) {
    loadPost(post.id)
    if (needRoute) {
      push(`/~/post/${post.id}`)
    }
  }

  return (
    <div className={cn('flex flex-col gap-2 py-[6px]')}>
      <div>
        <Link
          href={`/~/post/${post.id}`}
          className="inline-flex items-center hover:scale-105 transition-transform"
          onClick={() => {
            toPost(false)
          }}
        >
          <div className="text-base font-bold">{post.title || 'Untitled'}</div>
        </Link>
      </div>
      <div className="flex gap-2">
        {post.postTags.map((item) => (
          <Badge key={item.id} variant="outline">
            {item.tag.name}
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-zinc-500">
          <div>{format(new Date(post.updatedAt), 'yyyy-MM-dd')}</div>
        </div>
        <Button
          size="xs"
          variant="ghost"
          className="rounded-full text-xs h-7 gap-1 opacity-50"
          onClick={() => toPost()}
        >
          <Edit3Icon size={14}></Edit3Icon>
          <div>Edit</div>
        </Button>

        <Button
          size="xs"
          variant="ghost"
          className="rounded-full text-xs h-7 text-red-500 gap-1 opacity-60"
          onClick={async () => {
            await api.post.delete.mutate(post.id)
            refetch()
          }}
        >
          <Trash2 size={14}></Trash2>
          <div>Delete</div>
        </Button>
      </div>
    </div>
  )
}

interface PostListProps {
  status: PostStatus
}
export function PostList({ status }: PostListProps) {
  const { data = [], isLoading } = usePosts()

  if (isLoading) return <div className="text-neutral-500">Loading...</div>

  const posts = data.filter((post) => post.postStatus === status)

  if (!posts.length) {
    return <div className="text-neutral-500">No posts yet.</div>
  }

  return (
    <div className="grid gap-4">
      {posts.map((post) => {
        return <PostItem key={post.id} post={post} />
      })}
    </div>
  )
}
