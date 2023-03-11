<script>
    import {flip} from "svelte/animate";
    import {dndzone} from "svelte-dnd-action";
    import {recipe} from "$lib/stores";
    import {Button, ButtonGroup, Card, CardBody, CardHeader, CardTitle, Icon} from "sveltestrap";
    import SearchModels from "$lib/operations/SearchModels.svelte";
    import RemoveErrors from "$lib/operations/RemoveErrors.svelte";
    import Wrap from "$lib/operations/Wrap.svelte";
    import Merge from "$lib/operations/Merge.svelte";
    import Intersection from "$lib/operations/Intersection.svelte";
    import Union from "$lib/operations/Union.svelte";
    import InputIntersection from "$lib/operations/InputIntersection.svelte";
    import InputUnion from "$lib/operations/InputUnion.svelte";
    import Table from "$lib/operations/Table.svelte";
    import {keydown, Popover} from "dumbo-svelte";
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
    import Operations from "$lib/operations/Operations.svelte";
    import {pause_baking} from "$lib/stores";
    import SymmetricClosure from "$lib/operations/SymmetricClosure.svelte";
    import TransitiveClosure from "$lib/operations/TransitiveClosure.svelte";
    import Lua from "$lib/operations/Lua.svelte";
    import SortByIncreasingSize from "$lib/operations/SortbyIncreasingSize.svelte";
    import SortByDecreasingSize from "$lib/operations/SortbyDecreasingSize.svelte";
    import SortByPredicateOrArgument from "$lib/operations/SortbyPredicateorArgument.svelte";
    import TimeoutMinutes from "$lib/operations/TimeoutMinutes.svelte";
    import TimeoutSeconds from "$lib/operations/TimeoutSeconds.svelte";
    import SetConfiguration from "$lib/operations/SetConfiguration.svelte";
    import SetSATPreprocessing from "$lib/operations/SetSATPreprocessing.svelte";
    import SetTransformationOfExtendedRules from "$lib/operations/SetTransformationofExtendedRules.svelte";
    import SetOptimizationStrategy from "$lib/operations/SetOptimizationStrategy.svelte";
    import Graph from "$lib/operations/Graph.svelte";
    import ExtensionalRelation from "$lib/operations/ExtensionalRelation.svelte";
    import JSONPath from "$lib/operations/JSONPath.svelte";
    import ParseCSV from "$lib/operations/ParseCSV.svelte";
    import GenerateCSV from "$lib/operations/GenerateCSV.svelte";
    import OutputEncodedContent from "$lib/operations/OutputEncodedContent.svelte";

    async function copy_to_clipboard() {
        const url = Recipe.as_url();
        await navigator.clipboard.writeText(url);
        Utils.snackbar("URL ready to be pasted!");
    }

    function toggle_show_details() {
        $show_ingredient_details = !$show_ingredient_details;
    }

    function toggle_pause_baking() {
        $pause_baking = !$pause_baking;
        Utils.snackbar("Baking " + ($pause_baking ? "disabled" : "enabled"));
    }

    let items = [];
    const flipDurationMs = 300;
    function handleDndConsider(e) {
        items = e.detail.items;
    }
    function handleDndFinalize(e) {
        recipe.set(e.detail.items);
    }

    $keydown.push((event) => {
        if (event.uKey === 'D') {
            toggle_show_details();
            return true;
        } else if (event.uKey === 'C') {
            copy_to_clipboard();
            return true;
        } else if (event.uKey === 'P') {
            toggle_pause_baking();
            return true;
        }
    });

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
                <ButtonGroup>
                    <Popover title="Show details">
                        <div slot="value">
                            <p>You may want to hide details when ordering your recipe.</p>
                            <p>Keybinding: <code>D</code></p>
                        </div>
                        <Button size="sm"
                                color={$show_ingredient_details ? "success" : "secondary"}
                                outline={!$show_ingredient_details}
                                on:click={() => toggle_show_details()}>
                            <Icon name="binoculars" />
                        </Button>
                    </Popover>
                    <Popover title="Pause baking">
                        <div slot="value">
                            <p>You may want to pause the baking of your recipe if it becomes too expensive.</p>
                            <p>Keybinding: <code>P</code></p>
                        </div>
                        <Button size="sm"
                                color={$pause_baking ? "danger" : "secondary"}
                                outline={!$pause_baking}
                                on:click={() => toggle_pause_baking()}>
                            <Icon name="pause-fill" />
                        </Button>
                    </Popover>
                </ButtonGroup>
                <Popover title="Copy recipe">
                    <div slot="value">
                        <p>Copy the recipe URL in the clipboard.</p>
                        <p>Keybinding: <code>C</code></p>
                    </div>
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
                        <SearchModels id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Remove Errors'}
                        <RemoveErrors id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Wrap'}
                        <Wrap id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Merge'}
                        <Merge id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Intersection'}
                        <Intersection id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Union'}
                        <Union id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Input Intersection'}
                        <InputIntersection id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Input Union'}
                        <InputUnion id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Table'}
                        <Table id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Unwrap'}
                        <Unwrap id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Split'}
                        <Split id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Optimize'}
                        <Optimize id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Show'}
                        <Show id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Output'}
                        <Output id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} on:change_input />
                    {:else if item.operation === 'Nop'}
                        <Nop id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Operations'}
                        <Operations id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Filter'}
                        <Filter id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Select Predicates'}
                        <SelectPredicates id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Select Model'}
                        <SelectModel id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Undo'}
                        <Undo id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Encode'}
                        <Encode id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Symmetric Closure'}
                        <SymmetricClosure id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Transitive Closure'}
                        <TransitiveClosure id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Lua'}
                        <Lua id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Sort by Increasing Size'}
                        <SortByIncreasingSize id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Sort by Decreasing Size'}
                        <SortByDecreasingSize id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Sort by Predicate or Argument'}
                        <SortByPredicateOrArgument id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Timeout Minutes'}
                        <TimeoutMinutes id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Timeout Seconds'}
                        <TimeoutSeconds id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Set Configuration'}
                        <SetConfiguration id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Set SAT Preprocessing'}
                        <SetSATPreprocessing id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Set Transformation of Extended Rules'}
                        <SetTransformationOfExtendedRules id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Set Optimization Strategy'}
                        <SetOptimizationStrategy id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Graph'}
                        <Graph id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Extensional Relation'}
                        <ExtensionalRelation id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'JSON Path'}
                        <JSONPath id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Parse CSV'}
                        <ParseCSV id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Generate CSV'}
                        <GenerateCSV id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else if item.operation === 'Output Encoded Content'}
                        <OutputEncodedContent id={item.id} options={item.options} index={index} add_to_recipe={undefined} keybinding={undefined} />
                    {:else}
                        Unknown operation: {item.operation}
                    {/if}
                </div>
            {/each}
        </section>
    </CardBody>
</Card>
