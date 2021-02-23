import {Vue, Component, Prop } from 'vue-property-decorator';
import AppHeader from '@/components/header/header.vue';
import AppFooter from '@/components/footer/footer.vue';
import WithRender from './App.html';

@WithRender
@Component({
    components: {
        AppHeader,
        AppFooter,
    },
})
export  default class App extends Vue {
    public updated(){
        // console.log('현재페이지 상태', this.pageHistory );
    }
}

