import axios from "axios"
import cookie from 'react-cookies'
import { BASE_URL } from "./Values"
import { getAccessToken } from "../utils/Auth"
import { TagCategory } from "./Types"


export const endpoints = {
    login: {
      google: 'login/google/',
      facebook: 'login/facebook/',
    },
    home:{
        recipes: 'recipes/'
    },
    recipes:{
        recipes:'recipes/',
        recipeDetail: (recipeId) => `recipes/${recipeId}/`,
        reactions:{
            emotionCounts: (recipeId) => `recipes/${recipeId}/emotion-counts/`,
            currentEmotion: (recipeId) => `recipes/${recipeId}/current-emotion/`,
        },
        steps: (recipeId) => `recipes/${recipeId}/steps/`,
        medias: (recipeId) => `recipes/${recipeId}/medias/`,
        submit: (recipeId) => `recipes/${recipeId}/submit/`,
        comments: (recipeId) => `recipes/${recipeId}/comments/`,
        search: `recipes/search/`,
    },
    token: 'o/token/',
    reactions:{
        reactions: 'reactions/',
        reactionDetail: (reactionId) => `reactions/${reactionId}/`,
    },
    comments:{
        replies: (commentId) => `comments/${commentId}/replies/`,
    },
    tags:{
        selectByTagCategory: (TagCategoryId) =>`tags/?tag_category=${TagCategoryId}`
    },
    reports:{
        reports: 'reports/'
    },
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