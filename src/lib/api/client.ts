'use client'

import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { normalizeError } from '../errors/normalizeError'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

const clientAxios: AxiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// -------------------------------------------------
// request interceptors

clientAxios.interceptors.request.use(
    (request) => request,

    (requestError) => {
        return Promise.reject(normalizeError(requestError))
    },
)

// -------------------------------------------------
// response interceptors

clientAxios.interceptors.response.use(
    (response) => response,

    (responseError) => {
        return Promise.reject(normalizeError(responseError))
    },
)

export { clientAxios }
