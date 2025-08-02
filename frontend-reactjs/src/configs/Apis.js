import axios from "axios"
import cookie from 'react-cookies'
import { BASE_URL } from "./Values"
import { getAccessToken } from "../utils/Auth"


export const endpoints = {
    login: {
      google: 'login/google/',
      facebook: 'login/facebook/',
    },
    home:{
        recipes: 'recipes/'
    },
    recipes:{
        recipeDetail: (recipeId) => `recipes/${recipeId}/`,
        emotion: (recipeId) => `recipes/${recipeId}/emotion-counts/`,
    },
    token: 'o/token/',
    reactions:{
        reactions: 'reactions/'
    }
}

export const authApis = async() => {
    const accessToken = await getAccessToken()
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
})