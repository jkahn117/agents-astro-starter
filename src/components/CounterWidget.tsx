import { useState } from "react";
import { useAgent } from "agents/react";
import type { CounterAgent, CounterState } from "../agents/counter";
import { Button } from "@cloudflare/kumo/components/button";

export function CounterWidget() {
  const [count, setCount] = useState(0);

  const agent = useAgent<CounterAgent, CounterState>({
    agent: "CounterAgent",
    onStateUpdate: (state) => setCount(state.count),
  });

  return (
    <>
      <h1>{count}</h1>
      <Button onClick={() => agent.stub.increment()}>+</Button>
      <Button onClick={() => agent.stub.decrement()}>-</Button>
    </>
  );
}
