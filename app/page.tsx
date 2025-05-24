"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { PollList } from "@/components/polls/poll-list";
import { PollStats } from "@/components/polls/poll-stats";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { Poll } from "@/lib/types";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    // Fetch polls if user is authenticated
    if (user && !loading) {
      fetchPolls();
    }
  }, [user, authLoading, router]);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/polls");
      const data = await response.json();

      if (response.ok) {
        setPolls(data.polls);
        setError("");
      } else {
        setError("Failed to load polls");
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
      setError("Failed to load polls");
    } finally {
      setLoading(false);
    }
  };

  // Show loading only during auth check
  if (authLoading) {
    return <Loading />;
  }

  // If no user, return null (will redirect)
  if (!user) {
    return null;
  }

  return (
    <>
      <Header user={user} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Polls Dashboard
              </h1>
              <p className="text-muted-foreground">
                Vote on polls and see real-time results
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchPolls} disabled={loading}>
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Link href="/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Poll
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Dashboard */}
          {polls.length > 0 && <PollStats polls={polls} />}

          {loading ? (
            <div className="flex justify-center py-8">
              <Loading />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchPolls}>Retry</Button>
            </div>
          ) : (
            <PollList initialPolls={polls} userId={user.id} />
          )}
        </div>
      </main>
    </>
  );
}
