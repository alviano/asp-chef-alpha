<script>
    import {Utils} from "$lib/utils";
    import Operations from "$lib/OperationsPanel.svelte";
    import {Col, Row} from "sveltestrap";
    import Recipe from "$lib/RecipePanel.svelte";
    import InputPanel from "$lib/InputPanel.svelte";
    import OutputPanel from "$lib/OutputPanel.svelte";

    async function main() {
        return Utils.parse_atoms(await Utils.search_model("hello. world."));
    }
</script>

<Row>
    <Col>
        <Operations />
    </Col>
    <Col>
        <Recipe />
    </Col>
    <Col>
        <Row>
            <InputPanel />
        </Row>
        <Row>
            <OutputPanel />
        </Row>
    </Col>
</Row>

{#await main()}
    <p>Solving...</p>
{:then atoms}
    {#each atoms as atom}
        <p>{atom.predicate}</p>
    {/each}
{:catch error}
    {error}
{/await}
