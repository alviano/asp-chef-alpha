<script>
    import Operations from "$lib/OperationsPanel.svelte";
    import {Col, Row} from "sveltestrap";
    import {Recipe} from "$lib/recipe";
    import InputPanel from "$lib/InputPanel.svelte";
    import OutputPanel from "$lib/OutputPanel.svelte";
    import {recipe} from "$lib/stores";
    import RecipePanel from "$lib/RecipePanel.svelte";

    let input_value = '';
    let output_value = [];

    async function process(input_value) {
        output_value = await Recipe.process(input_value)
    }

    recipe.subscribe(() => {
        process(input_value);
    });

    $: process(input_value);
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