<script lang="ts">

    import Board from "./Board.svelte";
    import Info from "./Info.svelte";
    import Stats from "./Stats.svelte";
    import {
        enemyShips,
        gameState,
        Player,
        selectedShip,
        ships,
        Stage,
    } from "./stores";

    $: if ($selectedShip == null) {
        $selectedShip = $ships[0];
    }

    let board: Board;
    let oppBoard: Board;

    function handleKeyDown(event) {
        if (event.key != "Tab") return;
        if ($gameState.stage == Stage.Initial && $selectedShip != null) {
            $selectedShip.swapOrientation();
            event.preventDefault();
        }
    }

    $: if ($gameState.stage == Stage.Initial && $ships.every((s) => s.placed)) {
        gameState.advance();
    }

    $: if ($gameState.stage == Stage.Battle) {
        if ($gameState.player == Player.Two) {
            board.shootRandom();
            gameState.swapTurn();
        }

        // the round must be complete before we determine a winner.
        let score = 0;
        let done = false;
        if ($enemyShips.every((s) => s.destroyed)) {
            score += 1;
            done = true;
        }
        if ($ships.every((s) => s.destroyed)) {
            score -= 1;
            done = true;
        }
        if (done) {
            gameState.advance();
            $gameState.winner = score == 1 ? Player.One : (score == -1 ? Player.Two : null);
        }
    }

</script>

<svelte:window on:keydown={handleKeyDown} />

<main>
    <div class="container">
        <div class="boards">
            <div class="info">
                <strong>Battleships</strong>
                <Info />
            </div>
            <div class="myboard">
                <Board
                    bind:this={board}
                    ai={false}
                    hidden={false}
                    initRandom={false}
                    bind:ships={$ships}
                />
            </div>
            <div class="opp-board">
                <Board
                    bind:this={oppBoard}
                    ai={true}
                    hidden={true}
                    initRandom={true}
                    bind:ships={$enemyShips}
                />
            </div>
            <div class="stats">
                <Stats
                    text="↑ your ships"
                    selectable={true}
                    bind:ships={$ships}
                />
            </div>
            <div class="opp-stats">
                <Stats
                    text="enemy ships →"
                    selectable={false}
                    bind:ships={$enemyShips}
                />
            </div>
        </div>
    </div>
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        /* max-width: 240px; */
        margin: 0 auto;
    }
    .container {
        display: grid;
        padding: 1em;
        grid-template-areas:
            ". i i"
            "d m m"
            "e m m";
    }
    .boards {
        display: grid;
        grid-area: m;
        grid-template-areas:
            "a a i i i i"
            "a a i i i i"
            "d d b b b b"
            "d d b b b b"
            "e e b b b b"
            "e e b b b b";
        gap: 1em 1em;
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: repeat(6, 1fr);
        width: 700px;
        height: 700px;
    }
    .myboard {
        grid-area: a;
        background-color: #d9e6c3;
    }
    .info {
        grid-area: i;
    }
    .stats {
        grid-area: d;
    }
    .opp-board {
        grid-area: b;
        background-color: #e6c3c3;
    }
    .opp-stats {
        grid-area: e;
    }
</style>
