import AppHeader from '@/components/header/header.vue';
import AppFooter from '@/components/footer/footer.vue';
import {getIsAuth} from '@/router/AuthGuard';

export const SearchRouter = [
  {
    path: '/class/search-result',
    name: 'SearchResultPage',
    beforeEnter: getIsAuth,
    components: {default: () => import('@/views/class/search/SearchResultPage'), header: AppHeader, footer: AppFooter}
  },
];
