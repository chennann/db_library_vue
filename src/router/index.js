import {createRouter, createWebHistory} from 'vue-router'

import LoginVue from '@/views/Login03.vue';
import LayoutVue from '@/views/Layout.vue';
// import ArticleManageVue from '@/views/article/ArticleManage.vue';
// import UserAvatarVue from '@/views/user/UserAvatar.vue';
// import UserResetPasswordVue from '@/views/user/UserResetPassword.vue';

import ReaderManageVue from '@/views/librarianViews/ReaderManage.vue';
import BorrowVue from '@/views/librarianViews/Borrow.vue';
import BookVue from '@/views/librarianViews/Books.vue';
import ReservationVue from '@/views/librarianViews/Reservation.vue';
import ReturnVue from '@/views/librarianViews/Return.vue';
import LibrarianVue from '@/views/librarianViews/Librarian.vue';

import LayoutVue02 from '@/views/Layout02.vue';
import ReaderBorrowVue from '@/views/readerViews/ReaderBorrow.vue';
import ReaderBookVue from '@/views/readerViews/ReaderBooks.vue';
import ReaderReservationVue from '@/views/readerViews/ReaderReservation.vue';
import ReaderInfoVue from '@/views/readerViews/ReaderInfo.vue';

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
    },
    {
        path:'/page_reader', 
        component:LayoutVue02,
        redirect: '/reader_book',
        children: [
            {path: '/reader_book', component: ReaderBookVue},
            {path: '/reader_borrows', component: ReaderBorrowVue},
            {path: '/reader_reservation', component: ReaderReservationVue},
            {path: '/reader_info', component: ReaderInfoVue}
        ]
    }

]


const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router