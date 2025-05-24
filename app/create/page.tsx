"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { CreatePollForm } from "@/components/polls/create-poll-form"
import { Header } from "@/components/layout/header"
import { Loading } from "@/components/ui/loading"

export default function CreatePollPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <>
      <Header user={user} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Create New Poll</h1>
            <p className="text-muted-foreground mt-2">Ask a question and let others vote</p>
          </div>

          <CreatePollForm />
        </div>
      </main>
    </>
  )
}
