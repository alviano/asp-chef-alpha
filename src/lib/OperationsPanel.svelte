<script>
    import Operation from "$lib/Operation.svelte";
    import ProgramOperation from "$lib/operations/ProgramOperation.svelte";
    import {Card, CardBody, CardHeader, CardTitle} from "sveltestrap";
</script>

<Card>
    <CardHeader>
        <CardTitle>Operations</CardTitle>
    </CardHeader>
    <CardBody class="p-1">
        <ProgramOperation />
        <Operation label="#show" />
    </CardBody>
</Card>

