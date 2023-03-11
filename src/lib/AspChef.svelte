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
    import {keydown} from "dumbo-svelte";

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
    let delayed_process_counter = 0;
    async function delayed_process(input_value) {
        let id;
        lock.acquire('process', async () => {
            delayed_process_counter++;
            id = delayed_process_counter;
        });
        if (process_timeout !== null) {
            clearTimeout(process_timeout);
        }
        if ($pause_baking) {
            await Utils.clingo_terminate();
            return;
        }
        for (let count_attempt = 0; processing; count_attempt++) {
            if (id !== delayed_process_counter) {
                return;
            }
            if (count_attempt % 30 === 0) {
                await Utils.snackbar('Waiting for previous process to terminate...', { position: 'is-bottom-right' });
            }
            await Utils.clingo_reject();
            await Utils.delay(100);
        }
        process_timeout = setTimeout(async () => {
            if (id !== delayed_process_counter) {
                return;
            }
            processing = true;
            await process(input_value);
            await Utils.clingo_terminate();
            process_timeout = null;
            processing = false;
        }, 100);
    }

    $: delayed_process(input_value, $pause_baking);

    let recipe_unsubscribe = null;
    let input_panel_div;
    let output_panel_div;
    let progress_panel_div;
    let show_operations = true;
    let recipe_fullscreen = false;

    $keydown.push((event) => {
        if (event.uKey === 'O') {
            show_operations = !show_operations;
            Utils.snackbar(show_operations ? "Operations panel shown..." : "Operations panel hidden...");
            return true;
        } else if (event.uKey === 'R') {
            recipe_fullscreen = !recipe_fullscreen;
            Utils.snackbar(recipe_fullscreen ? "Entering fully immersive mode..." : "Leaving fully immersive mode...");
            return true;
        }
    });

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
    {#if show_operations && !recipe_fullscreen}
        <Col class="p-0 vh-100" style="max-width: 20em; overflow-x: hidden; overflow-y: scroll;">
            <Operations />
        </Col>
    {/if}
    <Col class="p-0 vh-100" style="background-color: lightgray; overflow-x: hidden; overflow-y: scroll;">
        <RecipePanel
                on:change_input={(event) => input_value = event.detail}
        />
    </Col>
    {#if !recipe_fullscreen}
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
    {/if}
</Row>
