<script context="module">
    import {Recipe} from "$lib/recipe";

    const operation = "Undo";
    const default_extra_options = {
        steps: 2,
    };

    Recipe.register_operation_type(operation, async (input, options, index) => {
        return Recipe.get_input_at_index(Math.max(0, index - options.steps));
    });
</script>

<script>
    import {Input, InputGroup, InputGroupText} from "sveltestrap";
    import Operation from "$lib/operations/Operation.svelte";

    export let id;
    export let options;
    export let index;
    export let add_to_recipe;
    export let keybinding;

    function edit() {
        Recipe.edit_operation(index, options);
    }
</script>

<Operation {id} {operation} {options} {index} {default_extra_options} {add_to_recipe} {keybinding}>
    <div slot="description">
        <p>
            The <strong>{operation}</strong> operation restores the input of previous steps.
        </p>
        <p>
            This operation can be coupled with Output or Table operations to show some intermediate outcome and restore a previous state.
        </p>
    </div>
    <InputGroup>
        <InputGroupText class="text-end" style="width: 15em; text-align: right;">
            <code class="text-end">Restore output from {index > options.steps ? '#' + (index - options.steps) : 'input'}</code>
        </InputGroupText>
        <InputGroupText>Steps</InputGroupText>
        <Input type="number"
               bind:value={options.steps}
               min="1"
               on:input={edit}
               data-testid="Undo-steps"
        />
    </InputGroup>
</Operation>
