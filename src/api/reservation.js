import request from '@/utils/request.js'

export const reservationListService = (params) => {
    return request.get('/reservation/list', {params:params});
}

export const reservationCancelService = (readerId, isbn, bookId) => {
    return request.delete('/reservation/cancel', {params:{readerId, isbn, bookId}});

}

export const reservationAddService = (params) => {
    return request.post('/reservation/add', params);
}