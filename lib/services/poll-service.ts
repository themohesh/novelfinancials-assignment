import { createClient } from "@/lib/supabase/server"
import type { CreatePollData, Poll } from "@/lib/types"

export class PollService {
  static async createPoll(data: CreatePollData, userId: string): Promise<Poll> {
    const supabase = await createClient()

    // Create poll
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert({
        title: data.title,
        description: data.description,
        created_by: userId,
      })
      .select()
      .single()

    if (pollError) throw new Error(pollError.message)

    // Create options
    const optionsData = data.options.map((option) => ({
      poll_id: poll.id,
      text: option,
    }))

    const { data: options, error: optionsError } = await supabase.from("poll_options").insert(optionsData).select()

    if (optionsError) throw new Error(optionsError.message)

    return {
      ...poll,
      options: options.map((opt) => ({
        ...opt,
        votes: 0,
        percentage: 0,
      })),
      total_votes: 0,
    }
  }

  static async getPolls(): Promise<Poll[]> {
    const supabase = await createClient()

    const { data: polls, error } = await supabase
      .from("polls")
      .select(`
        *,
        poll_options (
          id,
          text,
          votes:votes(count)
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)

    return polls.map((poll) => {
      const totalVotes = poll.poll_options.reduce((sum: number, opt: any) => sum + (opt.votes[0]?.count || 0), 0)

      return {
        ...poll,
        options: poll.poll_options.map((opt: any) => ({
          id: opt.id,
          poll_id: poll.id,
          text: opt.text,
          votes: opt.votes[0]?.count || 0,
          percentage: totalVotes > 0 ? Math.round(((opt.votes[0]?.count || 0) / totalVotes) * 100) : 0,
        })),
        total_votes: totalVotes,
      }
    })
  }

  static async getPoll(id: string): Promise<Poll | null> {
    const supabase = await createClient()

    const { data: poll, error } = await supabase
      .from("polls")
      .select(`
        *,
        poll_options (
          id,
          text,
          votes:votes(count)
        )
      `)
      .eq("id", id)
      .single()

    if (error) return null

    const totalVotes = poll.poll_options.reduce((sum: number, opt: any) => sum + (opt.votes[0]?.count || 0), 0)

    return {
      ...poll,
      options: poll.poll_options.map((opt: any) => ({
        id: opt.id,
        poll_id: poll.id,
        text: opt.text,
        votes: opt.votes[0]?.count || 0,
        percentage: totalVotes > 0 ? Math.round(((opt.votes[0]?.count || 0) / totalVotes) * 100) : 0,
      })),
      total_votes: totalVotes,
    }
  }

  static async vote(pollId: string, optionId: string, userId: string): Promise<void> {
    const supabase = await createClient()

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from("votes")
      .select("id")
      .eq("poll_id", pollId)
      .eq("user_id", userId)
      .single()

    if (existingVote) {
      throw new Error("You have already voted in this poll")
    }

    // Cast vote
    const { error } = await supabase.from("votes").insert({
      poll_id: pollId,
      option_id: optionId,
      user_id: userId,
    })

    if (error) throw new Error(error.message)
  }

  static async hasUserVoted(pollId: string, userId: string): Promise<boolean> {
    const supabase = await createClient()

    const { data } = await supabase.from("votes").select("id").eq("poll_id", pollId).eq("user_id", userId).single()

    return !!data
  }
}
