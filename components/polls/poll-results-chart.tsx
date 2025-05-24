"use client";

import type { PollOption } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, PieChart } from "lucide-react";

interface PollResultsChartProps {
  options: PollOption[];
  totalVotes: number;
  title: string;
}

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#f97316", // orange
  "#ec4899", // pink
  "#6366f1", // indigo
];

export function PollResultsChart({
  options,
  totalVotes,
  title,
}: PollResultsChartProps) {
  const maxVotes = Math.max(...options.map((opt) => opt.votes));
  const sortedOptions = [...options].sort((a, b) => b.votes - a.votes);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg border">
          <div className="text-lg font-bold text-blue-600">{totalVotes}</div>
          <div className="text-xs text-blue-600">Total Votes</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg border">
          <div className="text-lg font-bold text-green-600">
            {sortedOptions[0]?.percentage || 0}%
          </div>
          <div className="text-xs text-green-600">Leading Option</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg border">
          <div className="text-lg font-bold text-purple-600">
            {options.length}
          </div>
          <div className="text-xs text-purple-600">Total Options</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg border">
          <div className="text-lg font-bold text-orange-600">
            {Math.round(totalVotes / options.length)}
          </div>
          <div className="text-xs text-orange-600">Avg per Option</div>
        </div>
      </div>

      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bar" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Bar Chart
          </TabsTrigger>
          <TabsTrigger value="pie" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Pie Chart
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Vote Distribution
              </CardTitle>
              <CardDescription>
                Votes per option with percentages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedOptions.map((option, index) => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium truncate flex-1 mr-2">
                        {option.text}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">
                          {option.votes} votes
                        </span>
                        <span className="font-bold">
                          ({option.percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-8">
                        <div
                          className="h-8 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                          style={{
                            background: `linear-gradient(90deg, ${
                              COLORS[index % COLORS.length]
                            }, ${COLORS[index % COLORS.length]}dd)`,
                            width: `${option.percentage}%`,
                          }}
                        >
                          {option.percentage > 15 && (
                            <span className="text-white text-xs font-bold">
                              {option.percentage}%
                            </span>
                          )}
                        </div>
                      </div>
                      {option.percentage <= 15 && option.percentage > 0 && (
                        <span
                          className="absolute top-1/2 transform -translate-y-1/2 text-xs font-bold"
                          style={{
                            left: `${option.percentage + 2}%`,
                            color: COLORS[index % COLORS.length],
                          }}
                        >
                          {option.percentage}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Vote Breakdown
              </CardTitle>
              <CardDescription>
                Percentage distribution of all votes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* CSS-based Pie Chart */}
                <div className="flex justify-center">
                  <div className="relative w-64 h-64">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full transform -rotate-90"
                    >
                      {options.map((option, index) => {
                        const startAngle = options
                          .slice(0, index)
                          .reduce((sum, opt) => sum + opt.percentage * 3.6, 0);
                        const endAngle = startAngle + option.percentage * 3.6;
                        const largeArcFlag = option.percentage > 50 ? 1 : 0;

                        const x1 =
                          50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                        const y1 =
                          50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                        const x2 =
                          50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                        const y2 =
                          50 + 40 * Math.sin((endAngle * Math.PI) / 180);

                        if (option.percentage === 0) return null;

                        return (
                          <path
                            key={option.id}
                            d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                            fill={COLORS[index % COLORS.length]}
                            stroke="white"
                            strokeWidth="2"
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        );
                      })}
                    </svg>

                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{totalVotes}</div>
                        <div className="text-xs text-muted-foreground">
                          total votes
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Legend */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground mb-3">
                    Vote Breakdown:
                  </h4>
                  {sortedOptions.map((option, index) => (
                    <div
                      key={option.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-white shadow-sm"
                        style={{
                          backgroundColor:
                            COLORS[
                              options.findIndex((opt) => opt.id === option.id) %
                                COLORS.length
                            ],
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {option.text}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {option.votes} votes • {option.percentage}% of total
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">
                          {option.percentage}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {option.votes}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
