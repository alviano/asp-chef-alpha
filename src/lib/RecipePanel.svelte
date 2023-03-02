<script>
    import {recipe} from "$lib/stores";
    import {Button, Card, CardBody, CardHeader, CardTitle, Icon} from "sveltestrap";
    import SearchModels from "$lib/operations/SearchModels.svelte";
    import RemoveErrors from "$lib/operations/RemoveErrors.svelte";
    import Wrap from "$lib/operations/Wrap.svelte";
    import Merge from "$lib/operations/Merge.svelte";
    import Intersection from "$lib/operations/Intersection.svelte";
    import Union from "$lib/operations/Union.svelte";
    import InputIntersection from "$lib/operations/InputIntersection.svelte";
    import InputUnion from "$lib/operations/InputUnion.svelte";
    import Table from "$lib/operations/Table.svelte";
    import {Popover} from "dumbo-svelte";
    import {Recipe} from "$lib/recipe";
    import Unwrap from "$lib/operations/Unwrap.svelte";
    import Split from "$lib/operations/Split.svelte";
    import {Utils} from "$lib/utils";
    import Optimize from "$lib/operations/Optimize.svelte";
    import Show from "$lib/operations/Show.svelte";
    import Output from "$lib/operations/Output.svelte";
    import Nop from "$lib/operations/Nop.svelte";
    import Filter from "$lib/operations/Filter.svelte";
    import Select from "$lib/operations/Select.svelte";
    import Undo from "$lib/operations/Undo.svelte";

    async function copy_to_clipboard() {
        const url = Recipe.as_url();
        await navigator.clipboard.writeText(url);
        Utils.snackbar("URL copied in the clipboard!");
    }
</script>

<Card class="p-0">
    <CardHeader>
        <CardTitle class="h4">
            Recipe
            <span class="float-end">
                <Popover title="Remove operation" value="Remove all ingredients from the recipe.">
                    <Button size="sm" color="danger" on:click={() => Recipe.remove_all_operations()}><Icon name="trash" /></Button>
                </Popover>
                <Popover title="Copy recipe" value="Copy the recipe URL in the clipboard.">
                    <Button size="sm" on:click={() => copy_to_clipboard()}><Icon name="clipboard-plus" /></Button>
                </Popover>
            </span>
        </CardTitle>
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
                    <InputUnion options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Table'}
                    <Table options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Unwrap'}
                    <Unwrap options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Split'}
                    <Split options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Optimize'}
                    <Optimize options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Show'}
                    <Show options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Output'}
                    <Output options="{ingredient.options}" {index} on:change_input />
                {:else if ingredient.operation === 'Nop'}
                    <Nop options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Filter'}
                    <Filter options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Select'}
                    <Select options="{ingredient.options}" {index} />
                {:else if ingredient.operation === 'Undo'}
                    <Undo options="{ingredient.options}" {index} />
                {:else}
                    Unknown operation: {ingredient.operation}
                {/if}
            </div>
        {/each}
    </CardBody>
</Card>
