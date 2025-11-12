/**
 * API helper for production.
 * Replace BASE_URL with your backend endpoint (Node/Express, Django, Firebase Functions, etc.)
 * Example endpoints expected:
 * - GET /api/children
 * - GET /api/sponsors
 * - POST /api/messages
 * - POST /api/auth/login
 */

import axios from 'axios'

const BASE_URL = process.env.VITE_API_BASE_URL || 'https://api.example.org' // <- replace this

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

export const fetchChildren = () => client.get('/api/children')
export const fetchSponsors = () => client.get('/api/sponsors')
export const postMessage = (payload) => client.post('/api/messages', payload)
export const login = (cred) => client.post('/api/auth/login', cred)

export default client
