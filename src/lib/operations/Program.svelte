<script context="module">
    import {Recipe} from "$lib/recipe";
    import {Utils} from "$lib/utils";

    const operation = "Program";
    const default_extra_options = {
        rules: '',
    };

    Recipe.register_operation_type(operation, async (input, options) => {
        const res = [];
        for (const part of input) {
            try {
                const model = await Utils.search_model(part.map(atom => atom.str + '.').join('\n') + options.rules);
                res.push(Utils.parse_atoms(model));
            } catch (error) {
                res.push([{str: error}])
            }
        }
        return res;
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
    <Input type="textarea" rows=5 bind:value="{options.rules}" on:input={edit} />
</Operation>
