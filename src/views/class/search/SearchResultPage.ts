import {Vue, Component} from 'vue-property-decorator';
import WithRender from './SearchResultPage.html';
import MyClassService from '@/api/service/MyClassService';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';

@WithRender
@Component
export default class SearchResultPage extends Vue {

  public isLoading: boolean= false;
  private bestItems: any[] = [];
  private searchResults: any[]=[];

  get bestItemsModel() {
    return this.bestItems;
  }

  public created() {
    this.getSearchHome();
  }

  public mounted() {
    setTimeout(() => {
      const searchInput=document.querySelector('#searchInput') as HTMLInputElement;
      searchInput.focus();
    }, 1000);
  }

  private getSearchHome() {
    MyClassService.getSearchHome()
      .then( (data)=>{
        // console.log(data);
        this.bestItems=data.best_classlist;

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
      el.style.transitionDelay =this.delayTime(300, String( el.dataset.index ),10);
    }
  }


  private afterEnter(el: HTMLElement): void {
    this.isLoading=false;
    el.style.transitionDelay = '';
  }

  private delayTime(speed: number, idx: string | number, len: number): string {
    const delay = (typeof idx === 'string') ? parseInt(idx as string, 10) : idx;
    return speed * (delay % len) + 'ms';
  }


}
