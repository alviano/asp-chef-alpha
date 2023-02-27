<script>
    import {Card, CardBody, CardHeader, CardTitle, Input} from "sveltestrap";

    export let value;
</script>

<Card class="p-0">
    <CardHeader>
        <CardTitle>Input</CardTitle>
    </CardHeader>
    <CardBody class="p-0">
        <Input type="textarea" rows=10 name="input" bind:value={value} />
    </CardBody>
</Card>
