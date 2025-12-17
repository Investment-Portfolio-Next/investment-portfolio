'use client'

import axios from 'axios'
import type { AxiosInstance } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

const client: AxiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// -------------------------------------------------
// request interceptors

client.interceptors.request.use(
    (request) => request,

    (requestError) => {
        return Promise.reject(requestError)
    },
)

// -------------------------------------------------
// response interceptors

client.interceptors.response.use(
    (response) => response,

    (responseError) => {
        return Promise.reject(responseError)
    },
)

export { client }
