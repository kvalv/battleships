import { writable } from "svelte/store";
import { createShips } from "./ship";

export let ships = writable(createShips());
export let enemyShips = writable(createShips());

export let selectedShip = writable(null);

export enum Player {
  One,
  Two,
}
export enum Stage {
  Initial, // placement of ships
  Battle, // main part;
  Over, // reached when all ships on one side are destroyed
}

export let gameState = (() => {
  const { subscribe, set, update } = writable({
    stage: Stage.Initial,
    player: Player.One,
    shotsFired: 0,
    winner: null,
  });
  return {
    subscribe,
    set,
    update,
    swapTurn: () =>
      update((s) => {
        s.player = s.player == Player.One ? Player.Two : Player.One;
        return s;
      }),
    advance: () =>
      update((s) => {
        if (s.stage == Stage.Initial) {
          s.stage = Stage.Battle;
        } else {
          s.stage = Stage.Over;
        }
        return s;
      }),
  };
})();

export function resetState() {
  ships.set(createShips());
  enemyShips.set(createShips());
  gameState.set({
    stage: Stage.Initial,
    player: Player.One,
    shotsFired: 0,
    winner: null,
  });
  selectedShip.set(null);
}
