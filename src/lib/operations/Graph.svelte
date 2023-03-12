<script context="module">
    import {Recipe} from "$lib/recipe";
    import {Utils} from "$lib/utils";

    const operation = "Graph";
    const default_extra_options = {
        height: 500,
        node_radius: 20,
        predicate: '__graph__',
        echo: false,
        search: '',
        search_color: 'yellow',
        search_text_color: 'red',
    };

    const listeners = new Map();

    Recipe.register_operation_type(operation, async (input, options, index, id) => {
        try {
            listeners.get(id)(input, options);
        } catch (error) { /* component not mounted, possibly because of headless mode */ }
        return options.echo ? input : input.map(model => model.filter(atom => atom.predicate !== options.predicate));
    });

    function process_node(nodes, links, atom) {
        const key = atom.terms[0].terms[0].str;
        if (!nodes.has(key)) {
            nodes.set(key, {
                id: key,
                label: '',
            });
        }
        const node = nodes.get(key);
        for (let term_index = 1; term_index < atom.terms.length; term_index++) {
            const term = atom.terms[term_index];
            const property = term.functor;
            const terms = term.terms;
            if (property === 'label') {
                node.label = `${terms[0].string || terms[0].number || terms[0].str}`;
            } else if (property === 'color') {
                node.color = terms[0].string || terms[0].str;
            } else if (property === 'text_color') {
                node.text_color = terms[0].string || terms[0].str;
            } else if (property === 'font') {
                node.font = terms[0].string;
            } else if (property === 'radius') {
                node.radius = terms[0].number;
            } else if (property === 'shape') {
                node.shape = terms.length > 1 ? terms.map(term => term.number) : terms[0].string || terms[0].str;
            } else if (property === 'opacity') {
                node.opacity = terms[0].number / 100;
            } else if (property === 'fx') {
                node.fx = terms[0].number;
            } else if (property === 'fy') {
                node.fy = terms[0].number;
            } else {
                Utils.snackbar('Unknown node property: ' + property);
            }
        }
    }

    function process_link(nodes, links, atom) {
        const key = `${atom.terms[0].terms[0].str},${atom.terms[0].terms[1].str}`;
        if (!links.has(key)) {
            links.set(key, {
                source: atom.terms[0].terms[0].str,
                target: atom.terms[0].terms[1].str,
                label: '',
            });
        }
        const link = links.get(key);
        for (let term_index = 1; term_index < atom.terms.length; term_index++) {
            const term = atom.terms[term_index];
            const property = term.functor;
            const terms = term.terms;
            if (property === 'label') {
                link.label = `${terms[0].string || terms[0].number || terms[0].str}`;
            } else if (property === 'color') {
                link.color = terms[0].string || terms[0].str;
            } else if (property === 'undirected') {
                link.undirected = true;
            } else if (property === 'text_color') {
                link.text_color = terms[0].string || terms[0].str;
            } else if (property === 'opacity') {
                link.opacity = terms[0].number / 100;
            } else {
                Utils.snackbar('Unknown link property: ' + property);
            }
        }
    }

    function process_defaults(defaults, term) {
        const property = term.functor;
        const terms = term.terms;
        if (property === 'node_radius') {
            defaults.node_radius = terms[0].number;
        } else if (property === 'node_color') {
            defaults.node_color = terms[0].string || terms[0].str;
        } else if (property === 'node_text_color') {
            defaults.node_text_color = terms[0].string || terms[0].str;
        } else if (property === 'node_font') {
            defaults.node_font = terms[0].string;
        } else if (property === 'node_opacity') {
            defaults.node_opacity = terms[0].number / 100;
        } else if (property === 'link_color') {
            defaults.link_color = terms[0].string || terms[0].str;
        } else if (property === 'link_text_color') {
            defaults.link_text_color = terms[0].string;
        } else if (property === 'link_opacity') {
            defaults.link_opacity = terms[0].number / 100;
        } else {
            Utils.snackbar('Unknown default property: ' + property);
        }
    }

    function model2graph(model, options) {
        const nodes = new Map();
        const links = new Map();
        const defaults = {};
        model.forEach(atom => {
            if (atom.predicate === options.predicate) {
                if (atom.terms[0].functor === 'node') {
                    process_node(nodes, links, atom);
                } else if (atom.terms[0].functor === 'link') {
                    process_link(nodes, links, atom);
                } else if (atom.terms[0].functor === 'defaults') {
                    for (let term_index = 1; term_index < atom.terms.length; term_index++) {
                        process_defaults(defaults, atom.terms[term_index])
                    }
                } else {
                    Utils.snackbar('Fail to process graph atom: ' + atom.str);
                }
            }
        });
        return {
            nodes: Array.from(nodes.values()),
            links: Array.from(links.values()),
            defaults,
        };
    }
</script>

<script>
    import {Button, Input, InputGroup, InputGroupText} from "sveltestrap";
    import Operation from "$lib/operations/Operation.svelte";
    import {onDestroy, onMount, tick} from "svelte";
    import GraphCanvas from "$lib/operations/GraphCanvas.svelte";

    export let id;
    export let options;
    export let index;
    export let add_to_recipe;
    export let keybinding;

    let graphs = [];
    let number_of_models = 0;

    function edit() {
        Recipe.edit_operation(index, options);
    }

    onMount(() => {
        listeners.set(id, async (input, options) => {
            number_of_models = input.length;
            graphs.length = 0;
            await tick();
            if (input.length > 0) {
                graphs = [model2graph(input[0], options)];
            }
        });
    });

    onDestroy(() => {
        listeners.delete(id);
    });
</script>

<Operation {id} {operation} {options} {index} {default_extra_options} {add_to_recipe} {keybinding}>
    <div slot="description">
        <p>
            The <strong>{operation}</strong> operation shows one model in input as a graph.
        </p>
        <p>
            The graph is encoded by predicate <code>__graph__</code>.
            The first term is one of <code>node(ID)</code>, <code>link(SOURCE,TARGET)</code>, <code>defaults</code>.
            The other terms have the form <code>property(VALUE)</code>.
        </p>
        <p>
            Node properties: label, color, font, fx, fy, opacity, radius, shape, text_color.
        </p>
        <p>
            Link properties: label, color, opacity, undirected, text_color.
        </p>
        <p>
            Defaults properties:
            node_radius (also defining the capture area for dragging nodes),
            node_color,
            node_text_color,
            node_font,
            node_opacity,
            link_color,
            link_text_color,
            link_opacity.
        </p>
        <p>
            Labels can be searched in the graph.
        </p>
    </div>
    <InputGroup>
        <InputGroupText>Height</InputGroupText>
        <Input type="number" min="50" step="50" bind:value={options.height} on:input={edit} style="max-width: 5em;" />
        <InputGroupText>Predicate</InputGroupText>
        <Input type="text" placeholder="predicate" bind:value={options.predicate} on:input={edit} data-testid="Graph-predicate" />
        <Button outline="{!options.echo}" on:click={() => { options.echo = !options.echo; edit(); }}>Echo</Button>
    </InputGroup>
    {#if number_of_models !== 1}
        <InputGroup>
            <InputGroupText>
                Error: expecting 1 model in input, {number_of_models} models found!
            </InputGroupText>
        </InputGroup>
    {/if}
    {#each graphs as graph}
        <GraphCanvas
                {graph}
                max_height="{options.height}"
                search_pattern={options.search}
                search_color={options.search_color}
                search_text_color={options.search_text_color}
        />
    {/each}
    <InputGroup>
        <InputGroupText>Search</InputGroupText>
        <Input type="search" placeholder="Search..." bind:value={options.search} on:change={edit} />
    </InputGroup>
    <InputGroup>
        <InputGroupText>Highlight color</InputGroupText>
        <Input type="search" placeholder="Color..." bind:value={options.search_color} on:change={edit} />
        <InputGroupText>Highlight text color</InputGroupText>
        <Input type="search" placeholder="Text color..." bind:value={options.search_text_color} on:change={edit} />
    </InputGroup>
</Operation>
