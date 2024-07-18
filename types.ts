export interface Comment {
  id: number
  parent_id: null | number
  display_name: string
  text: string
  created_at: string
  num_hugs: number
}

export interface Post {
  id: number
  post_url: string
  title: string
  created_at: string
  num_hugs: number
  patient_description: string
  assessment: string
  question: string
  comments: {
    [commentIdString: string]: Comment
  }
}
