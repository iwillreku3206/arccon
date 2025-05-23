import { Server, Socket } from "socket.io";
import crypto from 'node:crypto'
import process from "node:process";


process.on("uncaughtException", (r) => console.log(r))

export type ArcconServerEvent<T extends any, U> = (params: T, socket: Socket, user: U) => Promise<void>

export abstract class ArcconServer<UserInfo> {
  private ioServer: Server
  protected clients: { [userId: string]: { user: UserInfo, socket: Socket } }
  private displays: Socket[]
  private playerCodes: { [code: string]: string } // maps codes to user ids
  public displayKey: string
  private events: { [type: string]: (p: any, socket: Socket, userInfo: UserInfo) => Promise<void> }

  protected abstract getUserInfo(userId: string): Promise<UserInfo>;
  protected abstract onGameEnd(): Promise<{ [userId: string]: number }>;

  public generateUserCode(length: number, userId: string): string {
    let code;

    do {
      code = Array(length).fill(0).map(() => crypto.randomInt(0, 9)).join('')
    } while (code in this.playerCodes)

    this.playerCodes[code] = userId
    return code
  }

  public listen(port: number) {
    this.ioServer.listen(port)
  }

  private onConnection(server: ArcconServer<UserInfo>) {
    return async (socket: Socket) => {
      console.log("New connection: ", socket.handshake.address)
      const { auth } = socket.handshake
      if (auth.type == 'player') {
        if (auth.code in server.playerCodes) {
          const userId = server.playerCodes[auth.code]
          delete server.playerCodes[auth.code]

          const userInfo = await server.getUserInfo(userId)
          socket.emitWithAck("user_info", JSON.stringify(userInfo))

          for (const event in server.events) {
            socket.on(`game__${event}`, (p) => server.events[event](JSON.parse(p), socket, userInfo))
          }

          server.clients[userId] = {
            socket,
            user: userInfo
          }
        } else {
          socket.disconnect(true)
        }
      } else if (auth.type == 'display') {
        if (auth.code == this.displayKey) {
          this.displays.push(socket)
        } else {
          socket.disconnect(true)
        }
      }
    }
  }

  public sendToDisplays<T>(type: string, params: T) {
    for (const display of this.displays) {
      display.emit(`game__${type}`, JSON.stringify(params))
    }
  }

  public on<P extends any>(type: string, cb: ArcconServerEvent<P, UserInfo>) {
    this.events[type] = cb
  }

  public constructor() {
    this.ioServer = new Server({
      cors: {
        origin: "*",
        methods: ['GET', 'POST'],
      }
    })
    this.clients = {}
    this.playerCodes = {}
    this.displays = []
    this.events = {}

    this.displayKey = crypto.randomBytes(32).toString('hex')

    this.ioServer.on("connection", this.onConnection(this))
  }
}

