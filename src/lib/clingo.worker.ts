// adapted from clingo-wasm

import {init} from "clingo-wasm/src/run";

let run;

async function initRun(wasmUrl?: string) {
    run = await init({
        locateFile(path) {
            if (wasmUrl) {
                return wasmUrl;
            }
            if (path.endsWith(".wasm")) {
                return `${location.origin}/dist/clingo.wasm`;
            }
            return path;
        },
    });
}

onmessage = async (event) => {
    const message = event.data;

    if (message.type === "run") {
        if (!run) {
            await initRun();
        }
        const results = run(...message.args);
        postMessage(results, undefined);
    } else if (message.type === "init") {
        await initRun(message.wasmUrl);
        postMessage(null, undefined);
    }
};

export {};