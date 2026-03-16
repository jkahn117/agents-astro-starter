import { useState } from "react";
import { useAgent } from "agents/react";
import type { CounterAgent, CounterState } from "../agents/counter";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";

export function CounterWidget() {
  const [count, setCount] = useState(0);

  const agent = useAgent<CounterAgent, CounterState>({
    agent: "CounterAgent",
    onStateUpdate: (state) => setCount(state.count),
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Counter Agent</CardTitle>
          <CardDescription>Connected via WebSocket to a Durable Object</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <span className="text-4xl font-bold tabular-nums">{count}</span>
          <div className="flex w-1/2 gap-2">
            <Button
              variant="destructive"
              size="lg"
              className="flex-1"
              onClick={() => agent.stub.decrement()}
            >
              -
            </Button>
            <Button
              variant="default"
              size="lg"
              className="flex-1"
              onClick={() => agent.stub.increment()}
            >
              +
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
