<script lang="ts">
    import type { Ship } from "./ship";

    export let hidden: boolean;
    export let hovered: boolean;
    export let shipRef: Ship | null = null;
    export let hit: boolean;

</script>

<div
    class="container"
    class:hit
    on:click
    on:focus={() => {}}
    class:hovered
    on:mouseover
>
    {#if hit && shipRef}
        X
    {:else if hit}
        /
    {:else if shipRef && !hidden}
        O
    {/if}
</div>

<style>
    .container {
        display: flex;
        border: 1px solid #2c3e50;
        justify-content: center;
        align-items: center;
    }
    .hovered {
        background-color: #ddd;
    }
</style>
