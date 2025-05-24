"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, Clock } from "lucide-react";
import type { Poll } from "@/lib/types";

interface PollStatsProps {
  polls: Poll[];
}

export function PollStats({ polls }: PollStatsProps) {
  const totalPolls = polls.length;
  const totalVotes = polls.reduce((sum, poll) => sum + poll.total_votes, 0);
  const averageVotes = totalPolls > 0 ? Math.round(totalVotes / totalPolls) : 0;
  const mostPopularPoll = polls.reduce(
    (max, poll) => (poll.total_votes > max.total_votes ? poll : max),
    polls[0]
  );

  const stats = [
    {
      title: "Total Polls",
      value: totalPolls,
      icon: BarChart3,
      description: "Active polls",
    },
    {
      title: "Total Votes",
      value: totalVotes,
      icon: Users,
      description: "Across all polls",
    },
    {
      title: "Average Votes",
      value: averageVotes,
      icon: TrendingUp,
      description: "Per poll",
    },
    {
      title: "Most Popular",
      value: mostPopularPoll?.total_votes || 0,
      icon: Clock,
      description:
        mostPopularPoll?.title.slice(0, 20) + "..." || "No polls yet",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
