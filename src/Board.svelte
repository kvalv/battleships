<script lang="ts">
    import Cell from "./Cell.svelte";
    import { coordinatesForShip, Ship } from "./ship";
    import { gameState, selectedShip, Stage } from "./stores";
    import {
        choice,
        Counter,
        positionFromIndex,
        Position,
        range,
        shuffle,
    } from "./utils";

    // whether the board belongs to the AI player
    export let ai: boolean;

    // whether we hide the ship location or not
    export let hidden: boolean;
    export let ships: Ship[];

    // whether to put ships on a random location or not
    export let initRandom: boolean = false;

    export let rows: number = 10;
    export let cols: number = 10;

    function fill<T>(fill_value: T): T[][] {
        let out = [];
        for (let x = 0; x < rows; x++) {
            out.push([]);
            for (let y = 0; y < cols; y++) {
                out[x].push(fill_value);
            }
        }
        return out;
    }

    // hitmap[x][y] is true whenever a volley has been shot at (x, y)
    // shipmap[x][y] contains a ship reference on (x, y) if a ship is placed there.
    let hitmap: boolean[][] = fill(false);
    let shipmap: Ship[][] = fill(null);

    function canPlaceShip(
        p: Position,
        orientation: "row" | "col",
        size: number
    ): boolean {
        const coords = coordinatesForShip(p, size, orientation);
        if (!coords.every((p) => (0 <= p.x) && (p.x < rows) && (0 <= p.y) && (p.y < cols))) return false;

        // let's check if we can place the ship based on intersection;
        // if two points intersect, then the counter should be greater
        // than one, and we do not allow placing ship there. We assume
        // the current board is valid.
        const allCoords = ships
            .filter((s) => s.placed)
            .map((s) => s.coordinates())
            .flat(1)
            .concat(coords);
        const c = new Counter();
        c.add(allCoords.map((c) => c.index(cols)));
        return c.maxCount() == 1;
    }

    function placeShip(s: Ship, p: Position) {
        if ($gameState.stage != Stage.Initial) return;
        if (s.placed || !canPlaceShip(p, s.orientation, s.size)) return false;
        s.pos = p;
        s.placed = true;
        s.coordinates().forEach(({ x, y }) => {
            shipmap[x][y] = s;
        });
        ships = [...ships];
        return true;
    }

    function shipForPosition(pos: Position): Ship | null {
        return ships.find((s) =>
            s.coordinates()?.some((p) => p.x == pos.x && p.y == pos.y)
        );
    }

    function placeShipOnRandomLocation(s: Ship) {
        for (const orientation of shuffle(["col", "row"])) {
            for (const p of shuffle(
                range(0, rows * cols).map((i) => positionFromIndex(i, cols))
            )) {
                if (canPlaceShip(p, orientation, s.size)) {
                    s.orientation = orientation;
                    placeShip(s, p);
                    return;
                }
            }
        }
    }

    function shoot(p: Position) {
        if ($gameState.stage != Stage.Battle) {
            return;
        }

        hitmap[p.x][p.y] = true;
        const ship = shipForPosition(p);
        if (ship != null) {
            ship.registerHit(p);

            // we're updating one ship in an array of ships; we have to add this dummy
            // statement to ensure we get reactivity. See https://svelte.dev/tutorial/reactive-statements for details
            ships = [...ships];
        }
    }

    export function shootRandom() {
        const candidateCoords = hitmap
            .flat(1)
            .reduce((arr, b, i) => (b ? arr : [...arr, i]), [])
            .map((i) => positionFromIndex(i, cols));
        const p = choice(candidateCoords);
        shoot(p);
    }

    function handleClick() {
        if ($gameState.stage == Stage.Initial) {
            if (ai) return;  // hack: we don't want to place currentShip on opponent board.
            placeShip($selectedShip, selectedCell);
        } else if ($gameState.stage == Stage.Battle) {
            shoot(selectedCell);
            gameState.swapTurn();
        }
    }

    $: selectedCell = null;
    $: hoveredCell = null;
    $: overlaidCells = [];

    // we'll add a reactive statement here -- if every ship is not placed,
    // then we'll put them on the board. This happens during initialization
    // and when we restart the game.
    $: if (ships.every((s) => !s.placed)) {
        hitmap = fill(false);
        shipmap = fill(null);
        if (initRandom) {
            ships.forEach((s) => placeShipOnRandomLocation(s));
        }
    }

    // should we hover cells when placing ships?
    $: if (
        $gameState.stage == Stage.Initial &&
        !ai &&
        hoveredCell != null &&
        $selectedShip != null &&
        !$selectedShip.placed &&
        canPlaceShip(hoveredCell, $selectedShip.orientation, $selectedShip.size)
    ) {
        overlaidCells = [
            ...coordinatesForShip(
                hoveredCell,
                $selectedShip.size,
                $selectedShip.orientation
            ),
        ];
    } else {
        overlaidCells = [];
    }

    // should we hover cells when shooting on the opponent board?
    $: if ($gameState.stage == Stage.Battle && ai && hoveredCell != null) {
        overlaidCells = [hoveredCell];
    }

</script>

<div
    class="board"
    style="grid-template: repeat({rows}, 1fr) / repeat({cols}, 1fr)"
    on:mouseout={() => {
        hoveredCell = null;
    }}
    on:blur={() => {}}
>
    {#each range(0, rows) as x}
        {#each range(0, cols) as y}
            <Cell
                {hidden}
                on:click={() => {
                    selectedCell = new Position(x, y);
                }}
                on:click={handleClick}
                bind:hit={hitmap[x][y]}
                bind:shipRef={shipmap[x][y]}
                hovered={overlaidCells.some((p) =>
                    p.equals(new Position(x, y))
                )}
                on:mouseover={() => {
                    hoveredCell = new Position(x, y);
                }}
            />
        {/each}
    {/each}
</div>

<style>
    .board {
        display: grid;
        border: solid 1px grey;
        width: 100%;
        height: 100%;
        box-shadow: 10px 10px 10px #999;
    }
</style>
