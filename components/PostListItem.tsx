import { useState } from 'react'
import { StyleSheet, Pressable } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { LinearGradient } from 'expo-linear-gradient'

import { Post } from '../types'
import { getTimeSinceCreated, editPost } from '../utils'

interface PostListItemProps {
  post: Post
  showFullPost: (post: Post) => void
  showComments: (post: Post) => void
}

export default function PostListItem({
  post,
  showFullPost,
  showComments,
}: PostListItemProps) {
  const { title, created_at, num_hugs, patient_description, comments } = post

  const [hugs, setHugs] = useState<number>(num_hugs)

  const handlePressFavorite = async () => {
    post['num_hugs']++
    await editPost(post)
    const totalHugs = hugs + 1
    setHugs(totalHugs)
  }

  const handlePressComments = () => {
    showComments(post)
  }

  const handlePressPost = () => {
    showFullPost(post)
  }

  return (
    <ThemedView style={styles.postContainer}>
      <Pressable onPress={handlePressPost}>
        <ThemedText type='title' style={styles.titleText}>
          {title}
        </ThemedText>
        <ThemedView style={styles.descriptionContainer}>
          <ThemedText style={styles.descriptionText}>
            <ThemedText type='defaultSemiBold'>
              Patient Description:{' '}
            </ThemedText>
            <ThemedText>{patient_description}</ThemedText>
          </ThemedText>
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgb(255,255,255)']}
            style={styles.fadeOverlay}
          />
        </ThemedView>
      </Pressable>
      <ThemedView style={styles.postFooterContainer}>
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
          <Pressable onPress={handlePressComments}>
            <ThemedView style={styles.iconButtonContainer}>
              <Icon
                name='comment-multiple'
                size={18}
                color={
                  Object.keys(comments).length
                    ? 'rgb(255, 126, 179)'
                    : 'rgba(0, 0, 0, 0.3)'
                }
              />
              <ThemedText
                type='label'
                style={{
                  color: Object.keys(comments).length
                    ? 'rgb(255, 126, 179)'
                    : 'rgba(0, 0, 0, 0.3)',
                }}
              >
                &nbsp;&nbsp;{Object.keys(comments).length}
              </ThemedText>
            </ThemedView>
          </Pressable>
          <ThemedView style={styles.iconButtonContainer}>
            <Icon name='bookmark' size={18} color={'rgba(0, 0, 0, 0.3)'} />
          </ThemedView>
        </ThemedView>
        <ThemedText type='label' style={styles.timeText}>
          {getTimeSinceCreated(created_at)}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  postContainer: {
    padding: 16,
    borderRadius: 8,
  },
  titleText: {
    color: 'rgb(68, 68, 68)',
  },
  descriptionContainer: {
    maxHeight: 100,
    marginTop: 8,
    overflow: 'hidden',
  },
  descriptionText: {
    color: 'rgb(136, 136, 136)',
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    textAlign: 'center',
    margin: 0,
    paddingBottom: 24,
    paddingHorizontal: 0,
    // backgroundImage: 'linear-gradient(to bottom, transparent, white)',
  },
  postFooterContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: 'rgba(0, 0, 0, 0.3)',
  },
})
