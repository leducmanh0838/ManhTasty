import axios from "axios"
import cookie from 'react-cookies'
import { BASE_URL } from "./Values"


export const endpoints = {
    login: {
      google: 'login/google/',
      facebook: 'login/facebook/',
    },
}

export const authApis = () => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${cookie.load('token')}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
})