import { ArcconServer } from 'arccon-server'

type UserInfo = { name: string, idNumber: string }

export type Move = "rock" | "paper" | "scissors" | "none"

type UpdateScore = { score1: number, score2: number }
type ShowWin = { winner: 1 | 2 | null }
type UpdatePlayerName = { player: 1 | 2, name: string }
type UpdatePlayerMove = { player: 1 | 2, move: Move }

type MoveAction = { move: Move }

class TestServer extends ArcconServer<UserInfo> {
	private scores = { 1: 0, 2: 0 }
	private lastMove: { player: null | 1 | 2, move: Move } = { player: null, move: 'none' }

	public constructor() {
		super()

		const s = this

		this.on<MoveAction>("move", async (params, socket, playerInfo) => {
			let outcome = null
			if (s.lastMove.player) {
				if (this.lastMove.player?.toString() == playerInfo.idNumber) {
					// update the move
					this.lastMove.move = params.move
				} else {
					// other player movved
					if (this.lastMove.player?.toString() == playerInfo.idNumber) {
						// its a tie
						this.lastMove.move = params.move
					} else {
						if (this.lastMove.move == "rock" && params.move == "scissors") {
							outcome = s.lastMove.player
						} else if (this.lastMove.move == "scissors" && params.move == "rock") {
							outcome = Number(playerInfo.idNumber)
						} else if (this.lastMove.move == "rock" && params.move == "paper") {
							outcome = Number(playerInfo.idNumber)
						} else if (this.lastMove.move == "paper" && params.move == "rock") {
							outcome = s.lastMove.player
						} else if (this.lastMove.move == "scissors" && params.move == "paper") {
							outcome = s.lastMove.player
						} else if (this.lastMove.move == "paper" && params.move == "scissors") {
							outcome = Number(playerInfo.idNumber)
						}
					}
				}
			} else {
				this.lastMove.player = Number(playerInfo.idNumber) as 1 | 2
				this.lastMove.move = params.move
			}

			if (outcome) {
				this.scores[outcome as 1 | 2]++
				this.lastMove.player = null
				this.lastMove.move = 'none'
			}

			// update display
			this.sendToDisplays<UpdateScore>("update_score", { score1: this.scores[1], score2: this.scores[2] })
			console.log(this.lastMove)
			if (this.lastMove.move != 'none' && this.lastMove.player) {
				this.sendToDisplays<UpdatePlayerMove>("update_move", { player: this.lastMove.player, move: this.lastMove.move })
			}
		})
	}

	protected async getUserInfo(userId: string): Promise<UserInfo> {
		return {
			idNumber: userId,
			name: "Rinaldo Lee"
		}
	}
	protected onGameEnd(): Promise<{ [userId: string]: number; }> {
		throw new Error("Method not implemented.");
	}
}

const server = new TestServer()
console.log("P1: ", server.generateUserCode(6, "1"))
console.log("P2: ", server.generateUserCode(6, "2"))
console.log(server.displayKey)
server.listen(3000)

