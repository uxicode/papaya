import { Vue, Component, Prop } from 'vue-property-decorator';
import {mapGetters} from 'vuex';
import AppHeader from '@/components/header/header.vue';
import AppFooter from '@/components/footer/footer.vue';
import WithRender from './App.html';
import './App.scss';

@WithRender
@Component({
    computed:{
        ...mapGetters('PageHistoryStatus', ['pageHistory']),
    },
    components: {
        AppHeader,
        AppFooter
    },
})
export  default class App extends Vue {

    private updated(){
        // @ts-ignore
        console.log('현재페이지 상태', this.pageHistory );
    }

}

