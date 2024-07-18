import { useState } from 'react'
import { StyleSheet, Pressable, ScrollView } from 'react-native'

import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from './ThemedText'
import CommentsList from './CommentsList'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Comment, Post } from '../types'
import { getTimeSinceCreated } from '@/utils'

interface CommentListItemProps {
  comment: Comment
  handleEditComment: (comment: Comment) => void
  num_replies: number
  post: Post
  handleReturnToList: () => void
  handleReturnToPost: () => void
}

export default function CommentListItem({
  comment,
  handleEditComment,
  num_replies,
  post,
  handleReturnToList,
  handleReturnToPost,
}: CommentListItemProps) {
  const { display_name, text, created_at, num_hugs } = comment

  const [hugs, setHugs] = useState<number>(num_hugs)
  const [currentNumReplies, setCurrentNumReplies] =
    useState<number>(num_replies)
  const [showRepliesAndCommentInput, setShowRepliesAndCommentInput] =
    useState<boolean>(false)

  const handlePressFavorite = async () => {
    comment['num_hugs']++
    handleEditComment(comment)
    const totalHugs = hugs + 1
    setHugs(totalHugs)
  }

  const handlePressComment = () => {
    setShowRepliesAndCommentInput(!showRepliesAndCommentInput)
  }

  const handleNewComment = () => {
    const totalReplies = currentNumReplies + 1
    setCurrentNumReplies(totalReplies)
  }

  return (
    <ScrollView>
      <ThemedView style={styles.commentContainer}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText type='title' style={styles.nameText}>
            {display_name}
          </ThemedText>
          <ThemedText type='label' style={styles.timeText}>
            {getTimeSinceCreated(created_at)}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.descriptionContainer}>
          <ThemedText>
            <ThemedText style={styles.descriptionText}>{text}</ThemedText>
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.iconContainer}>
          <Pressable onPress={handlePressFavorite}>
            <ThemedView style={styles.iconButtonContainer}>
              <Icon
                name='heart'
                size={18}
                color={
                  num_hugs > 0 ? 'rgb(255, 126, 179)' : 'rgba(0, 0, 0, 0.3)'
                }
              />
              <ThemedText
                type='label'
                style={{
                  color:
                    num_hugs > 0 ? 'rgb(255, 126, 179)' : 'rgba(0, 0, 0, 0.3)',
                }}
              >
                &nbsp;&nbsp;{num_hugs}
              </ThemedText>
            </ThemedView>
          </Pressable>
          <Pressable onPress={handlePressComment}>
            <ThemedView style={styles.iconButtonContainer}>
              <Icon
                name='comment-multiple'
                size={18}
                color={
                  currentNumReplies > 0
                    ? 'rgb(255, 126, 179)'
                    : 'rgba(0, 0, 0, 0.3)'
                }
              />
              <ThemedText
                type='label'
                style={{
                  color:
                    num_replies > 0
                      ? 'rgb(255, 126, 179)'
                      : 'rgba(0, 0, 0, 0.3)',
                }}
              >
                &nbsp;&nbsp;{currentNumReplies ?? 0}
              </ThemedText>
            </ThemedView>
          </Pressable>
          <ThemedView style={styles.iconButtonContainer}>
            <Icon name='bookmark' size={18} color={'rgba(0, 0, 0, 0.3)'} />
          </ThemedView>
        </ThemedView>
      </ThemedView>
      {showRepliesAndCommentInput && (
        <CommentsList
          post={post}
          handleReturnToList={handleReturnToList}
          handleReturnToPost={handleReturnToPost}
          parentId={comment.id}
          makeParentAwareOfChildComment={handleNewComment}
        />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  commentContainer: {
    marginTop: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nameText: {
    color: 'rgb(68, 68, 68)',
  },
  timeText: {
    color: 'rgba(0, 0, 0, 0.3)',
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionText: {
    color: 'rgb(136, 136, 136)',
  },
  iconContainer: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 10,
  },
  iconButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
