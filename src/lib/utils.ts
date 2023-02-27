import { default as peg } from 'pegjs';
import { consts } from '$lib/consts';
import { DOMPurifyConfig, Utils as BaseUtils } from "dumbo-svelte";

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
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const clingo = window.clingo;

const GRAMMAR = `
$
= atom
/ '-' the_atom:atom { return { strongly_negated: true, ...the_atom }; }
/ term

atom
= pred:string_id args:(space? "(" space? t:terms space? ")" space? { return t; })? { return { predicate : pred, terms : args != null ? args : [] }; }

terms
= start_terms:(the_term:term space? "," space? { return the_term; })* last_term:term { start_terms.push(last_term); return start_terms; }

term
= functor:string_id args:(space? "(" space? t:terms space? ")" space? { return t; })? { return { functor : functor, terms : args != null ? args : [] }; }
/ functor:string_id { return { functor : functor }; }
/ the_string:quoted_string { return { string : the_string }; }
/ the_number:number { return { number : the_number }; }

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
