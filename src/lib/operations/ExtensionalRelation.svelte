<script context="module">
    import {Recipe} from "$lib/recipe";
    import {Utils} from "$lib/utils";

    const operation = "Extensional Relation";
    const default_extra_options = {
        height: 200,
        predicate: '__edb__',
        instances: '',
    };

    Recipe.register_operation_type(operation, async (input, options) => {
        const facts = options.instances.split('\n').map(line => `${options.predicate}(${line}).`).join('\n');
        const mapper = atom => atom.str + '.';
        const res = [];
        for (const part of input) {
            try {
                const program = part.map(mapper).join('\n') + '\n' + facts;
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
    import CodeMirror from "svelte-codemirror-editor";

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
            The <strong>{operation}</strong> operation adds to each model the given extensional relation.
        </p>
        <p>
            Each provided row is mapped to a fact of the specified predicate (default to <code>__edb__</code>).
        </p>
    </div>
    <InputGroup>
        <InputGroupText>Height</InputGroupText>
        <Input type="number"
               bind:value={options.height}
               min="1"
               style="max-width: 5em;"
               on:input={edit}
        />
        <InputGroupText>Predicate</InputGroupText>
        <Input type="search"
               bind:value={options.predicate}
               placeholder="relation predicate"
               on:input={edit}
        />
    </InputGroup>
    <div style="height: {options.height}px; overflow-y: auto" data-testid="ExtensionalRelation-content">
        <CodeMirror bind:value={options.instances}
                    placeholder={`One or more instances...`}
                    lineWrapping="{true}"
                    on:change={edit}
        />
        <pre class="d-test">{options.instances}</pre>
    </div>
</Operation>