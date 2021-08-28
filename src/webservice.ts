const url: string = "http://68.183.187.190:8080"
import axios from "axios"

interface food {
    recipeId: string;
    title: string;
    imageUrl: string
}

interface recipe {
    title: string;
    ingredements: string[]
    steps: string[]
}

export const find = async (food: string): Promise<food[]> => {
    try {
        const request = await axios.get(`${url}/api/food?name=${food}&page=1`)
        let foods: food[] = request.data.data
        return foods
    } catch (error) {
        throw error
    }
}

export const getRecipe = async (recipeId: string): Promise<recipe> => {
    try {
        const request = await axios.get(`${url}/api/recipe?id=${recipeId}`)
        const recipe: recipe = request.data.data
        return recipe
    } catch (error) {
        throw error
    }
}