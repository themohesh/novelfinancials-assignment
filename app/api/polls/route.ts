import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { PollService } from "@/lib/services/poll-service"
import { createPollSchema } from "@/lib/validations"

export async function GET() {
  try {
    const polls = await PollService.getPolls()
    return NextResponse.json({ polls })
  } catch (error: any) {
    console.error("Error fetching polls:", error)
    return NextResponse.json({ error: "Failed to fetch polls", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createPollSchema.parse(body)

    const poll = await PollService.createPoll(validatedData, user.id)

    return NextResponse.json({ poll }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating poll:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create poll", details: error.message }, { status: 500 })
  }
}
