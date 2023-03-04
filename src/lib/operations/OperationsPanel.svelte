<script context="module">
    import {Recipe} from "$lib/recipe";

    const operation = "Operations Panel";
    const default_extra_options = {
    };

    Recipe.register_operation_type(operation, async (input) => {
        return input;
    });
</script>

<script>
    import Operation from "$lib/operations/Operation.svelte";
    import {Input, Spinner} from "sveltestrap";

    export let id;
    export let options;
    export let index;

    let filter = '';
</script>

<Operation {id} {operation} {options} {index} {default_extra_options}>
    <div slot="description">
        <p>
            The <strong>{operation}</strong> operation does nothing... but can be used to add other ingredients above it!
        </p>
    </div>
    <Input type="search" bind:value={filter} placeholder="filter..." />
    <div style="height: 50vh; overflow-y: scroll">
        {#await Recipe.svelte_components(filter)}
            <Spinner />
        {:then components}
            {#each components as component}
                <svelte:component this={component} id="{undefined}" options="{undefined}" {index} />
            {/each}
        {/await}
    </div>
</Operation>
