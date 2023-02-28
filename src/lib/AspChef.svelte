<script>
    import {Utils} from "$lib/utils";
    import Operations from "$lib/OperationsPanel.svelte";
    import {Col, Row} from "sveltestrap";
    import Recipe from "$lib/RecipePanel.svelte";
    import InputPanel from "$lib/InputPanel.svelte";
    import OutputPanel from "$lib/OutputPanel.svelte";
    import {recipe} from "$lib/stores";

    let input_value = '';
    let output_value = [];

    async function process(input_value) {
        try {
            let result = await Utils.process_input(input_value);
            for (const ingredient of $recipe) {
                if (ingredient.options.apply) {
                    result = await Utils.apply_operation(result, ingredient.operation, ingredient.options);
                }
                if (ingredient.options.stop) {
                    break;
                }
            }
            output_value = result;
        } catch (error) {
            output_value = [[{str: error}]]
        }
    }

    recipe.subscribe(() => {
        const tmp = input_value;
        input_value = null;
        input_value = tmp;
    })

    $: process(input_value);
</script>

<Row>
    <Col class="ps-0" style="max-width: 20em;">
        <Operations />
    </Col>
    <Col>
        <Recipe />
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