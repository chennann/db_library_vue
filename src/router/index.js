import {createRouter, createWebHistory} from 'vue-router'

import LoginVue from '@/views/Login03.vue';
import LayoutVue from '@/views/Layout.vue';
// import ArticleManageVue from '@/views/article/ArticleManage.vue';
// import UserAvatarVue from '@/views/user/UserAvatar.vue';
// import UserResetPasswordVue from '@/views/user/UserResetPassword.vue';

import ReaderManageVue from '@/views/ReaderManage.vue';
import BorrowVue from '@/views/Borrow.vue';
import BookVue from '@/views/Books.vue';
import ReservationVue from '@/views/Reservation.vue';
import ReturnVue from '@/views/Return.vue';
import LibrarianVue from '@/views/Librarian.vue';

const routes = [

    {path:'/login', component:LoginVue},
    {
        path:'/', 
        component:LayoutVue,
        redirect: '/book',
        children: [
            {path: '/book', component: BookVue},
            {path: '/borrow', component: BorrowVue},
            {path: '/return', component: ReturnVue},
            {path: '/reservation', component: ReservationVue},
            {path: '/reader', component: ReaderManageVue},
            {path: '/librarian', component: LibrarianVue},
            {path: '/user/resetPassword', component: BorrowVue}
            
        ]
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router