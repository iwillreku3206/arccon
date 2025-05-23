import { io, Socket } from 'socket.io-client'
import { DisconnectDescription } from 'socket.io-client/build/esm/socket'

export type ArcconClientEvent<T extends any> = (params: T) => void

export abstract class ArcconClient<UserInfo> {
  private socket: Socket
  public userInfo: Promise<UserInfo>

  protected abstract onConnect(): Promise<void>;
  protected abstract onConnectError(err: Error): Promise<void>;
  protected abstract onDisconnect(reason: Socket.DisconnectReason, details?: DisconnectDescription): Promise<void>;
  protected abstract onError(msg: string): void

  protected constructor(url: string, code: string) {
    this.socket = io(url, {
      auth: {
        type: 'player',
        code
      }
    })

    this.socket.on("connect", () => this.onConnect())
    this.socket.on("connect_error", (err) => this.onConnectError(err))
    this.socket.on("disconnect", (reason, details) => this.onDisconnect(reason, details))

    this.userInfo = new Promise<UserInfo>(async (resolve, reject) => {
      this.socket.once('user_info', (infoStr: string) => {
        console.log(infoStr)
        try {
          resolve(JSON.parse(infoStr))
        } catch (e) {
          reject(e)
        }
      })
    })
  }


  protected on<P extends any>(type: string, cb: ArcconClientEvent<P>) {
    this.socket.on(`game__${type}`, (p: string) => {
      try {
        cb(JSON.parse(p))
      } catch (e) {
        console.error(e)
        this.onError(String(e))
      }
    })
  }

  protected async rawSend<P extends object>(type: string, parameters: P) {
    await this.socket.emitWithAck(`game__${type}`, JSON.stringify(parameters))
  }
}


export abstract class ArcconDisplay {
  private socket: Socket

  protected abstract onConnect(): Promise<void>;
  protected abstract onConnectError(err: Error): Promise<void>;
  protected abstract onDisconnect(reason: Socket.DisconnectReason, details?: DisconnectDescription): Promise<void>;
  protected abstract onError(msg: string): void

  protected constructor(url: string, code: string) {
    this.socket = io(url, {
      auth: {
        type: 'display',
        code
      }
    })

    this.socket.on("connect", () => this.onConnect())
    this.socket.on("connect_error", (err) => this.onConnectError(err))
    this.socket.on("disconnect", (reason, details) => this.onDisconnect(reason, details))
  }


  protected on<P extends any>(type: string, cb: ArcconClientEvent<P>) {
    this.socket.on(`game__${type}`, (p: string) => {
      try {
        cb(JSON.parse(p))
      } catch (e) {
        console.error(e)
        this.onError(String(e))
      }
    })
  }
}

export { Socket, type DisconnectDescription }

