<script lang="ts">
    import type { Ship } from "./ship";
    import { fade } from 'svelte/transition';
    import { gameState, selectedShip, Stage } from "./stores";
    export let ships: Ship[];
    export let text: string;
    export let selectable: boolean;

</script>

<h1>
    {text}
    <hr />
</h1>
<div class="container">
    {#each ships as s}
        <div
            on:click={() => {
                if (!selectable) return;
                $selectedShip = s;
            }}
            class:hoverable={selectable}
            class:selected={$gameState.stage == Stage.Initial && $selectedShip == s}
            class="item"
        >
    {#if s.destroyed}
        <del transition:fade>
            {s.name}
        </del>
    {:else}
        {s.name}
    {/if}
        </div>
    {/each}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
    }
    .item {
        background-color: #cccccc;
        opacity: 0.8;
        border-radius: 5px;
        border: 1px solid black;
        margin: 0.1rem;
    }
    .hoverable:hover {
        transition: 0.2s;
        opacity: 1.0;
    }
    .selected {
        background-color: #04AA6D;
    }
</style>
