import {Vue, Component} from 'vue-property-decorator';
import WithRender from './FileListView.html';
import SideMenu from '@/components/sideMenu/sideMenu.vue';

@WithRender
@Component({
    components:{
        SideMenu
    }
})
export default class FileBox extends Vue {

}
