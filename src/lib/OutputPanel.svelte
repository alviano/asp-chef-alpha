<script>
    import {Button, Card, CardBody, CardHeader, CardTitle, Icon, Input, InputGroup, InputGroupText} from "sveltestrap";
    import {Popover} from "dumbo-svelte";
    import {createEventDispatcher} from "svelte";
    import {output_rows} from "$lib/stores";

    const dispatch = createEventDispatcher();

    export let value = [];
    $: text_value = value.map(atoms => atoms.map(atom => atom.str + '.').join('\n')).join('\n§\n');

    function update_output_rows(rows) {
        if (rows !== $output_rows) {
            $output_rows = rows;
        }
    }

    let rows = $output_rows;
    $: update_output_rows(rows);
</script>

<Card class="p-0">
    <CardHeader>
        <CardTitle>
            Output
            <span class="float-end">
                <code class="h6 me-3">models: {value.length}</code>
                <Popover title="Set as input" value="Replace input with the current content in output.">
                    <Button size="sm" on:click={() => dispatch('change_input', text_value)}><Icon name="arrow-up-square" /></Button>
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
               {rows}
               readonly
               name="output"
               value="{text_value}"
               placeholder="EMPTY OUTPUT"
               data-testid="OutputPanel-textarea"
        />
    </CardBody>
</Card>