import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { authSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = authSchema.parse(body)

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // For signup, user might need to confirm email
    if (data.user && !data.user.email_confirmed_at) {
      return NextResponse.json({
        message: "Please check your email to confirm your account",
        user: data.user,
      })
    }

    return NextResponse.json({ user: data.user, success: true })
  } catch (error: any) {
    console.error("Error signing up:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 })
  }
}
