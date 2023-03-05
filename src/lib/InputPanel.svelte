<script>
    import {Button, Card, CardBody, CardHeader, CardTitle, Icon, Input, InputGroup, InputGroupText} from "sveltestrap";
    import {consts} from "$lib/consts";
    import {keydown, Popover} from "dumbo-svelte";
    import {input_rows} from "$lib/stores";
    import {Utils} from "$lib/utils";

    export let value;

    function update_input_rows(rows) {
        if (rows !== $input_rows) {
            $input_rows = rows;
        }
    }

    let rows = $input_rows;
    $: update_input_rows(rows);

    $keydown.push((event) => {
        if (event.uKey === 'I') {
            document.getElementById("InputPanel-textarea").focus()
            Utils.snackbar("Focus on Input...");
            return true;
        }
    });
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
        <Popover block placement="left" title="Input panel">
            <div slot="value">
                <p>Provide one or more models separated by {consts.SYMBOLS.MODELS_SEPARATOR}</p>
                <p>Jump to this textarea with the keybinding <code>I</code></p>
            </div>
            <Input type="textarea"
                   id="InputPanel-textarea"
                   placeholder={`One or more models separated by ${consts.SYMBOLS.MODELS_SEPARATOR}`}
                   {rows}
                   name="input"
                   bind:value={value}
                   data-testid="InputPanel-textarea"
            />
        </Popover>
    </CardBody>
</Card>
