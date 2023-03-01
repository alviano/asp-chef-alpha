<script>
    import {Card, CardBody, CardHeader, CardTitle, Input} from "sveltestrap";
    import {consts} from "$lib/consts";

    export let value;
</script>

<Card class="p-0">
    <CardHeader>
        <CardTitle>Input</CardTitle>
    </CardHeader>
    <CardBody class="p-0">
        <Input type="textarea"
               placeholder={`One or more models separated by ${consts.SYMBOLS.MODELS_SEPARATOR}`}
               rows=10
               name="input"
               bind:value={value}
               data-testid="InputPanel-textarea"
        />
    </CardBody>
</Card>
