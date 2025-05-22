import { ArcconClient, Socket, type DisconnectDescription } from "arccon-client"
import { SocketStatusStore } from "./SocketStore.svelte"

type TestMessage = { message: string }
type UserInfo = { name: string, idNumber: string }

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


  public async sendTestMessage(message: string) {
    await this.rawSend("test_message", { message })
  }

  protected onError(): void { }
}
