import { useState, useEffect, useCallback } from 'react'
import {
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  View,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native'

import { FlashList } from '@shopify/flash-list'

import { ThemedView } from '@/components/ThemedView'
import PostListItem from '@/components/PostListItem'
import PostDetail from '@/components/PostDetail'
import CommentsList from '@/components/CommentsList'

import { Post } from '../../types'
import { fetchPosts } from '../../utils'

interface RenderItemProps {
  item: Post
}

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([])
  const [postDetailModalVisible, setPostDetailModalVisible] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [commentsModalVisible, setCommentsModalVisible] = useState(false)

  useEffect(() => {
    const getAllPosts = async () => {
      const allPostsFound = await fetchPosts()
      if (allPostsFound) {
        setPosts(allPostsFound)
      }
    }
    getAllPosts()
  }, [])

  const showFullPost = (post: Post) => {
    setSelectedPost(post)
    setPostDetailModalVisible(true)
  }

  const showPostComments = (post = selectedPost) => {
    if (!selectedPost) {
      setSelectedPost(post)
    } else {
      setPostDetailModalVisible(false)
    }
    setCommentsModalVisible(true)
  }

  const renderItem = useCallback(
    ({ item }: RenderItemProps) => (
      <PostListItem
        post={item}
        showFullPost={showFullPost}
        showComments={showPostComments}
      />
    ),
    []
  )

  const handleReturnToList = () => {
    setPostDetailModalVisible(false)
    setSelectedPost(null)
  }

  const handleReturnToPost = () => {
    setCommentsModalVisible(false)
    setPostDetailModalVisible(true)
  }

  if (selectedPost && postDetailModalVisible) {
    return (
      <Modal
        onRequestClose={handleReturnToList}
        visible={postDetailModalVisible}
      >
        <SafeAreaView style={styles.safeAreaView}>
          <PostDetail
            post={selectedPost}
            handleReturnToList={handleReturnToList}
            showComments={showPostComments}
          />
        </SafeAreaView>
      </Modal>
    )
  }

  if (selectedPost && commentsModalVisible) {
    return (
      <Modal onRequestClose={handleReturnToPost} visible={commentsModalVisible}>
        <SafeAreaView style={styles.safeAreaView}>
          <ScrollView style={{ marginTop: Platform.OS === 'android' ? 0 : 16 }}>
            <ThemedView style={styles.contentContainer}>
              <CommentsList
                post={selectedPost}
                handleReturnToList={handleReturnToList}
                handleReturnToPost={handleReturnToPost}
                parentId={null}
              />
            </ThemedView>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    )
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ThemedView style={styles.listContainer}>
        <FlashList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          removeClippedSubviews={true}
          estimatedItemSize={250}
        />
      </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'rgb(244, 246, 249)',
  },
  listContainer: {
    paddingTop:
      Platform.OS === 'android' && StatusBar.currentHeight
        ? StatusBar.currentHeight
        : 16,
    // height of Tab Bar is 49 + regular padding of 16*2 = 81
    paddingBottom: 81,
    paddingHorizontal: 16,
    width: '100%',
    backgroundColor: 'rgb(244, 246, 249)',
    height: Dimensions.get('screen').height,
  },
  contentContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
})
