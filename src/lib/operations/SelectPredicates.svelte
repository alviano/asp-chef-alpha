<script context="module">
    import {Recipe} from "$lib/recipe";
    import {Utils} from "$lib/utils";

    const operation = "Select Predicates";
    const default_extra_options = {
        predicates: [],
    };

    const listeners = new Map();

    Recipe.register_operation_type(operation, async (input, options, index, id) => {
        listeners.get(id)(input);
        const included_predicates = new Set(options.predicates);
        return input.map(model => model.filter(atom => included_predicates.has(atom.predicate || 'CONSTANTS')));
    });
</script>

<script>
    import {Input} from "sveltestrap";
    import Operation from "$lib/operations/Operation.svelte";
    import {onDestroy, onMount} from "svelte";

    export let id;
    export let options;
    export let index;
    export let add_to_recipe;
    export let keybinding;

    let input_predicates = [];

    function edit() {
        Recipe.edit_operation(index, options);
    }

    function toggle_predicate(predicate) {
        const index_of_predicate = options.predicates.indexOf(predicate);
        if (index_of_predicate !== -1) {
            options.predicates.splice(index_of_predicate, 1);
        } else {
            options.predicates.push(predicate);
        }
        edit();
    }

    onMount(() => {
        listeners.set(id, (input) => {
            input_predicates = Utils.predicates(input);
        });
    });

    onDestroy(() => {
        listeners.delete(id);
    });
</script>

<Operation {id} {operation} {options} {index} {default_extra_options} {add_to_recipe} {keybinding}>
    <div slot="description">
        <p>
            The <strong>{operation}</strong> operation selects some predicates from the models in input.
        </p>
    </div>
    <div class="m-3">
        {#each input_predicates as predicate}
            <Input type="switch"
                   label="{predicate}"
                   checked="{options.predicates.includes(predicate)}"
                   on:change={() => toggle_predicate(predicate)}
                   />
        {/each}
    </div>
</Operation>
