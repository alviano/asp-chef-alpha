<script context="module">
    import {Recipe} from "$lib/recipe";
    import {Utils} from "$lib/utils";

    const operation = "Wrap";
    const default_extra_options = {
        predicate: '__atom__',
    };

    Recipe.register_operation_type(operation, async (input, options) => {
        const res = [];
        for (const part of input) {
            try {
                const model = await Utils.search_model(part.map(atom => `${options.predicate}(${atom.str}).`).join('\n'));
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

    export let id;
    export let options;
    export let index;

    function edit() {
        Recipe.edit_operation(index, options);
    }
</script>

<Operation {id} {operation} {options} {index} {default_extra_options}>
    <div slot="description">
        <p>
            The <strong>{operation}</strong> operation considers the elements in input as terms of a unary predicate.
        </p>
        <p>
            Each model in input is mapped to a model comprising facts of the form <br />
            <code class="ms-3">__atom__(ATOM).</code><br />
            where <code>ATOM</code> is an atom in the model.
        </p>
        <p>
            The name of the unary predicate <code>__atom__</code> can be specified in the recipe.
        </p>
    </div>
    <Input type="search"
           bind:value="{options.predicate}"
           placeholder="predicate"
           on:input={edit}
    />
</Operation>
