import {get} from "svelte/store";
import {Utils} from "$lib/utils";
import {recipe} from "$lib/stores";
import {consts} from "$lib/consts";

export class Recipe {
    private static operation_types = new Map();
    private static last_serialization = null;

    private static get recipe() {
        return get(recipe);
    }

    static async svelte_components(filter: string) {
        const res = [];
        for (const [key] of Array.from(this.operation_types).sort()) {
            if (String(key).match(new RegExp(filter, 'i'))) {
                const component = (await import(`./operations/${String(key).replace(/ /g, '')}.svelte`)).default;
                res.push(component);
            }
        }
        return res;
    }

    static register_operation_type(
        operation: string,
        apply: (input: string[][], options: object, index: number) => Promise<string[][]>
    ) {
        this.operation_types.set(operation, apply);
    }

    static serialize(input: string) {
        const json = {
            input: input.split(consts.SYMBOLS.MODELS_SEPARATOR),
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
        const json = JSON.parse(Utils.uncompress(serialized_data.slice(0, -1)));
        recipe.set(json.recipe);
        return json.input.join(consts.SYMBOLS.MODELS_SEPARATOR);
    }

    static async process(input: string): Promise<object[][]> {
        try {
            let result = await this.process_input(input);
            for (const [index, ingredient] of this.recipe.entries()) {
                if (ingredient.options.apply) {
                    result = await Recipe.apply_operation_type(index, ingredient.operation, result, ingredient.options);
                }
                if (ingredient.options.stop) {
                    break;
                }
            }
            return result;
        } catch (error) {
            return [[{str: error}]];
        }
    }

    static async apply_operation_type(index: number, operation: string, input: string[][], options: object) {
        if (!this.operation_types.has(operation)) {
            throw Error('Unknown operation: ' + operation);
        }
        return await this.operation_types.get(operation)(input, options, index);
    }


    static async add_operation(operation: string, options: object) {
        const the_recipe = this.recipe;
        the_recipe.push({
            operation,
            options,
        });
        recipe.set(the_recipe);
    }

    static edit_operation(index: number, options: object) {
        const the_recipe = this.recipe;
        the_recipe[index].options = options;
        recipe.set(the_recipe);
    }

    static async process_input(input: string) {
        const res = [];
        for (const part of input.split(consts.SYMBOLS.MODELS_SEPARATOR)) {
            const atoms = await Utils.parse_answer_set(part);
            res.push(atoms);
        }
        return res;
    }

    static swap_operations(index_1: number, index_2: number) {
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
        recipe.set([]);
    }

    static remove_operation(index: number) {
        recipe.set(this.recipe.filter((value, the_index) => index !== the_index));
    }

    static duplicate_operation(index: number) {
        const the_recipe = this.recipe;
        the_recipe.splice(index, 0, JSON.parse(JSON.stringify(the_recipe[index])));
        recipe.set(the_recipe);
    }

    static toggle_stop_at_operation(index: number) {
        const the_recipe = this.recipe;
        the_recipe[index].options.stop = !the_recipe[index].options.stop;
        recipe.set(the_recipe);
    }

    static toggle_apply_operation(index: number) {
        const the_recipe = this.recipe;
        the_recipe[index].options.apply = !the_recipe[index].options.apply;
        recipe.set(the_recipe);
    }
}