import {Vue, Component, Prop} from 'vue-property-decorator';
import WithRender from './MyProfile.html';

@WithRender
@Component({
    components:{

    },
})
export default class MyProfile extends Vue {

}