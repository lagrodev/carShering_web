import api from './api'

export const getProfile = () => {
    return api.get('/profile').then(response => response.data)
}

export const updateProfile = (data) => {
    return api.patch('/profile', data)
}

export const changePassword = (data) => {
    return api.patch('/profile/password', data)
}

export const getDocument = () => {
    return api.get('/profile/document').then(response => response.data)
}

export const createDocument = (data) => {
    return api.post('/profile/document', data).then(response => response.data)
}

export const updateDocument = (data) => {
    return api.patch('/profile/document', data).then(response => response.data)
}

export const getAuthInfo = () => {
    return api.get('/profile/me', { withCredentials: true }).then(res => res.data)
}