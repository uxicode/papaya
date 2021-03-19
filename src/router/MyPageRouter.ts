import AppHeader from '@/components/header/header.vue';
import AppFooter from '@/components/footer/footer.vue';
import {getIsAuth} from '@/router/AuthGuard';
import MyPage from '@/views/mypage/MyPage';

const MyPageRouter=[
    {
        path: '/',
        name: 'myPage',
        components: { default: MyPage, header: AppHeader, footer: AppFooter},
        children: [
            { path: 'myProfile', name: 'myProfile', component: () =>import('../views/mypage/myProfile/MyProfile') },
            { path: 'bookmark', name: 'bookmark', component: () =>import('../views/mypage/bookmark/Bookmark') },
        ],
        beforeEnter: getIsAuth,
    },
];
export {MyPageRouter};