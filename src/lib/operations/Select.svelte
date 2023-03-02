<script context="module">
    import {Recipe} from "$lib/recipe";
    import {Utils} from "$lib/utils";

    const operation = "Select";
    const default_extra_options = {
        predicates: [],
    };

    const listeners = new Map();

    Recipe.register_operation_type(operation, async (input, options, index) => {
        listeners.get(index)(input);
        const included_predicates = new Set(options.predicates);
        return input.map(model => model.filter(atom => included_predicates.has(atom.predicate || 'CONSTANTS')));
    });
</script>

<script>
    import {Input} from "sveltestrap";
    import Operation from "$lib/operations/Operation.svelte";
    import {onDestroy, onMount} from "svelte";

    export let options;
    export let index;

    let input_predicates = [];

    function edit() {
        Recipe.edit_operation(index, options);
    }

    function toggle_predicate(predicate) {
        const index_of_predicate = options.predicates.indexOf(predicate);
        if (index_of_predicate !== -1) {
            options.predicates.splice(index, 1);
        } else {
            options.predicates.push(predicate);
        }
        edit();
    }

    onMount(() => {
        listeners.set(index, (input) => {
            input_predicates = Utils.predicates(input);
        });
    });

    onDestroy(() => {
        listeners.set(index, null);
    });
</script>

<Operation {operation} {options} {index} {default_extra_options}>
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
