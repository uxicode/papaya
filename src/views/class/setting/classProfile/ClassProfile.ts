import {Vue, Component, Prop} from 'vue-property-decorator';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './ClassProfile.html';

interface IProfileData {
    type: string;
    data: string;
}

@WithRender
@Component({
    components: {
        Modal,
        Btn
    }
})

export default class ClassProfile extends Vue {
    private isNicknameModify: boolean = false;

    private profileDataList: IProfileData[] = [
        {
            type: '아이디',
            data: 'papaya123'
        },
        {
            type: '모바일 번호',
            data: '010-1234-5678'
        },
        {
            type: '이메일 주소',
            data: 'papaya@gmail.com'
        }
    ];

    /**
     * 뒤로가기
     * @private
     */
    private goBack(): void {
        this.$router.push('./')
            .then();
    }
}