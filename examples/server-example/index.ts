import { ArcconServer } from 'arccon-server'

type TestMessage = { message: string }
type UserInfo = { name: string, idNumber: string }

class TestServer extends ArcconServer<UserInfo> {
	private testField = "asdf"

	public constructor() {
		super()
		this.on<TestMessage>("test_message", async (p, socket) => {
			console.log(p)
			this.testField
		})
	}

	protected async getUserInfo(userId: string): Promise<UserInfo> {
		return {
			idNumber: "696969",
			name: "Rinaldo Lee"
		}
	}
	protected onGameEnd(): Promise<{ [userId: string]: number; }> {
		throw new Error("Method not implemented.");
	}
}

const server = new TestServer()
server.listen(3000)

