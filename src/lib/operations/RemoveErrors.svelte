<script>
    import {Button, Card, CardBody} from "sveltestrap";
    import IngredientHeader from "$lib/IngredientHeader.svelte";
    import {consts} from "$lib/consts";
    import {Utils} from "$lib/utils";

    function default_options() {
        return {
            stop: false,
            apply: true,
        };
    }

    const operation = consts.OPERATIONS.REMOVE_ERRORS;
    export let options = default_options();
    export let index = null;
</script>

{#if index !== null}
    <Card>
        <IngredientHeader {operation} {index} {options} />
        <CardBody class="p-0">
        </CardBody>
    </Card>
{:else}
    <Button block outline on:click={() => Utils.add_operation(operation, options)}>{operation}</Button>
{/if}