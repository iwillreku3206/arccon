import { ArcconClient, Socket, type DisconnectDescription } from "arccon-client"
import { SocketStatusStore } from "./SocketStore.svelte"

type TestMessage = { message: string }
type UserInfo = { name: string, idNumber: string }
type Move = "rock" | "paper" | "scissors" | "none"
type MoveAction = { move: Move }

export class TestClient extends ArcconClient<UserInfo> {
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

    this.on<TestMessage>("test_message", (p) => {
      console.log(p.message)
    })
  }

  public async sendMove(move: Move) {
    await this.rawSend<MoveAction>("move", { move })
  }

  protected onError(): void { }
}
