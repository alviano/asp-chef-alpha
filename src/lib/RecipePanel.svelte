<script>
    import {recipe} from "$lib/stores";
</script>

Recipe
{#each $recipe as ingredient}
    {ingredient}
{/each}