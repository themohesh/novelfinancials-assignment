export interface Poll {
  id: string
  title: string
  description?: string
  options: PollOption[]
  created_at: string
  created_by: string
  total_votes: number
}

export interface PollOption {
  id: string
  poll_id: string
  text: string
  votes: number
  percentage: number
}

export interface Vote {
  id: string
  poll_id: string
  option_id: string
  user_id: string
  created_at: string
}

export interface CreatePollData {
  title: string
  description?: string
  options: string[]
}

export interface User {
  id: string
  email: string
  created_at: string
}
