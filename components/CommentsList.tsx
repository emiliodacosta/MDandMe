import { useState, useMemo } from 'react'
import { StyleSheet, Button, TextInput } from 'react-native'

import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from './ThemedText'
import CommentListItem from './CommentListItem'

import { Post, Comment } from '../types'
import { editPost } from '@/utils'

interface CommentsProps {
  post: Post
  handleReturnToList: () => void
  handleReturnToPost: () => void
  parentId: null | number
  makeParentAwareOfChildComment?: () => void
}

export default function CommentsList({
  post,
  handleReturnToList,
  handleReturnToPost,
  parentId,
  makeParentAwareOfChildComment,
}: CommentsProps) {
  const { comments } = post

  const [childCommentsMap, setChildCommentsMap] = useState<{
    [x: string]: number
  }>({})

  const [toggleReloadComments, setToggleReloadComments] =
    useState<boolean>(false)

  const sortedFilteredCommentsArray = useMemo(() => {
    if (Object.keys(comments).length) {
      const commentsArray: Comment[] = []
      const replyCounter: { [x: string]: number } = {}
      for (let numberedCommentId in comments) {
        const currentComment = comments[numberedCommentId]
        const currentCommentParentId = currentComment.parent_id
        if (currentCommentParentId === parentId) {
          commentsArray.push(comments[numberedCommentId])
        } else {
          if (currentCommentParentId !== null) {
            replyCounter[currentCommentParentId] = replyCounter[
              currentCommentParentId
            ]
              ? replyCounter[currentCommentParentId] + 1
              : 1
            setChildCommentsMap(replyCounter)
          }
        }
      }
      if (commentsArray.length) {
        commentsArray.sort(
          (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
        )
        return commentsArray
      }
    } else {
      return null
    }
  }, [comments, toggleReloadComments])

  const renderComments = (sortedFilteredCommentsArray: Comment[]) => {
    return sortedFilteredCommentsArray.map((comment) => {
      const commentId = comment.id
      return (
        <CommentListItem
          key={commentId}
          comment={comment}
          handleEditComment={handleEditComment}
          num_replies={childCommentsMap[commentId] ?? 0}
          post={post}
          handleReturnToList={handleReturnToList}
          handleReturnToPost={handleReturnToPost}
        />
      )
    })
  }

  const [inputText, setInputText] = useState<string>('')

  const handleEditComment = async (comment: Comment) => {
    const commentId = comment.id.toString()
    post.comments[commentId] = comment
    await editPost(post)
  }

  const handleSubmitComment = async () => {
    const newCommentId = Object.keys(comments).length + 1
    const newCommentIdString = newCommentId.toString()
    const newComment: Comment = {
      id: newCommentId,
      parent_id: parentId,
      display_name: 'MDandMe',
      text: inputText,
      // "created_at": "2024-02-15T19:43:03.999084" format from data.json
      // vs '2024-07-16T21:46:50.784Z'
      // both work with Date.parse used in getTimeSinceCreated from @/utils
      created_at: new Date(Date.now()).toISOString(),
      num_hugs: 0,
    }
    const currentCommentsObject = post.comments
    currentCommentsObject[newCommentIdString] = newComment
    const editedPost = await editPost(post)
    setInputText('')
    if (editedPost && makeParentAwareOfChildComment) {
      setToggleReloadComments(!toggleReloadComments)
      makeParentAwareOfChildComment()
    }
  }

  return (
    <>
      <ThemedView
        style={{
          paddingVertical: 16,
          paddingLeft: 16,
          paddingRight: parentId === null ? 16 : 0,
        }}
      >
        {parentId === null && (
          <>
            <Button onPress={handleReturnToPost} title='Return to Post' />
            <Button onPress={handleReturnToList} title='Return to Posts List' />
            <ThemedText type='title' style={styles.commentOnOpText}>
              Comment on Original Post
            </ThemedText>
          </>
        )}
        <TextInput
          multiline
          numberOfLines={4}
          onChangeText={setInputText}
          value={inputText}
          style={styles.commentTextInput}
        ></TextInput>
        <Button
          onPress={handleSubmitComment}
          title='Submit Comment'
          disabled={!inputText.trim()}
        />
        <ThemedText type='title' style={styles.numberOfCommentsText}>
          {sortedFilteredCommentsArray?.length === 1
            ? '1 Comment'
            : sortedFilteredCommentsArray?.length
            ? `${sortedFilteredCommentsArray?.length} Comments`
            : ''}
        </ThemedText>

        <ThemedView style={styles.commentListContainer}>
          {Object.keys(comments).length && sortedFilteredCommentsArray
            ? renderComments(sortedFilteredCommentsArray)
            : null}
        </ThemedView>
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  commentOnOpText: {
    marginTop: 10,
    color: 'rgb(136, 136, 136)',
  },
  commentTextInput: {
    borderWidth: 2,
    borderColor: 'rgb(136, 136, 136)',
    color: 'rgb(136, 136, 136)',
    fontSize: 16,
    marginTop: 8,
  },
  numberOfCommentsText: {
    marginTop: 10,
    color: 'rgb(136, 136, 136)',
  },
  commentListContainer: {
    borderTopWidth: 2,
    borderColor: 'rgb(244, 246, 249)',
  },
})
