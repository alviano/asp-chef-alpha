<script>
    import {Button, ButtonGroup, Card, CardBody, CardHeader, CardTitle, Icon, Input} from "sveltestrap";
    import {recipe} from "$lib/stores";
    import {Utils} from "$lib/utils";

    function default_options() {
        return {
            rules: '',
        };
    }

    export let options = default_options();
    export let index = null;

    function add() {
        $recipe.push({
            operation: 'program',
            options: default_options(),
        });
        recipe.set($recipe);
    }

    function edit(options) {
        $recipe[index].options = options;
        recipe.set($recipe);
    }
</script>

{#if index !== null}
    <Card>
        <CardHeader>
            <CardTitle class="h6">
                #{index + 1}.
                Program
                <ButtonGroup class="float-end">
                    <Button size="sm"><Icon name="trash" /></Button>
                    <Button size="sm"><Icon name="eye-slash" /></Button>
                    <Button size="sm"><Icon name="pause" /></Button>
                    <Button size="sm" disabled="{index <= 0}" on:click={() => Utils.swap_operations(index - 1, index)}><Icon name="arrow-up" /></Button>
                    <Button size="sm" disabled="{index + 1 >= $recipe.length}" on:click={() => Utils.swap_operations(index, index + 1)}><Icon name="arrow-down" /></Button>
                </ButtonGroup>
            </CardTitle>
        </CardHeader>
        <CardBody class="p-0">
            <Input type="textarea" rows=5 bind:value="{options.rules}" on:keydown={() => edit(options)} on:change={() => edit(options)} />
        </CardBody>
    </Card>
{:else}
    <Button block outline on:click={add}>Program</Button>
{/if}