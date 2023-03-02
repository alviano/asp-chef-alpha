<script>
    import {Button, Card, CardBody, CardHeader, CardTitle, Icon, Input, InputGroup, InputGroupText} from "sveltestrap";
    import {consts} from "$lib/consts";
    import {Popover} from "dumbo-svelte";
    import {input_rows} from "$lib/stores";

    export let value;

    function update_input_rows(rows) {
        if (rows !== $input_rows) {
            $input_rows = rows;
        }
    }

    let rows = $input_rows;
    $: update_input_rows(rows);
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
        <InputGroup>
            <InputGroupText>Rows</InputGroupText>
            <Input type="number"
                   bind:value={rows}
                   min="1"
            />
        </InputGroup>
        <Input type="textarea"
               placeholder={`One or more models separated by ${consts.SYMBOLS.MODELS_SEPARATOR}`}
               {rows}
               name="input"
               bind:value={value}
               data-testid="InputPanel-textarea"
        />
    </CardBody>
</Card>
