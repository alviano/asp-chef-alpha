<script>
    import {Recipe} from "$lib/recipe";
    import {Input} from "sveltestrap";
    import {tick} from "svelte";
    import {Popover} from "dumbo-svelte";
    import {Utils} from "$lib/utils";

    export let index;
    export let style = '';

    let filter = '';
    let components = [];
    let component_to_add = null;

    async function load_components(filter) {
        components = await Recipe.svelte_components(filter);
    }

    async function add_operation(component_index) {
        if (component_index >= components.length) {
            Utils.snackbar("Invalid selection");
            return;
        }
        component_to_add = components[component_index];
        await tick();
        component_to_add = null;
    }

    async function onkeydown(event) {
        if (event.key === 'Enter') {
            await add_operation(0);
        } else if (event.ctrlKey && !isNaN(event.key)) {
            await add_operation(parseInt(event.key) - 1);
        }
    }

    $: load_components(filter);
</script>

<Popover block placement="right" title="Filter operations">
    <div slot="value">
        <p>Use a regular expression to filter the list of operation.</p>
        <p>Press ENTER to add the first operation in the list, or move in the list with TAB.</p>
        <p>The <strong>n-th operation</strong> in the list can be added with the keybinding <code>Ctrl+n</code>.</p>
    </div>
    <Input type="search" bind:value={filter} placeholder="filter..." on:keydown={onkeydown} />
</Popover>
<div {style}>
    {#each components as component}
        <svelte:component this={component} id="{undefined}" options="{undefined}" {index} add_to_recipe="{undefined}" />
    {/each}
</div>

{#if component_to_add}
    <svelte:component this={component_to_add} id="{undefined}" options="{undefined}" {index} add_to_recipe="{true}" />
{/if}