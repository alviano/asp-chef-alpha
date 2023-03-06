<script>
    import Operations from "$lib/OperationsPanel.svelte";
    import {Col, Progress, Row} from "sveltestrap";
    import {Recipe} from "$lib/recipe";
    import InputPanel from "$lib/InputPanel.svelte";
    import OutputPanel from "$lib/OutputPanel.svelte";
    import {pause_baking, recipe} from "$lib/stores";
    import RecipePanel from "$lib/RecipePanel.svelte";
    import {onDestroy, onMount} from "svelte";
    import {Utils} from "$lib/utils";
    import AsyncLock from "async-lock";

    let input_value = '';
    let output_value = [];

    let process_timeout = null;
    let processing = false;

    async function process(input_value) {
        output_value = await Recipe.process(input_value);
        if (recipe_unsubscribe !== null) {
            location.hash = Recipe.serialize(input_value);
        }
    }

    const lock = new AsyncLock();

    function delayed_process(input_value) {
        lock.acquire('process', async () => {
            if (process_timeout !== null) {
                clearTimeout(process_timeout);
            }
            if ($pause_baking) {
                Utils.clingo_terminate();
                return;
            }
            while (processing) {
                Utils.snackbar('Waiting for previous process to terminate...', { position: 'is-bottom-right' });
                await Utils.delay(3000);
            }
            process_timeout = setTimeout(async () => {
                processing = true;
                await process(input_value);
                await Utils.clingo_terminate();
                process_timeout = null;
                processing = false;
            }, 1000);
        });
    }

    $: delayed_process(input_value, $pause_baking);

    let recipe_unsubscribe = null;
    let input_panel_div;
    let output_panel_div;
    let progress_panel_div;

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
        input_panel_div.style.height = `${input_panel_div.offsetHeight - progress_panel_div.offsetHeight / 2}px`;
        output_panel_div.style.height = `${output_panel_div.offsetHeight - progress_panel_div.offsetHeight / 2}px`;
    });

    onDestroy(() => {
        recipe_unsubscribe();
    });
</script>

<Row class="vw-100 vh-100" style="overflow: hidden;">
    <Col class="p-0 vh-100" style="max-width: 20em; overflow-x: hidden; overflow-y: scroll;">
        <Operations />
    </Col>
    <Col class="p-0 vh-100" style="background-color: lightgray; overflow-x: hidden; overflow-y: scroll;">
        <RecipePanel
                on:change_input={(event) => input_value = event.detail}
        />
    </Col>
    <Col class="p-0 vh-100" style="overflow: hidden;">
        <div bind:this={input_panel_div} style="height: 50vh; overflow-x: hidden; overflow-y: scroll;">
            <InputPanel bind:value={input_value} />
        </div>
        <div bind:this={progress_panel_div}>
            <Progress class="mb-0" multi style="font-family: monospace; font-weight: bold;">
                <Progress bar animated color="danger" value={process_timeout ? 100 : 0}>
                    <span style="color: white;">Baking...</span>
                </Progress>
                <Progress bar color="success" value={process_timeout ? 0 : 100}>
                    <span style="color: white;">Ready!</span>
                </Progress>
            </Progress>
        </div>
        <div bind:this={output_panel_div} style="height: 50vh; overflow-x: hidden; overflow-y: scroll;">
            <OutputPanel value={output_value} on:change_input={(event) => input_value = event.detail} />
        </div>
    </Col>
</Row>
