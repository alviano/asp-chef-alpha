<script context="module">
    import {Recipe} from "$lib/recipe";

    const operation = "Table";
    const default_extra_options = {
    };

    const listeners = new Map();

    Recipe.register_operation_type(operation, async (input, options, index, id) => {
        listeners.get(id)(input);
        return input;
    });
</script>

<script>
    import {Table} from "sveltestrap";
    import Operation from "$lib/operations/Operation.svelte";
    import {onDestroy, onMount} from "svelte";

    export let id;
    export let options;
    export let index;
    export let add_to_recipe;

    let models = [];

    function edit() {
        Recipe.edit_operation(index, options);
    }

    function argument_indices(model) {
        const max = model.reduce((max, atom) => Math.max(max, atom.terms ? atom.terms.length : 0), 0);
        return [...Array(max).keys()];
    }

    onMount(() => {
        listeners.set(id, (input) => {
            models = input;
        });
    });

    onDestroy(() => {
        listeners.delete(id);
    });
</script>

<Operation {id} {operation} {options} {index} {default_extra_options} {add_to_recipe}>
    <div slot="description">
        <p>
            The <strong>{operation}</strong> operation shows input models in tables.
        </p>
        <p>
            Each table comprises one row for each atom in the associated model.
        </p>
        <p>
            The input is echoed in output.
        </p>
    </div>
    <div class="m-1">
        {#each models as model, model_index}
            <h6 class="text-center">Model #{model_index + 1}</h6>
            <Table bordered>
                <thead>
                    <tr>
                        <th>Predicate</th>
                        {#each argument_indices(model) as arg_index}
                            <th>Arg#{arg_index + 1}</th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#if model.length === 0}
                        <tr>
                            <td>EMPTY</td>
                        </tr>
                    {:else}
                        {#each model as atom}
                            <tr>
                                <td><code>{atom.predicate || atom.str}</code></td>
                                {#if atom.terms}
                                    {#each atom.terms as term}
                                        <td><code>{term.str}</code></td>
                                    {/each}
                                {/if}
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </Table>
        {/each}
    </div>
</Operation>
