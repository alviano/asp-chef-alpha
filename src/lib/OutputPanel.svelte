<script>
    import {Card, CardBody, CardHeader, CardTitle, Input} from "sveltestrap";

    export let value = [];

    $: text_value = value.map(atoms => atoms.map(atom => atom.str + '.').join('\n')).join('\n§\n');
</script>

<Card class="p-0">
    <CardHeader>
        <CardTitle>Output</CardTitle>
    </CardHeader>
    <CardBody class="p-0">
        <Input type="textarea" rows=10 readonly name="output" value="{text_value}" />
    </CardBody>
</Card>