"use client";

import { useState, useEffect } from "react";
import type { Poll } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Users,
  Calendar,
  BarChart3,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PollResultsChart } from "./poll-results-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PollCardProps {
  poll: Poll;
  hasVoted: boolean;
  onVote: (pollId: string, optionId: string) => Promise<void>;
  showResults?: boolean;
}

export function PollCard({
  poll,
  hasVoted,
  onVote,
  showResults = false,
}: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voted, setVoted] = useState(hasVoted);
  const [showResultsView, setShowResultsView] = useState(
    hasVoted || showResults
  );
  const [activeTab, setActiveTab] = useState("simple");

  // Update voted state when hasVoted prop changes
  useEffect(() => {
    setVoted(hasVoted);
    setShowResultsView(hasVoted || showResults);
  }, [hasVoted, showResults]);

  const handleVote = async () => {
    if (!selectedOption) return;

    setLoading(true);
    setError("");

    try {
      await onVote(poll.id, selectedOption);
      setVoted(true);
      setShowResultsView(true);
      // Automatically switch to charts view after voting
      setActiveTab("charts");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleResultsView = () => {
    setShowResultsView(!showResultsView);
  };

  const showVotingInterface = !voted && !showResults;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg md:text-xl">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="text-sm md:text-base mt-1">
                {poll.description}
              </CardDescription>
            )}
          </div>

          {/* Toggle Results Button */}
          {poll.total_votes > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleResultsView}
              className="ml-4 flex items-center gap-2"
            >
              {showResultsView ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {showResultsView ? "Hide Results" : "View Results"}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>
              {poll.total_votes} {poll.total_votes === 1 ? "vote" : "votes"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDistanceToNow(new Date(poll.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
          {voted && (
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>Voted</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Voting Interface */}
        {showVotingInterface && (
          <div className="space-y-4">
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
            >
              {poll.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label
                    htmlFor={option.id}
                    className="flex-1 cursor-pointer font-medium"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button
              onClick={handleVote}
              disabled={!selectedOption || loading}
              className="w-full"
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cast Your Vote
            </Button>
          </div>
        )}

        {/* Results Section */}
        {showResultsView && poll.total_votes > 0 && (
          <div className="space-y-4">
            {voted && (
              <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  ✓ Thank you for voting! Here are the results:
                </p>
              </div>
            )}

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="simple" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Simple View
                </TabsTrigger>
                <TabsTrigger value="charts" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Charts & Graphs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="simple" className="mt-4">
                <div className="space-y-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{poll.total_votes}</div>
                    <div className="text-sm text-muted-foreground">
                      Total Votes
                    </div>
                  </div>

                  <div className="space-y-3">
                    {poll.options.map((option, index) => (
                      <div
                        key={option.id}
                        className="space-y-2 p-3 rounded-lg border bg-card"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {option.text}
                          </span>
                          <span className="text-sm text-muted-foreground font-medium">
                            {option.votes} votes ({option.percentage}%)
                          </span>
                        </div>
                        <Progress value={option.percentage} className="h-3" />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="charts" className="mt-4">
                <PollResultsChart
                  options={poll.options}
                  totalVotes={poll.total_votes}
                  title={poll.title}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* No Votes Yet */}
        {showResultsView && poll.total_votes === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No votes yet. Be the first to vote!</p>
          </div>
        )}

        {/* Call to Action for Non-Voters */}
        {!voted && !showVotingInterface && poll.total_votes > 0 && (
          <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 mb-2">
              Want to see detailed charts and your vote impact?
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResultsView(false)}
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              Vote Now to See Charts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
