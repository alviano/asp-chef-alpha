<script>
    import {recipe} from "$lib/stores";
    import ProgramOperation from "$lib/operations/ProgramOperation.svelte";
    import {Card, CardBody, CardHeader, CardTitle} from "sveltestrap";
    import {consts} from "$lib/consts";
    import RemoveErrors from "$lib/operations/RemoveErrors.svelte";
</script>

<Card class="p-0">
    <CardHeader>
        <CardTitle>Recipe</CardTitle>
    </CardHeader>
    <CardBody class="p-0">
        {#each $recipe as ingredient, index}
            {#if ingredient.operation === consts.OPERATIONS.PROGRAM}
                <ProgramOperation options="{ingredient.options}" {index} />
            {:else if ingredient.operation === consts.OPERATIONS.REMOVE_ERRORS}
                <RemoveErrors options="{ingredient.options}" {index} />
            {:else}
                Unknown operation: {ingredient.operation}
            {/if}
        {/each}
    </CardBody>
</Card>
