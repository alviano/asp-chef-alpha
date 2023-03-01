<script>
    import Operations from "$lib/OperationsPanel.svelte";
    import {Col, Row} from "sveltestrap";
    import {Recipe} from "$lib/recipe";
    import InputPanel from "$lib/InputPanel.svelte";
    import OutputPanel from "$lib/OutputPanel.svelte";
    import {recipe} from "$lib/stores";
    import RecipePanel from "$lib/RecipePanel.svelte";
    import {onMount} from "svelte";

    let input_value = location.hash.length > 1 ? Recipe.deserialize(location.hash.slice(1)) : '';
    let output_value = [];

    async function process(input_value) {
        output_value = await Recipe.process(input_value)
    }

    function update_hash(input) {
        location.hash = Recipe.serialize(input);
    }

    recipe.subscribe(() => {
        update_hash(input_value);
        process(input_value);
    });

    $: process(input_value);
    $: update_hash(input_value);

    $: console.log(location.hash)
    onMount(() => {
        window.addEventListener('hashchange', () => {
            const input = Recipe.deserialize(location.hash.slice(1));
            if (input !== null) {
                input_value = input;
            }
        })
    })
</script>

<Row>
    <Col class="ps-0" style="max-width: 20em;">
        <Operations />
    </Col>
    <Col>
        <RecipePanel />
    </Col>
    <Col>
        <Row>
            <InputPanel bind:value={input_value} />
        </Row>
        <Row>
            <OutputPanel value={output_value} />
        </Row>
    </Col>
</Row>