<script lang="ts">
  import { TestDisplay, type Move } from "./lib/client";
  import {
    SocketStatusStore,
    SocketStore,
    GameStateStore,
  } from "./lib/SocketStore.svelte";
  let ip: string = $state("");
  let code: string = $state("");

  const moveIcons = {
    rock: "🪨",
    paper: "📃",
    scissors: "✂️",
    none: "❔",
  };
</script>

<main>
  Connected: {SocketStatusStore.connected || SocketStatusStore.error}
  <div class="connform">
    <input type="text" placeholder="IP" bind:value={ip} />
    <input type="tel" placeholder="Code" bind:value={code} />
    <button
      type="button"
      onclick={() => {
        SocketStore.sock = new TestDisplay(ip, code);
      }}
    >
      Connect
    </button>
  </div>
  {#if GameStateStore.winner}
    <div class="winScreen">
      {GameStateStore.winner} won the game!
    </div>
  {/if}
  <div class="gameBoard">
    <div class="flex flex-row">
      <div class="flex flex-col">
        <div>{GameStateStore.scores[1]}</div>
        <div>{GameStateStore.names[1]}</div>
        <div>{moveIcons[GameStateStore.moves[1]]}</div>
      </div>
      <div class="flex flex-col">
        <div>{GameStateStore.scores[2]}</div>
        <div>{GameStateStore.names[2]}</div>
        <div>{moveIcons[GameStateStore.moves[2]]}</div>
      </div>
    </div>
  </div>
</main>

<style>
  .flex {
    display: flex;
  }
  .flex-row {
    flex-direction: row;
  }
  .flex-col {
    flex-direction: column;
  }
</style>
