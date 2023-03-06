<script context="module">
    import {Recipe} from "$lib/recipe";
    import {Utils} from "$lib/utils";

    const operation = "Show";
    const default_extra_options = {
        height: 200,
        rules: '',
    };

    Recipe.register_operation_type(operation, async (input, options) => {
        const mapper = atom => atom.str + '.';
        const res = [];
        for (const part of input) {
            try {
                const program = part.map(mapper).join('\n') + '\n#show.\n' + options.rules;
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
            The <strong>{operation}</strong> operation replaces each model according to the specified <code>#show</code> directives.
        </p>
        <p>
            Each model in input is used as the input of a program given in the recipe.
        </p>
        <p>
            A program can be specified in general, but the target should be the set of <code>#show</code> directives.
        </p>
    </div>
    <InputGroup>
        <InputGroupText>Height</InputGroupText>
        <Input type="number"
               bind:value={options.height}
               min="1"
               on:input={edit}
        />
    </InputGroup>
    <Input type="textarea"
           rows={options.rows}
           bind:value="{options.rules}"
           placeholder="One or more #show directives..."
           on:input={edit}
    />
    <div style="height: {options.height}px; overflow-y: auto">
        <CodeMirror bind:value={options.rules}
                    placeholder={`One or more #show directives...`}
                    lineWrapping="{true}"
                    on:change={edit}
        />
        <Input type="textarea"
               class="d-none"
               value="{options.content}"
               data-testid="Show-content"
        />
    </div>
</Operation>
