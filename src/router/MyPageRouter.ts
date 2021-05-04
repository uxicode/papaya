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
                        component: () =>import('../views/mypage/myProfile/myProfileMain/MyProfileMain'), // MY프로필 (W7.1.1)
                    },
                    {
                        path: 'modifyMobile',
                        name: 'modifyMobile',
                        component: () =>import('../views/mypage/myProfile/modifyMobile/ModifyMobile'), // MY프로필-모바일 번호 설정 (W7.1.3.2)
                    },
                    {
                        path: 'modifyPw',
                        name: 'modifyPw',
                        component: () =>import('../views/mypage/myProfile/modifyPw/ModifyPassword'), // MY프로필-비밀번호 재설정 (W7.1.3.5)
                    }
                ]
            },
            { path: 'bookmark', name: 'bookmark', component: () =>import('../views/mypage/bookmark/Bookmark') }, // 보관함-알림-Default (W7.1.1.1)
            { path: 'noticeBoard', name: 'noticeBoard', component: () =>import('../views/mypage/noticeBoard/NoticeBoard') }, // 공지사항-상세 (W7.1.5)
            { path: 'customerCenter', name: 'customerCenter', component: () =>import('../views/mypage/customerCenter/CustomerCenter') }, // 고객센터-상세 (W7.1.6)
            { path: 'termsOfService', name: 'termsOfService', component: () =>import('../views/mypage/termsOfService/TermsOfService') }, // 이용약관-상세 (W7.1.7)
        ],
        beforeEnter: getIsAuth,
    },
];
export {MyPageRouter};
