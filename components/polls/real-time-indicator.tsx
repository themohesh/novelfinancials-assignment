"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

export function RealTimeIndicator() {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // Monitor connection status
    const channel = supabase
      .channel("connection-status")
      .on("presence", { event: "sync" }, () => {
        setIsConnected(true)
      })
      .on("presence", { event: "join" }, () => {
        setIsConnected(true)
      })
      .on("presence", { event: "leave" }, () => {
        setIsConnected(false)
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true)
        } else if (status === "CLOSED") {
          setIsConnected(false)
        }
      })

    // Listen for any database changes to show activity
    const activityChannel = supabase
      .channel("activity-monitor")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
        },
        () => {
          setLastUpdate(new Date())
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      supabase.removeChannel(activityChannel)
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
        {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {isConnected ? "Live" : "Offline"}
      </Badge>
      {lastUpdate && (
        <span className="text-xs text-muted-foreground">Last update: {lastUpdate.toLocaleTimeString()}</span>
      )}
    </div>
  )
}
