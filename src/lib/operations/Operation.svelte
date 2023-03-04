<script>
    import {Button, Card, CardBody} from "sveltestrap";
    import IngredientHeader from "$lib/operations/IngredientHeader.svelte";
    import {Recipe} from "$lib/recipe";
    import {Popover} from "dumbo-svelte";
    import {show_ingredient_details} from "$lib/stores";

    function default_options() {
        return {
            stop: false,
            apply: true,
            ...default_extra_options,
        };
    }

    export let default_extra_options;

    export let id;
    export let operation;
    export let options = default_options();
    export let index;
</script>

{#if id !== undefined}
    <Card style="border-top: 3px solid black;">
        <IngredientHeader {id} {operation} {index} {options} />
        {#if $show_ingredient_details}
        <CardBody class="p-0">
            <slot />
        </CardBody>
        {/if}
    </Card>
{:else}
    <Popover block placement="right" title="Add {operation} Operation">
        <div slot="value"><slot name="description" /></div>
        <Button block outline style="border-radius: 0; text-align: left; text-transform: revert;"
                on:click={() => Recipe.add_operation(operation, {...options}, index)}>
            {operation}
        </Button>
    </Popover>
{/if}