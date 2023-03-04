<script>
    import {Card, CardBody, CardHeader, CardTitle} from "sveltestrap";
    import Nav from '$lib/Nav.svelte';
    import OperationsDetail from "$lib/operations/OperationsDetail.svelte";
</script>

<Nav />

<Card>
    <CardHeader>
        <CardTitle>Operations</CardTitle>
    </CardHeader>
    <CardBody class="p-0">
        <OperationsDetail index="{undefined}" />
    </CardBody>
</Card>
