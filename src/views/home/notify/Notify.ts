import {Vue, Component, Prop} from 'vue-property-decorator';
import WithRender from './Notify.html';

@WithRender
@Component
export default class Notify extends Vue {
    private isActive: boolean = false;

    /**
     * 화살표 버튼 클릭시 약관 내용 토글
     * @public
     */
    public accordionToggle(): void {
        this.isActive = !this.isActive;
    }
}