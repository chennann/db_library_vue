import request from '@/utils/request.js'

export const readerListService = (params) => {
    return request.get('/reader/list', {params:params});
}

export const readerAddService = (readerData) => {
    return request.post('/reader/add', readerData);
}