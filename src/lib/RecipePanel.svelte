<script>
    import {flip} from "svelte/animate";
    import {dndzone} from "svelte-dnd-action";
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
    import SelectPredicates from "$lib/operations/SelectPredicates.svelte";
    import Undo from "$lib/operations/Undo.svelte";
    import Encode from "$lib/operations/Encode.svelte";
    import {onDestroy, onMount} from "svelte";
    import {show_ingredient_details} from "$lib/stores";
    import SelectModel from "$lib/operations/SelectModel.svelte";

    async function copy_to_clipboard() {
        const url = Recipe.as_url();
        await navigator.clipboard.writeText(url);
        Utils.snackbar("URL copied in the clipboard!");
    }

    function toggle_show_details() {
        $show_ingredient_details = !$show_ingredient_details;
    }

    let items = [];
    const flipDurationMs = 300;
    function handleDndConsider(e) {
        items = e.detail.items;
    }
    function handleDndFinalize(e) {
        recipe.set(e.detail.items);
    }

    let unsubscribe = null;
    onMount(() => {
        unsubscribe = recipe.subscribe((value) => {
            items = value;
        });
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<Card class="p-0">
    <CardHeader>
        <CardTitle class="h4">
            Recipe
            <span class="float-end">
                <Popover title="Remove operation" value="Remove all ingredients from the recipe.">
                    <Button size="sm" color="danger" on:click={() => Recipe.remove_all_operations()}><Icon name="trash" /></Button>
                </Popover>
                <Popover title="Show details" value="You may want to hide details when ordering your recipe.">
                    <Button size="sm"
                            color={$show_ingredient_details ? "success" : "secondary"}
                            outline={!$show_ingredient_details}
                            on:click={() => toggle_show_details()}>
                        <Icon name="binoculars" />
                    </Button>
                </Popover>
                <Popover title="Copy recipe" value="Copy the recipe URL in the clipboard.">
                    <Button size="sm" on:click={() => copy_to_clipboard()}><Icon name="clipboard-plus" /></Button>
                </Popover>
            </span>
        </CardTitle>
    </CardHeader>
    <CardBody class="p-0" style="background-color: lightgray;">
        <section class="pb-5" use:dndzone="{{items, flipDurationMs}}" on:consider="{handleDndConsider}" on:finalize="{handleDndFinalize}">
            {#each items as item, index (item.id)}
                <div animate:flip="{{duration: flipDurationMs}}" class="mt-1">
                    {#if item.operation === 'Search Models'}
                        <SearchModels id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Remove Errors'}
                        <RemoveErrors id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Wrap'}
                        <Wrap id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Merge'}
                        <Merge id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Intersection'}
                        <Intersection id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Union'}
                        <Union id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Input Intersection'}
                        <InputIntersection id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Input Union'}
                        <InputUnion id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Table'}
                        <Table id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Unwrap'}
                        <Unwrap id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Split'}
                        <Split id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Optimize'}
                        <Optimize id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Show'}
                        <Show id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Output'}
                        <Output id={item.id} options={item.options} index={index} on:change_input />
                    {:else if item.operation === 'Nop'}
                        <Nop id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Filter'}
                        <Filter id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Select Predicates'}
                        <SelectPredicates id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Select Model'}
                        <SelectModel id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Undo'}
                        <Undo id={item.id} options={item.options} index={index} />
                    {:else if item.operation === 'Encode'}
                        <Encode id={item.id} options={item.options} index={index} />
                    {:else}
                        Unknown operation: {item.operation}
                    {/if}
                </div>
            {/each}
        </section>
    </CardBody>
</Card>
