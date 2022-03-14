<script lang="ts">
    import { gameState, Player, resetState, Stage } from "./stores";
</script>

<div class="container">
    <div>
        <ol>
            <li class:striked={$gameState.stage != Stage.Initial}>
                Place ships on your board (press TAB to change orientation)
            </li>
            <li class:striked={$gameState.stage == Stage.Over}>
                Fight! One volley for each remaining ship. Click on the enemy
                board.
            </li>
            <li>
                Game is over when all opponents ships on one of the boards are
                destroyed. The winner is the one with remaining ships
            </li>
        </ol>
    </div>
    {#if $gameState.stage == Stage.Over}
        <div>
            Game over!
            {#if $gameState.winner == null}
                It's a tie.
            {:else if $gameState.winner == Player.One}
                You won.
            {:else}
                The computer won.
            {/if}
            <button on:click={resetState}>Play again</button>
        </div>
    {/if}
</div>

<style>
    .striked {
        text-decoration: line-through;
    }
    .container {
        text-align: left;
        padding: 10px;
    }
</style>
