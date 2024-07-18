import { Post } from './types'

const POSTS_API_URL = 'http://localhost:3000/posts'

export const fetchPosts = async () => {
  const res = await fetch(POSTS_API_URL)
  if (res.ok) {
    const resObj: Post[] = await res.json()
    return resObj
  }
}

export const editPost = async (reqBody: Post) => {
  const id = reqBody.id
  // needed to create an object with "posts" as property and the entire original
  // array as a key and add "id" as a property to each post in data.json
  const res = await fetch(`${POSTS_API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqBody),
  })
  if (res.ok) {
    const resObj: Post[] = await res.json()
    return resObj
  }
}

export const getTimeSinceCreated = (createdAt: string): string => {
  const secondsSinceCreated = Math.round(
    (Date.now() - Date.parse(createdAt)) / 1000
  )
  let minutesSinceCreated
  let hoursSinceCreated
  let daysSinceCreated
  if (secondsSinceCreated > 59) {
    minutesSinceCreated = Math.round(secondsSinceCreated / 60)
    if (minutesSinceCreated > 59) {
      hoursSinceCreated = Math.round(minutesSinceCreated / 60)
      if (hoursSinceCreated > 23) {
        daysSinceCreated = Math.round(hoursSinceCreated / 24)
      }
    }
  }
  if (daysSinceCreated) {
    return daysSinceCreated > 1
      ? daysSinceCreated + ' days ago'
      : daysSinceCreated + ' day ago'
  }
  if (hoursSinceCreated) {
    return hoursSinceCreated > 1
      ? hoursSinceCreated + ' hrs ago'
      : hoursSinceCreated + ' hr ago'
  }
  if (minutesSinceCreated) {
    return minutesSinceCreated > 1
      ? minutesSinceCreated + ' mins ago'
      : minutesSinceCreated + ' min ago'
  }
  return secondsSinceCreated > 1
    ? secondsSinceCreated + ' secs ago'
    : secondsSinceCreated + ' sec ago'
}
