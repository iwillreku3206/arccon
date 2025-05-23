import { ArcconClient, ArcconDisplay, Socket, type DisconnectDescription } from "arccon-client"
import { GameStateStore, SocketStatusStore } from "./SocketStore.svelte"

export type Move = "rock" | "paper" | "scissors" | "none"

type UpdateScore = { score1: number, score2: number }
type ShowWin = { winner: 1 | 2 | null }
type UpdatePlayerName = { player: 1 | 2, name: string }
type UpdatePlayerMove = { player: 1 | 2, move: Move }

export class TestDisplay extends ArcconDisplay {
  protected async onConnect(): Promise<void> {
    SocketStatusStore.connected = true
    SocketStatusStore.error = null
  }
  protected async onConnectError(error: Error): Promise<void> {
    SocketStatusStore.error = error.message
  }
  protected async onDisconnect(_reason: Socket.DisconnectReason, details?: DisconnectDescription): Promise<void> {
    SocketStatusStore.connected = false
    SocketStatusStore.error = details
  }
  public constructor(url: string, code: string) {
    super(url, code)

    this.on<UpdateScore>("update_score", (p) => {
      GameStateStore.scores[1] = p.score1
      GameStateStore.scores[2] = p.score2
    })
    this.on<ShowWin>("show_win", (p) => {
      GameStateStore.winner = p.winner
    })
    this.on<UpdatePlayerName>("update_name", (p) => {
      GameStateStore.names[p.player] = p.name
    })
    this.on<UpdatePlayerMove>("update_move", (p) => {
      GameStateStore.moves[p.player] = p.move
    })
  }

  protected onError(): void { }
}
