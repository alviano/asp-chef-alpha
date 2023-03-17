import {get} from "svelte/store";
import {Utils} from "$lib/utils";
import {errors_at_index, processing_index, recipe} from "$lib/stores";
import {consts} from "$lib/consts";
import {v4 as uuidv4} from 'uuid';
import {Base64} from "js-base64";

export class Recipe {
    private static operation_types = new Map();
    private static last_serialization = null;
    private static cached_output = [];
    private static aborted = false;

    private static get recipe() {
        return get(recipe);
    }

    private static get errors_at_index() {
        return get(errors_at_index);
    }

    static async svelte_components(filter: string) {
        const res = [];
        for (const key of Array.from(this.operation_types.keys()).sort()) {
            if (String(key).match(new RegExp(filter, 'i'))) {
                const component = (await import(`./operations/${String(key).replace(/ /g, '')}.svelte`)).default;
                res.push(component);
            }
        }
        return res;
    }

    static register_operation_type(
        operation: string,
        apply: (input: string[][], options: object, index: number, id: string) => Promise<string[][]>
    ) {
        this.operation_types.set(operation, apply);
    }

    static common_default_options() {
        return {
            stop: false,
            apply: true,
            show: true,
        };
    }

    static serialize(input: string, encode_input: boolean, decode_output: boolean) {
        const json = {
            input: encode_input ? input : input.split(consts.SYMBOLS.MODELS_SEPARATOR),
            encode_input: encode_input,
            decode_output: decode_output,
            recipe: this.recipe,
        };
        this.last_serialization = Utils.compress(json) + '!';
        return this.last_serialization;
    }

    static deserialize(serialized_data: string) {
        if (serialized_data === this.last_serialization) {
            return null;
        }
        if (!serialized_data.endsWith('!')) {
            throw Error('Cannot deserialize. Incomplete string. Must terminate with a bang!');
        }
        this.last_serialization = serialized_data;
        const json = Utils.uncompress(serialized_data.slice(0, -1));
        recipe.set(json.recipe);
        if (!json.encode_input) {
            json.input = json.input.join(consts.SYMBOLS.MODELS_SEPARATOR);
        }
        return {
            input: json.input,
            encode_input: json.encode_input,
            decode_output: json.decode_output,
        };
    }

    static serialize_ingredients(start: number, how_many = 0) {
        const json = {
            recipe: this.recipe.slice(start, how_many === 0 ? undefined : start + how_many),
        };
        return Utils.compress(json) + '!';
    }

    static extract_recipe_from_serialization(serialized_data: string) {
        if (!serialized_data.endsWith('!')) {
            throw Error('Cannot deserialize. Incomplete string. Must terminate with a bang!');
        }
        const json = Utils.uncompress(serialized_data.slice(0, -1));
        return json.recipe;
    }

    static get number_of_operations() {
        return this.operation_types.size;
    }

    static get number_of_ingredients() {
        return this.recipe.length;
    }

    static set_errors_at_index(index: number, errors: string, result: object[] = null) {
        const the_errors = this.errors_at_index;
        while (the_errors.length < index) {
            the_errors.push('');
        }
        the_errors[index] = errors;
        errors_at_index.set(the_errors);
        if (result !== null) {
            result.push([{str: errors}])
        }
    }

    static async abort() {
        this.aborted = true;
        await Utils.clingo_reject();
    }

    static invalidate_cached_output(index: number) {
        while (index < this.cached_output.length) {
            this.cached_output[index++] = undefined;
        }
    }

    static async process(input: string, encode_input: boolean): Promise<object[][]> {
        this.aborted = false;
        Utils.reset_clingo_options();
        let where = 'Input';
        processing_index.set(0);
        try {
            let result = await this.process_input(input, encode_input);
            for (const [index, ingredient] of this.recipe.entries()) {
                if (this.aborted) {
                    break;
                }
                where = `#${index + 1}. ${ingredient.operation}`;
                processing_index.set(index);
                if (this.cached_output[index] !== undefined) {
                    result = this.cached_output[index];
                } else {
                    this.cached_output[index + 1] = undefined;
                    this.set_errors_at_index(index, '');
                    this.cached_output[index] = result = ingredient.options.apply ?
                        await Recipe.apply_operation_type(index, ingredient, result) : result;
                }
                if (ingredient.options.stop) {
                    break;
                }
            }
            return result;
        } catch (error) {
            return [[
                { str: `Unrecoverable Error in ${where}` },
                { str: error },
            ]];
        } finally {
            processing_index.set(this.recipe.length);
        }
    }

    static async apply_operation_type(index: number, ingredient: object, input: string[][]) {
        if (!this.operation_types.has(ingredient.operation)) {
            throw Error('Unknown operation: ' + ingredient.operation);
        }
        return await this.operation_types.get(ingredient.operation)(input, ingredient.options, index, ingredient.id);
    }


    static async add_operation(operation: string, options: object, index: number = undefined) {
        const ingredient = {
            id: uuidv4(),
            operation,
            options: JSON.parse(JSON.stringify(options)),
        };
        const the_recipe = this.recipe;
        this.invalidate_cached_output(index || the_recipe.length);
        if (index === undefined) {
            the_recipe.push(ingredient);
        } else {
            the_recipe.splice(index, 0, ingredient);
        }
        recipe.set(the_recipe);
    }

    static edit_operation(index: number, options: object) {
        this.invalidate_cached_output(index);
        const the_recipe = this.recipe;
        the_recipe[index].options = options;
        recipe.set(the_recipe);
    }

    static async process_input(input: string, encode: boolean) {
        if (encode) {
            return [[await Utils.parse_atom(`__base64__("${Base64.encode(input)}")`)]];
        }
        const res = [];
        for (const part of input.split(consts.SYMBOLS.MODELS_SEPARATOR)) {
            const atoms = await Utils.parse_answer_set(part);
            res.push(atoms);
        }
        return res;
    }

    static swap_operations(index_1: number, index_2: number) {
        this.invalidate_cached_output(Math.min(index_1, index_2));
        const the_recipe = this.recipe;
        const tmp = the_recipe[index_1];
        the_recipe[index_1] = the_recipe[index_2];
        the_recipe[index_2] = tmp;
        recipe.set(the_recipe);
    }

    static as_url() {
        const res = new URL(location.toString());
        res.hash = this.last_serialization;
        return res.toString();
    }

    static remove_all_operations() {
        this.invalidate_cached_output(0);
        recipe.set([]);
    }

    static remove_operation(index: number) {
        this.invalidate_cached_output(index);
        recipe.set(this.recipe.filter((value, the_index) => index !== the_index));
    }

    static remove_operations(index: number, how_many = 0) {
        this.invalidate_cached_output(index);
        recipe.set(this.recipe.filter((value, ingredient_index) => ingredient_index < index  || (how_many !== 0 && ingredient_index >= index + how_many)));
    }

    static duplicate_operation(index: number) {
        this.invalidate_cached_output(index + 1);
        const the_recipe = this.recipe;
        const copy = JSON.parse(JSON.stringify(the_recipe[index]));
        copy.id = uuidv4();
        the_recipe.splice(index, 0, copy);
        recipe.set(the_recipe);
    }

    static toggle_stop_at_operation(index: number) {
        this.invalidate_cached_output(index);
        const the_recipe = this.recipe;
        the_recipe[index].options.stop = !the_recipe[index].options.stop;
        recipe.set(the_recipe);
    }

    static toggle_apply_operation(index: number) {
        this.invalidate_cached_output(index);
        const the_recipe = this.recipe;
        the_recipe[index].options.apply = !the_recipe[index].options.apply;
        recipe.set(the_recipe);
    }

    static toggle_show_operation(index: number) {
        const the_recipe = this.recipe;
        the_recipe[index].options.show = !the_recipe[index].options.show;
        recipe.set(the_recipe);
    }
}