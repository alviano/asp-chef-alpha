<script context="module">
    import {Recipe} from "$lib/recipe";

    const operation = "Filter";
    const default_extra_options = {
        pattern: '',
    };

    Recipe.register_operation_type(operation, async (input, options) => {
        return input.map(part => {
            return part.filter(atom => atom.str.match(new RegExp(options.pattern, 'i')) );
        });
    });
</script>

<script>
    import {Input} from "sveltestrap";
    import Operation from "$lib/operations/Operation.svelte";

    export let options;
    export let index;

    function edit() {
        Recipe.edit_operation(index, options);
    }
</script>

<Operation {operation} {options} {index} {default_extra_options}>
    <div slot="description">
        <p>The <strong>{operation}</strong> operation filters the atoms in input using a regular expression.</p>
        <p>
            Each atom of each model in input is matched against the given pattern.
            Atoms not matching the pattern are discarded.
        </p>
    </div>
    <Input type="search"
           bind:value="{options.pattern}"
           placeholder="filter..."
           on:input={edit}
    />
</Operation>
