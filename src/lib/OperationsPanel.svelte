<script>
    import ProgramOperation from "$lib/operations/Program.svelte";
    import {Card, CardBody, CardHeader, CardTitle} from "sveltestrap";
    import RemoveErrors from "$lib/operations/RemoveErrors.svelte";
</script>

<Card>
    <CardHeader>
        <CardTitle>Operations</CardTitle>
    </CardHeader>
    <CardBody class="p-1">
        <ProgramOperation />
        <RemoveErrors />
    </CardBody>
</Card>

