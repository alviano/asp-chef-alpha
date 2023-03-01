<script context="module">
    import {Recipe} from "$lib/recipe";
    import {Utils} from "$lib/utils";

    const operation = "Merge";
    const default_extra_options = {
        predicate: 'model',
    };

    Recipe.register_operation_type(operation, async (input, options) => {
        const res = [];
        for (let index = 0; index < input.length; index++) {
            const part = input[index];
            try {
                const model = await Utils.search_model(part.map(atom => `${options.predicate}(${index + 1}, ${atom.str}).`).join('\n'));
                res.push(Utils.parse_atoms(model));
            } catch (error) {
                res.push([{str: error}])
            }
        }
        return [res.flatMap(model => model)];
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
        <p>The <strong>{operation}</strong> operation combines all models in a single model.</p>
        <p>
            Each model in input is encoded by a sequence of facts of the form <br />
            <code class="ms-3">model(INDEX, ATOM).</code><br />
            where <code>INDEX</code> is an identifier for the model (starting from 1) and
            <code>ATOM</code> is an atom in the model.
        </p>
        <p>
            The name of the binary predicate <code>model</code> can be specified in the recipe.
        </p>
    </div>
    <Input type="search"
           bind:value="{options.predicate}"
           placeholder="predicate"
           on:input={edit}
    />
</Operation>
