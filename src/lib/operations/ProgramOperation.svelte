<script>
    import {Button, Card, CardBody, Input} from "sveltestrap";
    import IngredientHeader from "$lib/IngredientHeader.svelte";
    import {consts} from "$lib/consts";
    import {Utils} from "$lib/utils";

    function default_options() {
        return {
            stop: false,
            apply: true,
            rules: '',
        };
    }

    export let options = default_options();
    export let index = null;

    function edit() {
        Utils.edit_operation(index, options);
    }
</script>

{#if index !== null}
    <Card>
        <IngredientHeader operation="Program" {index} {options} />
        <CardBody class="p-0">
            <Input type="textarea" rows=5 bind:value="{options.rules}" on:keydown={edit} on:change={edit} />
        </CardBody>
    </Card>
{:else}
    <Button block outline on:click={() => Utils.add_operation(consts.OPERATIONS.PROGRAM, options)}>{consts.OPERATIONS.PROGRAM}</Button>
{/if}