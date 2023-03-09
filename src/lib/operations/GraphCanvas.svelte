<script>
    import {onMount, tick} from "svelte";
    import {scaleLinear, scaleOrdinal} from "d3-scale";
    import {zoom, zoomIdentity} from "d3-zoom";
    import {schemeCategory10} from "d3-scale-chromatic";
    import {pointer, select, selectAll} from "d3-selection";
    import {drag} from "d3-drag";
    import {forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY} from "d3-force";
    import {Card} from "sveltestrap";
    import {Utils} from "$lib/utils";
    import {consts} from "$lib/consts";

    let d3 = {
        zoom,
        zoomIdentity,
        scaleLinear,
        scaleOrdinal,
        schemeCategory10,
        select,
        selectAll,
        pointer,
        drag,
        forceSimulation,
        forceLink,
        forceManyBody,
        forceCenter,
        forceCollide,
        forceX,
        forceY,
    };

    export let graph;
    export let maxHeight;
    export let maxWidth;

    let defaults = {
        node_radius: 20,
        node_color: "lightgray",
        node_text_color: "black",
        node_font: "8px monospace",
        node_opacity:  1,
        link_color:  "darkgrey",
        link_text_color:  "white",
        link_opacity:  1,
    };
    defaults = {...defaults, ...graph.defaults}

    export let search = null;
    export let search_color = "yellow";
    export let search_text_color = "red";

    $: search_color, update_search(search);

    let canvas;

    let transform = d3.zoomIdentity;
    let context = null;
    let simulation;

    const arrowLength = 20;
    const arrowAngle = Math.PI / 15;
    const zoom_graph = d3.zoom()
        .scaleExtent([1 / 10, 8])
        .on("zoom", zoomed);

    function init() {
        fullSizeCanvas();

        graph.nodes.forEach(node => {
            node.search_result = null;
        });

        update_search(search);
    }

    async function update_search(search) {
        if (context === null) {
            return;
        }
        graph.nodes.forEach(node => {
            node.search_result = null;
            if (search !== null) {
                const search_result = Utils.keep_occurrences(node.label, search);
                if (search_result.replaceAll(consts.SYMBOLS.SEARCH_FAIL, '').length > 0) {
                    node.search_result = search_result;
                }
            }
        });
        graph.links.forEach(link => {
            link.search_result = null;
            if (search !== null) {
                const search_result = Utils.keep_occurrences(link.label, search);
                if (search_result.replaceAll(consts.SYMBOLS.SEARCH_FAIL, '').length > 0) {
                    link.search_result = search_result.replaceAll('\n', consts.SYMBOLS.NEW_LINE);
                }
            }
        });
        simulationUpdate();
    }

    function draw_link(link, width4px) {
        const dx = link.target.x - link.source.x;
        const dy = link.target.y - link.source.y;
        const source_radius = link.source.radius || defaults.node_radius;
        const target_radius = link.target.radius || defaults.node_radius;
        const angle = Math.atan2(dy, dx);
        const length = Math.sqrt(dx * dx + dy * dy) - source_radius - target_radius;

        context.globalAlpha = link.opacity || defaults.link_opacity;
        context.lineWidth = 6;
        context.fillStyle = context.strokeStyle = link.search_result !== null && search_color !== '' ? search_color : (link.color || defaults.link_color);
        context.beginPath();
        context.moveTo(link.source.x + source_radius * Math.cos(angle), link.source.y + source_radius * Math.sin(angle));
        context.lineTo(link.target.x - (target_radius + arrowLength - 1) * Math.cos(angle), link.target.y - (target_radius + arrowLength - 1) * Math.sin(angle));
        context.stroke();
        context.moveTo(link.target.x - target_radius * Math.cos(angle), link.target.y - target_radius * Math.sin(angle));
        context.lineTo(link.target.x - (target_radius + arrowLength) * Math.cos(angle - arrowAngle), link.target.y - (target_radius + arrowLength) * Math.sin(angle - arrowAngle));
        context.lineTo(link.target.x - (target_radius + arrowLength) * Math.cos(angle + arrowAngle), link.target.y - (target_radius + arrowLength) * Math.sin(angle + arrowAngle));
        context.fill();
        context.globalAlpha = 1;

        context.font = "4px monospace";
        context.fillStyle = link.text_color || defaults.link_text_color;
        context.textAlign = "start";
        context.textBaseline = "middle";
        context.translate(link.source.x + source_radius * Math.cos(angle), link.source.y + source_radius * Math.sin(angle))
        context.rotate(angle);
        if (link.search_result !== null) {
            context.lineWidth = 1.5;
            context.strokeStyle = search_text_color;
            context.strokeText(Utils.abbreviate(link.search_result.replaceAll(consts.SYMBOLS.SEARCH_FAIL, ' '), Math.floor(length / width4px) - 2), width4px, 0);
        }
        context.fillText(Utils.abbreviate(link.label, Math.floor(length / width4px) - 2), width4px, 0);
        context.rotate(-angle);
        context.translate(-link.source.x - source_radius * Math.cos(angle), -link.source.y - source_radius * Math.sin(angle))
    }

    function draw_node(node) {
        context.globalAlpha = node.opacity || defaults.node_opacity;
        context.beginPath();
        context.arc(node.x, node.y, node.radius || defaults.node_radius, 0, 2 * Math.PI);
        if (node.search_result !== null && search_color !== '') {
            context.fillStyle = search_color;
        } else {
            context.fillStyle = node.color || defaults.node_color;
        }
        context.fill();
        context.globalAlpha = 1;

        context.font = defaults.node_font;
        context.fillStyle = node.text_color || defaults.node_text_color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        if (node.search_result !== null) {
            context.lineWidth = 1.5;
            context.strokeStyle = search_text_color;
            context.strokeText(node.search_result.replaceAll(consts.SYMBOLS.SEARCH_FAIL, ' '), node.x, node.y);
        }
        context.fillText(node.label, node.x, node.y);
    }

    function simulationUpdate() {
        if (context === null) {
            return;
        }

        context.save();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.translate(transform.x, transform.y);
        context.scale(transform.k, transform.k);
        graph.links.forEach((link) => {
            context.font = "4px monospace";
            const metrics = context.measureText("M");
            draw_link(link, metrics.width || 2.4);
        });
        graph.nodes.forEach((node) => {
            draw_node(node);
        });
        context.restore();
    }

    function zoomed(currentEvent) {
        transform = currentEvent.transform;
        simulationUpdate();
    }

    // Use the d3-force simulation to locate the node
    function drag_subject(currentEvent) {
        const node = simulation.find(
            transform.invertX(currentEvent.x),
            transform.invertY(currentEvent.y),
            defaults.node_radius
        );
        if (node) {
            node.x = transform.applyX(node.x);
            node.y = transform.applyY(node.y);
        }
        return node;
    }

    function drag_started(currentEvent) {
        if (!currentEvent.active) {
            simulation.alphaTarget(0.3).restart();
        }
        currentEvent.subject.fx = transform.invertX(currentEvent.subject.x);
        currentEvent.subject.fy = transform.invertY(currentEvent.subject.y);
    }

    function dragged(currentEvent) {
        currentEvent.subject.fx = transform.invertX(currentEvent.x);
        currentEvent.subject.fy = transform.invertY(currentEvent.y);
    }

    function drag_ended(currentEvent) {
        if (!currentEvent.active) {
            simulation.alphaTarget(0);
        }
        currentEvent.subject.fx = null;
        currentEvent.subject.fy = null;
    }

    function fullSizeCanvas() {
        // Make it visually fill the positioned parent
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        // ...then set the internal size to match
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    onMount(async () => {
        context = canvas.getContext("2d");
        await tick();
        init();

        simulation = d3
            .forceSimulation(graph.nodes)
            .force("link", d3.forceLink(graph.links).id((link) => link.id).distance((link) => link.target.y - link.source.y))
            .force("charge", d3.forceManyBody().strength(5))
            .force("center", d3.forceCenter(canvas.width / 2, canvas.height / 2))
            .force('collide', d3.forceCollide().radius((node) => (node.radius || defaults.node_radius) * 2))
            .on("tick", simulationUpdate);

        // select node
        // d3.select(context.canvas).on("mousemove", (event) => {
        //     if (graph.selected_node === null) {
        //         const node = simulation.find(
        //             transform.invertX(event.offsetX),
        //             transform.invertY(event.offsetY),
        //             defaults.node_radius
        //         );
        //         if (node !== graph.selected_node) {
        //             graph.selected_node = node;
        //         }
        //     }
        // });

        d3.select(canvas)
            .call(
                d3
                    .drag()
                    .container(canvas)
                    .subject(drag_subject)
                    .on("start", drag_started)
                    .on("drag", dragged)
                    .on("end", drag_ended)
            )
            .call(zoom_graph)
            .call(zoom_graph.transform, transform);
    });
</script>

<Card style="height: {maxHeight}px; width: {maxWidth}px;">
    <canvas bind:this={canvas}></canvas>
</Card>
