<script>
    import {Card, CardBody, CardHeader, CardTitle, Input, Spinner} from "sveltestrap";
    import {Recipe} from "$lib/recipe";

    let filter = '';
</script>

<Card>
    <CardHeader>
        <CardTitle>Operations</CardTitle>
    </CardHeader>
    <CardBody class="p-1">
        <Input class="mb-1" type="search" bind:value={filter} placeholder="filter..." />
        {#await Recipe.svelte_components(filter)}
            <Spinner />
        {:then components}
            {#each components as component}
                <div class="mb-1">
                    <svelte:component this={component} options="{undefined}" index="{undefined}" />
                </div>
            {/each}
        {/await}
    </CardBody>
</Card>

