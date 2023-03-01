<script context="module">
    import {Recipe} from "$lib/recipe";
    import {Utils} from "$lib/utils";

    const operation = "Split";
    const default_extra_options = {
        predicate: '__model__',
    };

    Recipe.register_operation_type(operation, async (input, options) => {
        for (let index = 0; index < input.length; index++) {
            const part = input[index];
            try {
                const models = await Utils.search_models(part.map(atom => `${atom.str}.`).join('\n') + `
{__active_model__(1..NumberOfModels)} = 1 :- NumberOfModels = #count{Index : ${options.predicate}(Index, _)}.
#show.
#show Atom : __active_model__(Index), ${options.predicate}(Index, Atom).
                `, 0);
                return models.map(model => Utils.parse_atoms(model));
            } catch (error) {
                return [[{str: error}]]
            }
        }
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
        <p>The <strong>{operation}</strong> operation reverses the Merge operation.</p>
        <p>
            Atoms in input of the form<br />
            <code class="ms-3">__model__(INDEX, ATOM).</code><br />
            are mapped to model #<code>INDEX</code>.
        </p>
        <p>
            The name of the binary predicate <code>__model__</code> can be specified in the recipe.
        </p>
        <p>
            The order of models is not necessarily preserved.
            Empty models are also possibly discarded.
        </p>
    </div>
    <Input type="search"
           bind:value="{options.predicate}"
           placeholder="predicate"
           on:input={edit}
    />
</Operation>
