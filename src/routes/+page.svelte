<script>
    import AspChef from "$lib/AspChef.svelte";
    import {Spinner} from "sveltestrap";
    import {Utils} from "$lib/utils";
    import Nav from "$lib/Nav.svelte";

    async function clingo_to_be_loaded() {
        while (window.clingo === undefined) {
            await Utils.delay(100);
        }
		await window.clingo.init(`${window.location.origin}/dist/clingo.wasm`);
    }
</script>

<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/clingo-wasm@0.1.1"></script>
</svelte:head>

{#await clingo_to_be_loaded()}
    <Nav />
    <Spinner />
{:then _}
    <AspChef />
{/await}
