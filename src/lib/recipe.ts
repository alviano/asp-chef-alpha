import {get} from "svelte/store";
import {Utils} from "$lib/utils";
import {recipe} from "$lib/stores";
import {consts} from "$lib/consts";
import {v4 as uuidv4} from 'uuid';

export class Recipe {
    private static operation_types = new Map();
    private static last_serialization = null;
    private static input_at_index = [];

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
        apply: (input: string[][], options: object, index: number, id: string) => Promise<string[][]>
    ) {
        this.operation_types.set(operation, apply);
    }

    static common_default_options() {
        return {
            stop: false,
            apply: true,
        };
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

    static get_input_at_index(index: number) {
        return this.input_at_index[index];
    }

    static async process(input: string): Promise<object[][]> {
        this.input_at_index.length = 0;
        let where = 'Input';
        try {
            let result = await this.process_input(input);
            for (const [index, ingredient] of this.recipe.entries()) {
                where = `#${index + 1}. ${ingredient.operation}`;
                this.input_at_index.push(result);
                if (ingredient.options.apply) {
                    result = await Recipe.apply_operation_type(index, ingredient, result);
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
            options,
        };
        const the_recipe = this.recipe;
        if (index === undefined) {
            the_recipe.push(ingredient);
        } else {
            the_recipe.splice(index, 0, ingredient);
        }
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
        const copy = JSON.parse(JSON.stringify(the_recipe[index]));
        copy.id = uuidv4();
        the_recipe.splice(index, 0, copy);
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