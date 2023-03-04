<script context="module">
    import {Recipe} from "$lib/recipe";
    import {Utils} from "$lib/utils";

    const operation = "Encode";
    const default_extra_options = {
        rows: 5,
        predicate: '__base64__',
        content: '',
    };

    Recipe.register_operation_type(operation, async (input, options) => {
        const content = btoa(options.content);
        const encoded_content = `${options.predicate}("${content}").`;
        const mapper = atom => atom.str + '.';
        const res = [];
        for (const part of input) {
            try {
                const program = part.map(mapper).join('\n') + encoded_content;
                const model = await Utils.search_model(program);
                res.push(Utils.parse_atoms(model));
            } catch (error) {
                res.push([{str: error}])
            }
        }
        return res;
    });
</script>

<script>
    import {Input, InputGroup, InputGroupText} from "sveltestrap";
    import Operation from "$lib/operations/Operation.svelte";

    export let id;
    export let options;
    export let index;
    export let add_to_recipe;

    function edit() {
        Recipe.edit_operation(index, options);
    }
</script>

<Operation {id} {operation} {options} {index} {default_extra_options} {add_to_recipe}>
    <div slot="description">
        <p>The <strong>{operation}</strong> operation extends models in input with some encoded content (usually rules).</p>
        <p>
            The content is base64 encoded and wrapped by predicate <code>__base64__</code>.
        </p>
        <p>
            The name of the unary predicate <code>__base64__</code> can be specified in the recipe.
        </p>
    </div>
    <InputGroup>
        <InputGroupText>Rows</InputGroupText>
        <Input type="number"
               bind:value={options.rows}
               min="1"
               on:input={edit}
        />
    </InputGroup>
    <Input type="textarea"
           rows={options.rows}
           bind:value="{options.content}"
           placeholder="One or more lines..."
           on:input={edit}
           data-testid="Encode-rules"
    />
    <Input type="search"
           bind:value="{options.predicate}"
           placeholder="predicate"
           on:input={edit}
    />
</Operation>
