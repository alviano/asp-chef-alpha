<script context="module">
    import {Recipe} from "$lib/recipe";

    const operation = "Remove Errors";
    const default_extra_options = {};

    Recipe.register_operation_type(operation, async (input) => {
        console.log(input, input.filter(part => part.length !== 1 || !String(part[0].str).startsWith('Error: ')))
        return input.filter(part => part.length !== 1 || !String(part[0].str).startsWith('Error: '));
    });
</script>

<script>
    import Operation from "$lib/operations/Operation.svelte";

    export let options;
    export let index;
</script>

<Operation {operation} {options} {index} {default_extra_options} />