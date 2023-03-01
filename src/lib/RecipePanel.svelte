<script>
    import {recipe} from "$lib/stores";
    import {Card, CardBody, CardHeader, CardTitle} from "sveltestrap";
    import SearchModels from "$lib/operations/SearchModels.svelte";
    import RemoveErrors from "$lib/operations/RemoveErrors.svelte";
    import Wrap from "$lib/operations/Wrap.svelte";
    import Merge from "$lib/operations/Merge.svelte";
    import Intersection from "$lib/operations/Intersection.svelte";
    import Union from "$lib/operations/Union.svelte";
    import InputIntersection from "$lib/operations/InputIntersection.svelte";
    import InputUnion from "$lib/operations/InputUnion.svelte";
    import Table from "$lib/operations/Table.svelte";
</script>

<Card class="p-0">
    <CardHeader>
        <CardTitle>Recipe</CardTitle>
    </CardHeader>
    <CardBody class="p-0">
        {#each $recipe as ingredient, index}
            <div class="mb-1 mt-1">
                {#if ingredient.operation === 'Search Models'}
                    <SearchModels options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Remove Errors'}
                    <RemoveErrors options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Wrap'}
                    <Wrap options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Merge'}
                    <Merge options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Intersection'}
                    <Intersection options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Union'}
                    <Union options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Input Intersection'}
                    <InputIntersection options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Input Union'}
                    <InputUnion options="{ingredient.options}" {index}/>
                {:else if ingredient.operation === 'Table'}
                    <Table options="{ingredient.options}" {index}/>
                {:else}
                    Unknown operation: {ingredient.operation}
                {/if}
            </div>
        {/each}
    </CardBody>
</Card>
