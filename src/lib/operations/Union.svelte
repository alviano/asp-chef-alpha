<script context="module">
    import {Recipe} from "$lib/recipe";
    import {Utils} from "$lib/utils";

    const operation = "Union";
    const default_extra_options = {
        rows: 5,
        rules: '',
        decode_predicate: '__base64__',
    };

    Recipe.register_operation_type(operation, async (input, options) => {
        const mapper = atom => atom.str + '.';
        const res = [];
        for (const part of input) {
            try {
                const program = part.map(atom => {
                    if (atom.predicate === options.decode_predicate) {
                        return atob(atom.terms[0].str.slice(1, -1));
                    }
                    return mapper(atom);
                }).join('\n') + options.rules;
                const consequences = await Utils.brave_consequences(program);
                res.push(Utils.parse_atoms(consequences));
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
    export let keybinding;

    function edit() {
        Recipe.edit_operation(index, options);
    }
</script>

<Operation {id} {operation} {options} {index} {default_extra_options} {add_to_recipe} {keybinding}>
    <div slot="description">
        <p>
            The <strong>{operation}</strong> operation replaces each model in input with a sequence of <em>brave consequences</em>.
        </p>
        <p>
            A unary predicate is decoded as part of the program (default <code>__base64__/1</code>).
        </p>
        <p>
            Each model in input is used as the input of a program given in the recipe, and its brave consequences are computed.
            <em>Weak constraints should not be included in the program; use the <strong>Optimize</strong> operation.</em>
        </p>
    </div>
    <InputGroup>
        <InputGroupText>Rows</InputGroupText>
        <Input type="number"
               bind:value={options.rows}
               min="1"
               style="max-width: 5em;"
               on:input={edit}
        />
        <InputGroupText>Decode</InputGroupText>
        <Input type="search"
               bind:value={options.decode_predicate}
               on:input={edit}
        />
    </InputGroup>
    <Input type="textarea"
           rows={options.rows}
           bind:value="{options.rules}"
           placeholder="One or more ASP rules..."
           on:input={edit}
    />
</Operation>
