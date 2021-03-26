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
            {
                path: 'myProfile',
                name: 'myProfile',
                component: () =>import('../views/mypage/myProfile/MyProfile'),
                children: [
                    {
                        path: '/',
                        name: 'myProfileMain',
                        component: () =>import('../views/mypage/myProfile/myProfileMain/MyProfileMain'),
                    },
                    {
                        path: 'modifyMobile',
                        name: 'modifyMobile',
                        component: () =>import('../views/mypage/myProfile/modifyMobile/ModifyMobile'),
                    },
                    {
                        path: 'modifyPw',
                        name: 'modifyPw',
                        component: () =>import('../views/mypage/myProfile/modifyPw/ModifyPassword'),
                    }
                ]
            },
            { path: 'bookmark', name: 'bookmark', component: () =>import('../views/mypage/bookmark/Bookmark') },
        ],
        beforeEnter: getIsAuth,
    },
];
export {MyPageRouter};