<script>
    import {Card, CardBody, CardHeader, CardTitle, Input, Spinner} from "sveltestrap";
    import {Recipe} from "$lib/recipe";
    import Nav from '$lib/Nav.svelte';

    let filter = '';
</script>

<Nav />

<Card>
    <CardHeader>
        <CardTitle>Operations</CardTitle>
    </CardHeader>
    <CardBody class="p-0">
        <Input type="search" bind:value={filter} placeholder="filter..." />
        {#await Recipe.svelte_components(filter)}
            <Spinner />
        {:then components}
            {#each components as component}
                <svelte:component this={component} id="{undefined}" options="{undefined}" index="{undefined}" />
            {/each}
        {/await}
    </CardBody>
</Card>

