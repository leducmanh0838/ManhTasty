import axios from "axios"
import { BASE_URL } from "./Values"
import { getAccessToken } from "../utils/Auth"

export const endpoints = {
    auth: {
        login: {
            google: 'login/google/',
            facebook: 'login/facebook/',
        },
        token: 'o/token/',
    },
    home: {
        recipesList: 'recipes/',
    },
    recipes: {
        list: 'recipes/',
        detail: (recipeId) => `recipes/${recipeId}/`,
        search: 'recipes/search/',
        draft: {
            list: 'recipes-draft/',
            detail: (draftId) => `recipes-draft/${draftId}/`,
            lastest: 'recipes-draft/lastest/',
            submit: (draftId) => `recipes-draft/${draftId}/submit/`,
        },
        steps: (recipeId) => `recipes/${recipeId}/steps/`,
        medias: (recipeId) => `recipes/${recipeId}/medias/`,
        submit: (recipeId) => `recipes/${recipeId}/submit/`,
        comments: (recipeId) => `recipes/${recipeId}/comments/`,
        reactions: {
            emotionCounts: (recipeId) => `recipes/${recipeId}/emotion-counts/`,
            currentEmotion: (recipeId) => `recipes/${recipeId}/current-emotion/`,
        },
    },
    reactions: {
        list: 'reactions/',
        detail: (reactionId) => `reactions/${reactionId}/`,
    },
    comments: {
        replies: (commentId) => `comments/${commentId}/replies/`,
    },
    tags: {
        list: 'tags/',
        byCategory: (tagCategoryId) => `tags/?tag_category=${tagCategoryId}`,
    },
    ingredients: {
        list: 'ingredients/',
    },
    reports: {
        list: 'reports/',
    },
    imageUpload:{
        list: 'image-upload/',
    },
    currentUser:{
        recentKeywords:'current-user/search/recent-keywords/',
        recipes:'current-user/recipes/',
    },
    user:{
        recipes: (userId) => `users/${userId}/recipes/`,
        detail: (userId) => `users/${userId}/`,
    },
    search:{
        popularKeywords: 'search/popular-keywords/'
    }
};

export const authApis = async () => {
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