<script context="module">
    import {Recipe} from "$lib/recipe";
    import {Utils} from "$lib/utils";
    import jsonpath from "jsonpath";

    const operation = "JSON Path";
    const default_extra_options = {
        height: 200,
        decode_predicate: '__base64__',
        query: '',
        output_predicate: '__json__'
    };

    Recipe.register_operation_type(operation, async (input, options) => {
        const object_mapper = object => {
            if (typeof object === 'string') {
                return `"${object.replaceAll('"', '\\"')}"`;
            } else if (typeof object === 'number') {
                return object;
            } else if (Array.isArray(object)) {
                return object.map(object_mapper).join(',')
            } else if (typeof object === 'object') {
                return Object.keys(object).map(key => `${key}(${object_mapper(object[key])})`).join(',');
            }
            return object
        };
        const mapper = atom => atom.str + '.';
        const res = [];
        for (const part of input) {
            try {
                const program = part.map(atom => {
                    if (atom.predicate === options.decode_predicate) {
                        const data = JSON.parse(atob(atom.terms[0].str.slice(1, -1)));
                        const answer = jsonpath.query(data, options.query);
                        return answer.map(object_mapper).map(term => `${options.output_predicate}(${term}).`).join('\n') + '\n' + mapper(atom);
                    }
                    return mapper(atom);
                }).join('\n');
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
            The <strong>{operation}</strong> operation applies JSON Path queries to Base64 encoded JSON documents
            (use an Encode operation).
        </p>
        <p>
            Each object in the answer is mapped to a fact.
            Strings are quoted.
            Arrays are expanded to arguments.
            Objects are mapped to functions (keys are expected to be valid terms).
            An example is reported below.
        </p>
        <code><pre>{@html `{
    "nodes": [1, 2, 3],
    "links": [
        [1, 2],
        [2, 3],
        [3, 1]
    ]
}`}</pre></code>
        <p>
            Add two JSON Path queries, <code>$.nodes.*</code> and <code>$.links.*</code> to produce
        </p>
        <code><pre>node(1).
node(2).
node(3).
link(1,2).
link(2,3).
link(3,1).</pre></code>
    </div>
    <InputGroup>
        <InputGroupText>Height</InputGroupText>
        <Input type="number"
               bind:value={options.height}
               min="1"
               style="max-width: 5em;"
               on:input={edit}
        />
        <InputGroupText>Decode</InputGroupText>
        <Input type="search"
               bind:value={options.decode_predicate}
               placeholder="decode predicate"
               on:input={edit}
        />
    </InputGroup>
    <Input type="search"
           bind:value={options.query}
           placeholder="$.phoneNumbers[:1].type"
           on:input={edit}
           data-testid="JSONPath-path"
    />
    <InputGroup>
        <InputGroupText>Output predicate</InputGroupText>
        <Input type="search"
               bind:value={options.output_predicate}
               placeholder="predicate"
               on:input={edit}
               data-testid="JSONPath-output-predicate"
        />
    </InputGroup>
</Operation>
