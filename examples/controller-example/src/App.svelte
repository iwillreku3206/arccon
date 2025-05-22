<script lang="ts">
  import { TestClient } from "./lib/client";
  import { SocketStatusStore, SocketStore } from "./lib/SocketStore.svelte";
  let ip: string = $state("");
  let code: string = $state("");
</script>

<main>
  Connected: {SocketStatusStore.connected || SocketStatusStore.error}
  <div class="connform">
    <input type="text" placeholder="IP" bind:value={ip} />
    <input type="tel" placeholder="Code" bind:value={code} />
    <button
      type="button"
      onclick={() => {
        SocketStore.sock = new TestClient(ip, code);
      }}
    >
      Connect
    </button>
  </div>
  <div class="controller">
    <button type="button">Rock</button>
    <button type="button">Paper</button>
    <button type="button">Scissors</button>
  </div>
</main>
