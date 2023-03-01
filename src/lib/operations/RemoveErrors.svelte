<script context="module">
    import {Recipe} from "$lib/recipe";

    const operation = "Remove Errors";
    const default_extra_options = {
        filter: "",
    };

    Recipe.register_operation_type(operation, async (input, options) => {

        return input.filter(part =>
            part.length !== 1 ||
            !String(part[0].str).startsWith('Error: ') ||
            !String(part[0].str).match(new RegExp(options.filter, 'i'))
        );
    });
</script>

<script>
    import Operation from "$lib/operations/Operation.svelte";
    import {Input} from "sveltestrap";

    export let options;
    export let index;

    function edit() {
        Recipe.edit_operation(index, options);
    }
</script>

<Operation {operation} {options} {index} {default_extra_options}>
    <div slot="description">
        <p>
            The <strong>{operation}</strong> operation discards input parts being errors.
        </p>
        <p>
            The errors to be discarded can be specified by means of a regular expression.
        </p>
    </div>
    <Input type="search"
           bind:value="{options.filter}"
           placeholder="filter..."
           on:input={edit}
    />
</Operation>