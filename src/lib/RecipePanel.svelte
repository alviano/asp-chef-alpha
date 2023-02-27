<script>
    import {recipe} from "$lib/stores";
    import ProgramOperation from "$lib/operations/ProgramOperation.svelte";
    import {Card, CardBody, CardHeader, CardTitle} from "sveltestrap";
</script>

<Card class="p-0">
    <CardHeader>
        <CardTitle>Recipe</CardTitle>
    </CardHeader>
    <CardBody class="p-0">
        {#each $recipe as ingredient, index}
            {#if ingredient.operation === 'program'}
                <ProgramOperation options="{ingredient.options}" {index} />
            {:else}
                Unknown operation: {ingredient.operation}
            {/if}
        {/each}
    </CardBody>
</Card>
