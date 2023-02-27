<script>
    import {Button} from "sveltestrap";
    import {recipe} from "$lib/stores";

    export let label;

    function add() {
        $recipe.push(label);
        recipe.set($recipe);
    }
</script>

<Button block outline on:click={add}>{label}</Button>
