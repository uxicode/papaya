import {IClassMemberInfo} from '@/views/model/my-class.model';
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import WithRender from './ClassMember.html';
import Modal from '@/components/modal/modal.vue';

const MyClass = namespace('MyClass');

@WithRender
@Component({
    components:{
        Modal,
    }
})
export default class ClassMember extends Vue{
    @MyClass.Getter
    private classID!: number;

    private isDetailPopup: boolean = false;

}