<script>
    import {Utils} from "$lib/utils";
    import {Recipe} from "$lib/recipe";
    import AspChef from "$lib/AspChef.svelte";

    async function clingo_to_be_loaded() {
        while (window.clingo === undefined) {
            await Utils.delay(100);
        }
		await window.clingo.init(`${window.location.origin}/dist/clingo.wasm`);
    }

    async function process() {
        if (location.hash.length > 1) {
            const input = Recipe.deserialize(location.hash.slice(1));
            const output = await Recipe.process(input || '');
            return output.map(model => model.map(atom => `${atom.str}.`).join('\n')).join('\n§\n');
        }
    }
</script>

<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/clingo-wasm@0.1.1"></script>
</svelte:head>

{#await clingo_to_be_loaded().then(process)}
    Processing...
{:then output}
    <pre>{output}</pre>
{/await}

<!-- keep <AspChef> just to load operations -->
{#if false}
    <AspChef />
{/if}
