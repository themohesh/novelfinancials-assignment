import { type NextRequest, NextResponse } from "next/server"
import { PollService } from "@/lib/services/poll-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const poll = await PollService.getPoll(params.id)

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 })
    }

    return NextResponse.json({ poll })
  } catch (error) {
    console.error("Error fetching poll:", error)
    return NextResponse.json({ error: "Failed to fetch poll" }, { status: 500 })
  }
}
