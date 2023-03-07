<script>
    import CodeMirror from "svelte-codemirror-editor";
    import {Button, Card, CardBody, CardHeader, CardTitle, Icon, Input} from "sveltestrap";
    import {AutoHideBadge, Popover} from "dumbo-svelte";
    import {createEventDispatcher} from "svelte";
    import {Utils} from "$lib/utils";

    const dispatch = createEventDispatcher();

    export let value = [];
    $: text_value = Utils.flatten_output(value);
</script>

<Card class="p-0">
    <CardHeader>
        <CardTitle>
            Output
            <span class="float-end">
                <code class="h6 me-3">models: {value.length}</code>
                <Popover title="Set as input" value="Replace input with the current content in output.">
                    <Button size="sm" on:click={() => dispatch('change_input', Utils.flatten_output(value, ''))}>
                        <Icon name="arrow-up-square" />
                    </Button>
                </Popover>
            </span>
        </CardTitle>
    </CardHeader>
    <CardBody class="p-0">
        <AutoHideBadge color="warning">readonly</AutoHideBadge>
        <CodeMirror bind:value={text_value} readonly placeholder="NO MODELS" lineWrapping="{true}" />
        <Input type="textarea" class="d-none" value="{text_value}" data-testid="OutputPanel-textarea" />
    </CardBody>
</Card>