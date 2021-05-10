import {Vue, Component} from 'vue-property-decorator';
import FaqService from '@/api/service/FaqService';
import Btn from '@/components/button/Btn.vue';
import WithRender from './CustomerCenter.html';

interface IFaq {
    createdAt?: Date;
    updatedAt?: Date;
    id: number;
    category_name: string;
    question: string;
    answer: string;
}

@WithRender
@Component({
    components:{
        Btn
    },
})

export default class CustomerCenter extends Vue {
    private faqList: IFaq[] = [];

    public created() {
        this.getAllFaqs();
    }

    /**
     * 자주 묻는 질문 모두 가져오기
     * @private
     */
    private getAllFaqs(): void {
        FaqService.getAllFaqs()
          .then((data) => {
              this.faqList = data.faqs;
              //console.log(this.faqList);
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
