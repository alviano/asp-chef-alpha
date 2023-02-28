<script>
    import {Button, Card, CardBody} from "sveltestrap";
    import IngredientHeader from "$lib/operations/IngredientHeader.svelte";
    import {Recipe} from "$lib/recipe";

    function default_options() {
        return {
            stop: false,
            apply: true,
            ...default_extra_options,
        };
    }

    export let default_extra_options;

    export let operation;
    export let options = default_options();
    export let index = null;
</script>

{#if index !== null}
    <Card>
        <IngredientHeader {operation} {index} {options} />
        <CardBody class="p-0">
            <slot />
        </CardBody>
    </Card>
{:else}
    <Button block outline on:click={() => Recipe.add_operation(operation, {...options})}>{operation}</Button>
{/if}