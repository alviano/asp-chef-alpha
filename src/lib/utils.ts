import {default as peg} from 'pegjs';
import {consts} from '$lib/consts';
import {DOMPurifyConfig, Utils as BaseUtils} from "dumbo-svelte";
import {get} from "svelte/store";
import {recipe} from "$lib/stores";

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

    static async search_model(program: string) {
        const result = await clingo.run(program);
        if (result.Result === 'ERROR') {
            throw new Error(result.Error);
        } else if (result.Models.Number === 0) {
            throw new Error('NO MODEL');
        } else {
            return result.Call[0].Witnesses[0].Value;
        }
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

    static async process_input(input: string) {
        const res = []
        for (const part of input.split('§')) {
            const atoms = await this.parse_answer_set(part);
            res.push(atoms);
        }
        return res;
    }

    static async apply_operation(input: string[][], operation: string, options: object) {
        if (operation === 'program') {
            return await this.apply_program_operation(input, options);
        }
        throw Error('Unknown operation: ' + operation);
    }

    private static async apply_program_operation(input: string[][], options: object) {
        const res = [];
        for (const part of input) {
            try {
                const model = await this.search_model(part.map(atom => atom.str + '.').join('\n') + options.rules);
                res.push(this.parse_atoms(model));
            } catch (error) { /* empty */ }
        }
        return res;
    }

    static swap_operations(index_1: number, index_2: number) {
        const the_recipe = get(recipe);
        const tmp = the_recipe[index_1];
        the_recipe[index_1] = the_recipe[index_2];
        the_recipe[index_2] = tmp;
        recipe.set(the_recipe);
    }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const clingo = window.clingo;

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
= head:[a-z] tail:[A-Za-z0-9_]* { return head + tail.join(""); }

quoted_string
= '"' str:('\\\\"' / [^"])* '"' { return '"' + str.join("") + '"'; }

number
= str:[0-9]+ { return parseInt(str.join("")); }
/ '-' str:[0-9]+ { return -parseInt(str.join("")); }

space
= [ \\t\\n]+
`;
const PARSER = peg.generate(GRAMMAR);
