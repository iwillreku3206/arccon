import { TestDisplay, type Move } from "./client";

export const SocketStore = $state<{ sock: TestDisplay | null }>({ sock: null })
export const SocketStatusStore = $state<{ connected: boolean, error: string | null }>({ connected: false, error: null })
export const GameStateStore = $state<{ winner: 1 | 2 | null, scores: { 1: number, 2: number }, names: { 1: string, 2: string }, moves: { 1: Move, 2: Move } }>({
  moves: { "1": "none", "2": "none" },
  names: { "1": "", "2": "" },
  scores: { "1": 0, "2": 0 },
  winner: null
})
