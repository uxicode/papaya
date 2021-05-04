import {Vue, Component} from 'vue-property-decorator';
import WithRender from './SearchPage.html';
import MyClassService from '@/api/service/MyClassService';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';

@WithRender
@Component
export default class SearchPage extends Vue {

  public isLoading: boolean= false;
  private recommandItems: any[] = [];
  private bestItems: any[] = [];

  get bestItemsModel() {
    return this.bestItems;
  }

  get recommandItemsModel() {
    return this.recommandItems;
  }

  public created() {
    this.getSearchHome();
  }

  private getSearchHome() {
    MyClassService.getSearchHome()
      .then( (data)=>{
        // console.log(data);
        this.bestItems=data.best_classlist;
        this.recommandItems=data.recommended_keywords;

        console.log(this.bestItems );
      });
  }

  private getProfileImg(imgUrl: string | null | undefined ): string{
    return ImageSettingService.getProfileImg( imgUrl );
  }

  private getHashTag( items: string[] ): string | undefined {
    if( !items ){ return; }
    // console.log(' items=',  items)
    if( items.length === 0 ){ return; }
    const keywords= items.map( ( prop: any ) => '#' + prop.keyword) ;
    return keywords.join(' ');
  }

  private gotoLink(item: any): void {
    this.$router.push('/class/enrollClass').then(() => {
      console.log(item.class.g_name, '으로 이동');
    });
  }

  // 트랜지션을 시작할 때 인덱스 * 100 ms 만큼의 딜레이를 적용합니다.
  private beforeEnter(el: HTMLElement): void {
    if(el.dataset.index !=='0'){
      // el.classList.add('skeleton-inner');
      // console.log(this.startNum, this.endNum);
      this.isLoading=true;
      const delayTime = parseInt(el.dataset.index as string, 10);
      el.style.transitionDelay =120*(delayTime%this.bestItems.length) + 'ms';
    }
  }

  // 트랜지션을 완료하거나 취소할 때는 딜레이를 제거합니다.
  private afterEnter(el: HTMLElement): void {
    this.isLoading=false;
    el.style.transitionDelay = '';
  }


}
