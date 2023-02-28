<script>
    import {Badge, Button, ButtonGroup, CardHeader, CardTitle, Icon} from "sveltestrap";
    import {recipe} from "$lib/stores";
    import {Utils} from "$lib/utils";
    import {Popover} from "dumbo-svelte";

    export let operation;
    export let index;
    export let options;
</script>

<CardHeader>
    <CardTitle class="h6">
        #{index + 1}.
        {operation}
        <span class="float-end">
            <Popover title="Remove operation" value="Remove ingredient #{index + 1} from the recipe.">
                <Button size="sm" color="danger" on:click={() => Utils.remove_operation(index)}><Icon name="trash" /></Button>
            </Popover>
            <Popover title="Control execution of the recipe">
                <div slot="value">
                    <p>Enabled ingredients <Badge><Icon name="eye" /></Badge> are applied.</p>
                    <p>Disabled ingredients <Badge><Icon name="eye-slash" /></Badge> are skipped.</p>
                    <p>The recipe is terminated after applying an ingredient with the <strong>pause button</strong> <Badge><Icon name="pause-fill" /></Badge> active.</p>
                </div>
                <ButtonGroup>
                    <Button size="sm" on:click={() => Utils.toggle_apply_operation(index)}>
                        <Icon name={options.apply ? "eye" : "eye-slash"} />
                    </Button>
                    <Button size="sm" active={options.stop} outline={!options.stop} on:click={() => Utils.toggle_stop_at_operation(index)}><Icon name="pause-fill" /></Button>
                </ButtonGroup>
            </Popover>
            <Popover title="Move operation" value="Move ingredient #{index + 1} up or down in the recipe.">
                <ButtonGroup>
                    <Button size="sm" disabled="{index <= 0}" on:click={() => Utils.swap_operations(index - 1, index)}><Icon name="arrow-up" /></Button>
                    <Button size="sm" disabled="{index + 1 >= $recipe.length}" on:click={() => Utils.swap_operations(index, index + 1)}><Icon name="arrow-down" /></Button>
                </ButtonGroup>
            </Popover>
        </span>
    </CardTitle>
</CardHeader>