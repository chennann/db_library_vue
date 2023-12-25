import request from '@/utils/request.js'

export const borrowListService = (params) => {
    return request.get('/reader/listborrows', {params:params});
}

export const borrowService = (params) => {
    return request.post('/borrow/record', params);
}

export const returnBookService = (params) => {
    return request.post('/borrow/returnCopy', params);
}