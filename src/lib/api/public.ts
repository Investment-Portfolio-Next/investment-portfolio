'use client'

import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { normalizeError } from '../errors/normalizeError'

const publicAxios: AxiosInstance = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// -------------------------------------------------
// request interceptors

publicAxios.interceptors.request.use(
    (request) => request,

    (requestError) => {
        return Promise.reject(normalizeError(requestError))
    },
)

// -------------------------------------------------
// response interceptors

publicAxios.interceptors.response.use(
    (response) => response,

    (responseError) => {
        return Promise.reject(normalizeError(responseError))
    },
)

export { publicAxios }
