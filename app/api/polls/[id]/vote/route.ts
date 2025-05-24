import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { PollService } from "@/lib/services/poll-service"
import { voteSchema } from "@/lib/validations"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = voteSchema.parse({
      pollId: params.id,
      optionId: body.optionId,
    })

    await PollService.vote(validatedData.pollId, validatedData.optionId, user.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error voting:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data", details: error.errors }, { status: 400 })
    }

    if (error.message === "You have already voted in this poll") {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to vote" }, { status: 500 })
  }
}
