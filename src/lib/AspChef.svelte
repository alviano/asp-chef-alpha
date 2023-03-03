<script>
    import Operations from "$lib/OperationsPanel.svelte";
    import {Col, Row} from "sveltestrap";
    import {Recipe} from "$lib/recipe";
    import InputPanel from "$lib/InputPanel.svelte";
    import OutputPanel from "$lib/OutputPanel.svelte";
    import {recipe} from "$lib/stores";
    import RecipePanel from "$lib/RecipePanel.svelte";
    import {onDestroy, onMount} from "svelte";

    let input_value = '';
    let output_value = [];

    let process_timeout = null;

    async function process(input_value) {
        output_value = await Recipe.process(input_value);
        if (unsubscribe !== null) {
            location.hash = Recipe.serialize(input_value);
        }
    }

    function delayed_process(input_value) {
        if (process_timeout !== null) {
            clearTimeout(process_timeout);
        }
        process_timeout = setTimeout(async () => {
            await process(input_value)
        }, 100);
    }

    $: delayed_process(input_value);

    let unsubscribe = null;

    onMount(() => {
        if (location.hash.length > 1) {
            const input = Recipe.deserialize(location.hash.slice(1));
            if (input !== null) {
                input_value = input;
            }
        }
        unsubscribe = recipe.subscribe(() => {
            delayed_process(input_value);
        });
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<Row>
    <Col class="p-0 vh-100" style="max-width: 20em; overflow-x: hidden; overflow-y: scroll;">
        <Operations />
    </Col>
    <Col class="p-0 vh-100" style="overflow-x: hidden; overflow-y: scroll;">
        <RecipePanel
                on:change_input={(event) => input_value = event.detail}
        />
    </Col>
    <Col class="p-0 vh-100" style="overflow-x: hidden; overflow-y: auto;">
        <InputPanel bind:value={input_value} />
        <OutputPanel value={output_value} on:change_input={(event) => input_value = event.detail} />
    </Col>
</Row>
