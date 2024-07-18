import { useState } from 'react'
import {
  StyleSheet,
  Pressable,
  Button,
  Platform,
  ScrollView,
} from 'react-native'

import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from './ThemedText'

import Markdown from 'react-native-marked'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Post } from '../types'
import { getTimeSinceCreated, editPost } from '@/utils'

interface PostDetailProps {
  post: Post
  handleReturnToList: () => void
  showComments: () => void
}

const defaultTextGray = 'rgb(136, 136, 136)'

export default function PostDetail({
  post,
  handleReturnToList,
  showComments,
}: PostDetailProps) {
  const {
    title,
    created_at,
    num_hugs,
    patient_description,
    assessment,
    comments,
  } = post

  const [hugs, setHugs] = useState<number>(num_hugs)

  const handlePressFavorite = async () => {
    post['num_hugs']++
    await editPost(post)
    const totalHugs = hugs + 1
    setHugs(totalHugs)
  }

  const handlePressComments = () => {
    showComments()
  }

  return (
    <ScrollView style={{ marginTop: Platform.OS === 'android' ? 0 : 16 }}>
      <ThemedView style={styles.contentContainer}>
        <Button onPress={handleReturnToList} title='Return to Posts List' />
        <ThemedText type='title' style={styles.titleText}>
          {title}
        </ThemedText>
        <ThemedView style={styles.postDescriptionContainer}>
          <ThemedText style={styles.patientDescriptionText}>
            <ThemedText type='defaultSemiBold'>
              Patient Description:{' '}
            </ThemedText>
            <ThemedText>{patient_description}</ThemedText>
          </ThemedText>
          <ThemedText type='defaultSemiBold' style={styles.assessmentTitleText}>
            Assessment:{' '}
          </ThemedText>
          <ThemedView>
            {/* Markdown component causes Console Error:
            VirtualizedLists should never be nested inside plain ScrollViews */}
            <Markdown
              value={assessment}
              theme={{
                colors: {
                  code: defaultTextGray,
                  link: defaultTextGray,
                  text: defaultTextGray,
                  border: defaultTextGray,
                },
              }}
              styles={{
                h3: {
                  fontSize: 16,
                  marginBottom: 0,
                  color: 'rgb(68, 68, 68)',
                  fontWeight: '700',
                },
              }}
            />
          </ThemedView>
        </ThemedView>
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
                      num_hugs > 0
                        ? 'rgb(255, 126, 179)'
                        : 'rgba(0, 0, 0, 0.3)',
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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
  },
  titleText: {
    color: 'rgb(68, 68, 68)',
    marginTop: 10,
  },
  postDescriptionContainer: {
    marginTop: 8,
  },
  patientDescriptionText: {
    color: defaultTextGray,
  },
  assessmentTitleText: {
    color: defaultTextGray,
    marginTop: 8,
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
