<script>
    import {Card, CardBody, CardHeader, CardTitle} from "sveltestrap";
    import Nav from '$lib/Nav.svelte';
    import OperationsList from "$lib/operations/OperationsList.svelte";
</script>

<Nav />

<Card>
    <CardHeader>
        <CardTitle>Operations</CardTitle>
    </CardHeader>
    <CardBody class="p-0">
        <OperationsList index="{undefined}" />
    </CardBody>
</Card>
