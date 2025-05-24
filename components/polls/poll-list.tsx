"use client";

import { useEffect, useState } from "react";
import type { Poll } from "@/lib/types";
import { PollCard } from "./poll-card";
import { createClient } from "@/lib/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PollListProps {
  initialPolls: Poll[];
  userId: string | null;
}

export function PollList({ initialPolls, userId }: PollListProps) {
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAllResults, setShowAllResults] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    // Subscribe to real-time updates for votes
    const votesChannel = supabase
      .channel("votes-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
        },
        (payload) => {
          console.log("Vote change detected:", payload);
          // Refresh polls when votes change
          refreshPolls();
        }
      )
      .subscribe();

    // Subscribe to real-time updates for polls
    const pollsChannel = supabase
      .channel("polls-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "polls",
        },
        (payload) => {
          console.log("Poll change detected:", payload);
          refreshPolls();
        }
      )
      .subscribe();

    // Check which polls user has voted on
    checkVotedPolls();

    return () => {
      supabase.removeChannel(votesChannel);
      supabase.removeChannel(pollsChannel);
    };
  }, [userId]);

  const refreshPolls = async () => {
    try {
      const response = await fetch("/api/polls");
      const data = await response.json();

      if (response.ok) {
        setPolls(data.polls);
      }
    } catch (error) {
      console.error("Error refreshing polls:", error);
    }
  };

  const checkVotedPolls = async () => {
    if (!userId) return;

    try {
      const supabase = createClient();
      const { data: votes } = await supabase
        .from("votes")
        .select("poll_id")
        .eq("user_id", userId);

      if (votes) {
        setVotedPolls(new Set(votes.map((vote) => vote.poll_id)));
      }
    } catch (error) {
      console.error("Error checking voted polls:", error);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ optionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to vote");
      }

      setVotedPolls((prev) => new Set([...prev, pollId]));
      // Real-time subscription will handle the poll update
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (polls.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground text-lg mb-2">
          No polls available yet.
        </p>
        <p className="text-sm text-muted-foreground">
          Create the first poll to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Toggle to show all results */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Polls</h2>
        <Button
          variant="outline"
          onClick={() => setShowAllResults(!showAllResults)}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          {showAllResults ? "Hide All Results" : "Show All Results"}
        </Button>
      </div>

      {polls.map((poll) => (
        <PollCard
          key={poll.id}
          poll={poll}
          hasVoted={votedPolls.has(poll.id)}
          onVote={handleVote}
          showResults={showAllResults}
        />
      ))}

      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
}
