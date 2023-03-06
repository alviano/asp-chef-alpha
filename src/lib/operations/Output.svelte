<script context="module">
    import {Recipe} from "$lib/recipe";

    const operation = "Output";
    const default_extra_options = {
        height: 200,
    };

    const listeners = new Map();

    Recipe.register_operation_type(operation, async (input, options, index, id) => {
        listeners.get(id)(input);
        return input;
    });
</script>

<script>
    import {Button, Icon, Input, InputGroup, InputGroupText} from "sveltestrap";
    import Operation from "$lib/operations/Operation.svelte";
    import {onDestroy, onMount} from "svelte";
    import {createEventDispatcher} from "svelte";
    import CodeMirror from "svelte-codemirror-editor";
    import {AutoHideBadge} from "dumbo-svelte";

    const dispatch = createEventDispatcher();

    export let id;
    export let options;
    export let index;
    export let add_to_recipe;
    export let keybinding;

    let models = [];
    $: text_value = models.map(atoms => atoms.map(atom => atom.str + '.').join('\n')).join('\n§\n');

    function edit() {
        Recipe.edit_operation(index, options);
    }

    onMount(() => {
        listeners.set(id, (input) => {
            models = input;
        });
    });

    onDestroy(() => {
        listeners.set(id, null);
    });
</script>

<Operation {id} {operation} {options} {index} {default_extra_options} {add_to_recipe} {keybinding}>
    <div slot="description">
        <p>
            The <strong>{operation}</strong> operation shows the output of the previous operation.
        </p>
        <p>
            The input is echoed in output.
        </p>
    </div>
    <InputGroup>
        <InputGroupText>Height</InputGroupText>
        <Input type="number"
               bind:value={options.height}
               min="20"
               step="20"
               on:input={edit}
        />
        <InputGroupText><code>models: {models.length}</code></InputGroupText>
        <Button size="sm" title="Set as input" on:click={() => dispatch('change_input', text_value)}><Icon name="arrow-up-square" /></Button>
    </InputGroup>
    <div style="height: {options.height}px; overflow-y: auto">
        <AutoHideBadge color="warning">readonly</AutoHideBadge>
        <CodeMirror bind:value={text_value} readonly placeholder="EMPTY OUTPUT" lineWrapping="{true}" />
        <Input type="textarea" class="d-none" value="{text_value}" data-testid="OutputPanel-textarea" />
    </div>
</Operation>
