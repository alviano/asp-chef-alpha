<script>
    import {recipe} from "$lib/stores";
    import {Card, CardBody, CardHeader, CardTitle} from "sveltestrap";
    import Program from "$lib/operations/Program.svelte";
    import RemoveErrors from "$lib/operations/RemoveErrors.svelte";
    import Wrap from "$lib/operations/Wrap.svelte";
    import Merge from "$lib/operations/Merge.svelte";
</script>

<Card class="p-0">
    <CardHeader>
        <CardTitle>Recipe</CardTitle>
    </CardHeader>
    <CardBody class="p-0">
        {#each $recipe as ingredient, index}
            <div class="mb-1 mt-1">
                {#if ingredient.operation === 'Program'}
                    <Program options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Remove Errors'}
                    <RemoveErrors options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Wrap'}
                    <Wrap options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Merge'}
                    <Merge options="{ingredient.options}" {index} />
                {:else}
                    Unknown operation: {ingredient.operation}
                {/if}
            </div>
        {/each}
    </CardBody>
</Card>
