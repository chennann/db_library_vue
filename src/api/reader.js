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

export const readerLoginService = (loginData) => {
    const params = new URLSearchParams();
    for (let key in loginData) {
        params.append(key, loginData[key]);
    }

    return request.post('/reader/login', params);
}

export const readerInfoService = () => {
    return request.get('/reader/readerInfo');
}