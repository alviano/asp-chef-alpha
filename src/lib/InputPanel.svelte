<script>
    import {Button, Card, CardBody, CardHeader, CardTitle, Icon, Input} from "sveltestrap";
    import {consts} from "$lib/consts";
    import {Popover} from "dumbo-svelte";

    export let value;
</script>

<Card class="p-0">
    <CardHeader>
        <CardTitle>
            Input
            <span class="float-end">
                <code class="h6 me-3">models: {value.split(consts.SYMBOLS.MODELS_SEPARATOR).length}</code>
                <Popover title="Remove operation" value="Remove input content.">
                    <Button size="sm" color="danger" on:click={() => value = ''}><Icon name="trash" /></Button>
                </Popover>
            </span>
        </CardTitle>
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
