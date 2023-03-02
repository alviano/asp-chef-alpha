<script context="module">
    import {Recipe} from "$lib/recipe";
    import {Utils} from "$lib/utils";

    const operation = "Intersection";
    const default_extra_options = {
        rows: 5,
        rules: '',
    };

    Recipe.register_operation_type(operation, async (input, options) => {
        const res = [];
        for (const part of input) {
            try {
                const program = part.map(atom => atom.str + '.').join('\n') + options.rules;
                const consequences = await Utils.cautious_consequences(program);
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

    export let options;
    export let index;

    function edit() {
        Recipe.edit_operation(index, options);
    }
</script>

<Operation {operation} {options} {index} {default_extra_options}>
    <div slot="description">
        <p>
            The <strong>{operation}</strong> operation replaces each model in input with a sequence of <em>cautious consequences</em>.
        </p>
        <p>
            Each model in input is used as the input of a program given in the recipe, and its cautious consequences are computed.
            <em>Weak constraints should not be included in the program; use the <strong>Optimize</strong> operation.</em>
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
           bind:value="{options.rules}"
           placeholder="One or more ASP rules..."
           on:input={edit}
    />
</Operation>
