<script>
    import Operations from "$lib/OperationsPanel.svelte";
    import {Col, Progress, Row} from "sveltestrap";
    import {Recipe} from "$lib/recipe";
    import InputPanel from "$lib/InputPanel.svelte";
    import OutputPanel from "$lib/OutputPanel.svelte";
    import {pause_baking, recipe} from "$lib/stores";
    import RecipePanel from "$lib/RecipePanel.svelte";
    import {onDestroy, onMount} from "svelte";

    let input_value = '';
    let output_value = [];

    let process_timeout = null;

    async function process(input_value) {
        output_value = await Recipe.process(input_value);
        if (recipe_unsubscribe !== null) {
            location.hash = Recipe.serialize(input_value);
        }
    }

    function delayed_process(input_value) {
        if ($pause_baking) {
            return;
        }
        if (process_timeout !== null) {
            clearTimeout(process_timeout);
        }
        process_timeout = setTimeout(async () => {
            await process(input_value);
            process_timeout = null;
        }, 100);
    }

    $: delayed_process(input_value, $pause_baking);

    let recipe_unsubscribe = null;

    onMount(() => {
        if (location.hash.length > 1) {
            const input = Recipe.deserialize(location.hash.slice(1));
            if (input !== null) {
                input_value = input;
            }
        }
        recipe_unsubscribe = recipe.subscribe(() => {
            delayed_process(input_value);
        });
    });

    onDestroy(() => {
        recipe_unsubscribe();
    });
</script>

<Row>
    <Col class="p-0 vh-100" style="max-width: 20em; overflow-x: hidden; overflow-y: scroll;">
        <Operations />
    </Col>
    <Col class="p-0 vh-100" style="background-color: lightgray; overflow-x: hidden; overflow-y: scroll;">
        <RecipePanel
                on:change_input={(event) => input_value = event.detail}
        />
    </Col>
    <Col class="p-0 vh-100" style="overflow-x: hidden; overflow-y: auto;">
        <InputPanel bind:value={input_value} />
        <div>
            <Progress multi style="font-family: monospace; font-weight: bold;">
                <Progress bar animated color="danger" value={process_timeout ? 100 : 0}>
                    <span style="color: white;">Baking...</span>
                </Progress>
                <Progress bar color="success" value={process_timeout ? 0 : 100}>
                    <span style="color: white;">Ready!</span>
                </Progress>
            </Progress>
        </div>
        <OutputPanel value={output_value} on:change_input={(event) => input_value = event.detail} />
    </Col>
</Row>
