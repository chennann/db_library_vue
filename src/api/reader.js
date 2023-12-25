import request from '@/utils/request.js'

export const readerListService = (params) => {
    return request.get('/reader/list', {params:params});
}

export const readerAddService = (readerData) => {
    return request.post('/reader/add', readerData);
}

export const readerDeleteService = (readerId) => {
    return request.delete('/reader/delete', {params:{readerId}});

}

export const readerUpdateService = (readerData) => {
    return request.put('/reader/update', readerData);
}