import {Vue, Component} from 'vue-property-decorator';
import NoticeService from '@/api/service/NoticeService';
import Btn from '@/components/button/Btn.vue';
import WithRender from './NoticeBoard.html';

interface INotice {
    id: number;
    title: string;
    createdAt: Date;
    content: string;
}

@WithRender
@Component({
    components:{
        Btn
    },
})

export default class NoticeBoard extends Vue {
    private noticeList: INotice[] = [];

    public created() {
        this.getAllNotice();
    }

    /**
     * 공지사항 전체 가져오기
     * @private
     */
    private getAllNotice(): void {
        NoticeService.getAllNotice()
          .then((data) => {
              this.noticeList = data.notice_list;
              console.log(this.noticeList);
          });
    }

    /**
     * 약관 내용 토글
     * @param idx
     * @private
     */
    private accordionToggle(idx: number): void {
        const btn = document.querySelectorAll('.bt-cnt');
        btn[idx].classList.toggle('collapsed');
        const accordion = document.querySelectorAll('.collapse');
        accordion[idx].classList.toggle('show');
    }

}
