<script context="module">
    import {Recipe} from "$lib/recipe";
    import {Utils} from "$lib/utils";

    const operation = "Program";
    const default_extra_options = {
        rules: '',
        number: 1,
        raises: true,
    };

    Recipe.register_operation_type(operation, async (input, options) => {
        const res = [];
        for (const part of input) {
            try {
                const program = part.map(atom => atom.str + '.').join('\n') + options.rules;
                const models = await Utils.search_models(program, options.number, options.raises);
                models.forEach(model => {
                    res.push(Utils.parse_atoms(model));
                });
            } catch (error) {
                res.push([{str: error}])
            }
        }
        return res;
    });
</script>

<script>
    import {Button, Input, InputGroup, InputGroupText} from "sveltestrap";
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
            The <strong>program</strong> operation replaces each model in input with a sequence of models.
        </p>
        <p>
            Each model in input is used as the input of a program given in the recipe.
        </p>
        <p>
            In addition to the rules of the program, the number of models can be specified (0 for unbounded).
            An error can be raised if the specified number of models is not produced (if 0, the program is expected to be incoherent).
        </p>
    </div>
    <Input type="textarea"
           rows=5
           bind:value="{options.rules}"
           placeholder="One or more ASP rules..."
           on:input={edit}
    />
    <InputGroup>
        <InputGroupText># of models</InputGroupText>
        <Input type="number"
               bind:value={options.number}
               on:input={edit}
        />
        <Button outline="{!options.raises}" on:click={() => { options.raises = !options.raises; edit(); }}>Raise error</Button>
    </InputGroup>
</Operation>
