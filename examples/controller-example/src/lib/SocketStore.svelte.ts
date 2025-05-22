import { TestClient } from "./client";

export const SocketStore = $state<{ sock: TestClient | null }>({ sock: null })
export const SocketStatusStore = $state<{ connected: boolean, error: string | null }>({ connected: false, error: null })
