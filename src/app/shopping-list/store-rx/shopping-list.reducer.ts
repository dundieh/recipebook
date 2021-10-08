import { Ingredient } from "../../shared/ingredient.model";
import * as SLA from "./shopping-list.actions";

export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initState: State = {
    ingredients: [new Ingredient('Apples', 5), new Ingredient('Oranges', 10)],
    editedIngredient: null,
    editedIngredientIndex: -1
};

export function shoppingListReducer(state: State = initState, action: SLA.ShoppingListActions) {
    switch(action.type) {
        case SLA.ADD_INGREDIENT: return {
            ...state,
            ingredients: [...state.ingredients, action.payload]
        };

        case SLA.ADD_INGREDIENTS: return {
            ...state,
            ingredients: [...state.ingredients, ...action.payload]
        };

        case SLA.UPDATE_INGREDIENT: 
            const ingredient = state.ingredients[state.editedIngredientIndex];
            const updateIngredient = {...ingredient, ...action.payload};
            const afterUpdatedIngredients = [...state.ingredients];
            afterUpdatedIngredients[state.editedIngredientIndex] = updateIngredient;
            return {
                ...state,
                ingredients: afterUpdatedIngredients,
                editedIngredientIndex: -1,
                editedIngredient: null
            };

        case SLA.DELETE_INGREDIENT: return {
            ...state,
            ingredients: state.ingredients.filter((ig, igIndex) => {
                return igIndex !== state.editedIngredientIndex;
            }),
            editedIngredientIndex: -1,
            editedIngredient: null
        };

        case SLA.START_EDIT: return {
            ...state,
            editedIngredientIndex: action.payload,
            editedIngredient: { ...state.ingredients[action.payload] }
        };

        case SLA.STOP_EDIT: return {
            ...state,
            editedIngredient: null,
            editedIngredientIndex: -1,
        };

        default: return state;
    }
}