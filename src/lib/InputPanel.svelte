<script>
    import {Button, Card, CardBody, CardHeader, CardTitle, Icon, Input} from "sveltestrap";
    import {consts} from "$lib/consts";
    import {keydown, Popover} from "dumbo-svelte";
    import {Utils} from "$lib/utils";
    import CodeMirror from "svelte-codemirror-editor";

    export let value;

    let editor;

    $keydown.push((event) => {
        if (event.uKey === 'I') {
            editor.$$.ctx[15].focus();  // a bit fragile, but I have not found any other way to get the EditorView
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
        <Popover block placement="left" title="Input panel">
            <div slot="value">
                <p>Provide one or more models separated by {consts.SYMBOLS.MODELS_SEPARATOR}</p>
                <p>Jump to this textarea with the keybinding <code>I</code></p>
            </div>
            <CodeMirror bind:this={editor} bind:value
                        placeholder={`One or more models separated by ${consts.SYMBOLS.MODELS_SEPARATOR}`}
                        lineWrapping="{true}"
            />
            <Input type="textarea"
                   class="d-none"
                   {value}
                   data-testid="InputPanel-textarea"
            />
        </Popover>
    </CardBody>
</Card>
