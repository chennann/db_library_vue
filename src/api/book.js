import request from '@/utils/request.js'

export const bookListService = (params) => {
    return request.get('/book/find', {params:params});
}

export const bookCopiesListService = (params) => {
    return request.get('/copies/findcopies', {params:params});
}

export const bookCopyAllocateService = (params) => {
    return request.put('/copies/allocate', params);
}

export const bookAddService = (params) => {
    return request.post('/book/add', params);
}