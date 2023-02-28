import {get} from "svelte/store";
import {Utils} from "$lib/utils";
import {recipe} from "$lib/stores";

export class Recipe {
    private static operation_types = new Map();

    static register_operation_type(
        operation: string,
        apply: (input: string[][], options: object) => Promise<string[][]>
    ) {
        this.operation_types.set(operation, apply);
    }

    static async process(input: string): Promise<object[][]> {
        const the_recipe = get(recipe);
        try {
            let result = await this.process_input(input);
            for (const ingredient of the_recipe) {
                if (ingredient.options.apply) {
                    result = await Recipe.apply_operation_type(ingredient.operation, result, ingredient.options);
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

    static async apply_operation_type(operation: string, input: string[][], options: object) {
        if (!this.operation_types.has(operation)) {
            throw Error('Unknown operation: ' + operation);
        }
        return await this.operation_types.get(operation)(input, options);
    }


    static async add_operation(operation: string, options: object) {
        const the_recipe = get(recipe);
        the_recipe.push({
            operation,
            options,
        });
        recipe.set(the_recipe);
    }

    static edit_operation(index: number, options: object) {
        const the_recipe = get(recipe);
        the_recipe[index].options = options;
        recipe.set(the_recipe);
    }

    static async process_input(input: string) {
        const res = [];
        for (const part of input.split('§')) {
            const atoms = await Utils.parse_answer_set(part);
            res.push(atoms);
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

    static remove_operation(index: number) {
        const the_recipe = get(recipe);
        recipe.set(the_recipe.filter((value, the_index) => index !== the_index));
    }

    static toggle_stop_at_operation(index: number) {
        const the_recipe = get(recipe);
        the_recipe[index].options.stop = !the_recipe[index].options.stop;
        recipe.set(the_recipe);
    }

    static toggle_apply_operation(index: number) {
        const the_recipe = get(recipe);
        the_recipe[index].options.apply = !the_recipe[index].options.apply;
        recipe.set(the_recipe);
    }
}