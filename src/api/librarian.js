import request from '@/utils/request.js'

export const librarianAddService = (registerData) => {

    return request.post('/librarian/add', registerData);
}

export const librarianLoginService = (loginData) => {
    const params = new URLSearchParams();
    for (let key in loginData) {
        params.append(key, loginData[key]);
    }

    return request.post('/librarian/login', params);
}

export const librarianInfoService = () => {
    return request.get('/librarian/librarianInfo');
}

export const userInfoUpdateService = (userInfoData) => {
    return request.put('/user/update', userInfoData);
}

export const userAvatarUpdateService = (avatarUrl) => {
    const params = new URLSearchParams();
    params.append('avatarUrl', avatarUrl);
    return request.patch('user/updateAvatar', params);
}