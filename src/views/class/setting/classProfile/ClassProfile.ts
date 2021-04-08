import {Vue, Component, Prop} from 'vue-property-decorator';
import Modal from '@/components/modal/modal.vue';
import Btn from '@/components/button/Btn.vue';
import WithRender from './ClassProfile.html';

interface IProfileData {
    type: string;
    data: string;
    isActive: boolean;
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
            data: 'papaya123',
            isActive: false
        },
        {
            type: '모바일 번호',
            data: '010-1234-5678',
            isActive: false
        },
        {
            type: '이메일 주소',
            data: 'papaya@gmail.com',
            isActive: false
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