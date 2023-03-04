import {default as peg} from 'pegjs';
import {consts} from '$lib/consts';
import {DOMPurifyConfig, Utils as BaseUtils} from "dumbo-svelte";
import _ from 'lodash';
// import {run} from 'clingo-wasm'

const dom_purify_config = new DOMPurifyConfig(consts);

export class Utils extends BaseUtils {
    static render_markdown(content: string) {
        return BaseUtils.render_markdown(content, dom_purify_config)
    }

    static render_inline_markdown(content: string) {
        return BaseUtils.render_inline_markdown(content, dom_purify_config);
    }

    static dom_purify(content: string) {
        return BaseUtils.dom_purify(content, dom_purify_config);
    }

    static get clingo() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return window.clingo;
    }

    static async search_model(program: string) {
        const result = await this.clingo.run(program);
        if (result.Result === 'ERROR') {
            throw new Error(result.Error);
        } else if (result.Models.Number === 0) {
            throw new Error('NO MODEL');
        } else {
            return result.Call[0].Witnesses[0].Value;
        }
    }

    static async search_models(program: string, number: number, raises: boolean) {
        const result = await this.clingo.run(program, number);
        if (result.Result === 'ERROR') {
            throw new Error(result.Error);
        } else if (raises && result.Models.Number !== number) {
            throw new Error(`Expecting ${number} models, found ${result.Models.Number}`);
        } else {
            return result.Call[0].Witnesses.map(witness => witness.Value);
        }
    }

    static async search_optimal_models(program: string, number: number, raises: boolean) {
        const result = await this.clingo.run(program, number, [
            '--opt-mode=optN',
        ]);
        if (result.Result === 'ERROR') {
            throw new Error(result.Error);
        } else if (raises && (result.Models.Optimal !== undefined ? result.Models.Optimal !== number : result.Models.Number !== number)) {
            throw new Error(`Expecting ${number} optimal models, found ${result.Models.Optimal}`);
        } else {
            const res = result.Call[0].Witnesses
                .filter(model => _.isEqual(model.Costs, result.Models.Costs))
                .map(witness => witness.Value);
            if (number !== 0) {
                while (res.length > number) {
                    res.shift()
                }
            }
            return res;
        }
    }

    static async cautious_consequences(program: string) {
        const result = await this.clingo.run(program, 0, [
            '--enum-mode=cautious'
        ]);
        if (result.Result === 'ERROR') {
            throw new Error(result.Error);
        } else if (result.Result === 'UNSATISFIABLE') {
            throw new Error('NO MODEL');
        } else {
            return result.Call[0].Witnesses[result.Call[0].Witnesses.length - 1].Value;
        }
    }

    static async brave_consequences(program: string) {
        const result = await this.clingo.run(program, 0, [
            '--enum-mode=brave'
        ]);
        if (result.Result === 'ERROR') {
            throw new Error(result.Error);
        } else if (result.Result === 'UNSATISFIABLE') {
            throw new Error('NO MODEL');
        } else {
            return result.Call[0].Witnesses[result.Call[0].Witnesses.length - 1].Value;
        }
    }

    static predicates(models: string[][]) {
        const res = new Set();
        models.forEach(model => {
            model.forEach(atom => {
                res.add(atom.predicate || 'CONSTANTS');
            });
        });
        return Array.from(res).sort();
    }

    static parse_atom(atom: string) {
        return PARSER.parse(atom);
    }

    static parse_atoms(atoms: string[]) {
        return atoms.map(atom => this.parse_atom(atom));
    }

    static async parse_answer_set(atoms: string) {
        return this.parse_atoms(await this.search_model(atoms));
    }
}

const GRAMMAR = `
$
= atom
/ '-' the_atom:atom { const res = { strongly_negated: true, ...the_atom }; res.str = '-' + res.str; return res; }
/ term

atom
= pred:string_id args:(space? "(" space? t:terms space? ")" space? { return t; })? { return { predicate : pred, terms : args !== null ? args : [], str : args !== null ? pred + '(' + args.map(term => term.str).join(',') + ')' : pred }; }

terms
= start_terms:(the_term:term space? "," space? { return the_term; })* last_term:term { start_terms.push(last_term); return start_terms; }

term
= functor:string_id args:(space? "(" space? t:terms space? ")" space? { return t; })? { return { functor : functor, terms : args !== null ? args : [], str : args !== null ? functor + '(' + args.map(term => term.str).join(',') + ')' : functor }; }
/ functor:string_id { return { functor : functor, str : functor }; }
/ the_string:quoted_string { return { string : the_string, str : the_string }; }
/ the_number:number { return { number : the_number, str : '' + the_number }; }

string_id
= prefix:[_]* head:[a-z] tail:[A-Za-z0-9_]* { return prefix.join("") + head + tail.join(""); }

quoted_string
= '"' str:('\\\\"' / [^"${consts.SYMBOLS.MODELS_SEPARATOR}])* '"' { return '"' + str.join("") + '"'; }

number
= str:[0-9]+ { return parseInt(str.join("")); }
/ '-' str:[0-9]+ { return -parseInt(str.join("")); }

space
= [ \\t\\n]+
`;
const PARSER = peg.generate(GRAMMAR);
