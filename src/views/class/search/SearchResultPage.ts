import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {ISearchModel} from '@/views/model/search.model';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import RadioButton from '@/components/radio/RadioButton.vue';
import WithRender from './SearchResultPage.html';

const SearchStatus = namespace('SearchStatus');


@WithRender
@Component({
  components:{
    RadioButton
  }
})
export default class SearchResultPage extends Vue {

  // public isLoading: boolean= false;
  private searchResults: any[]=[];
  private radioItems: any[] = [
    { idx:0, name:'전체', value:'all'},
    { idx:1, name:'소속기관', value:'union'},
    { idx:2, name:'클래스', value:'class'},
    { idx:3, name:'태그', value:'tag'}
  ];
  private radioValue: string = '';

  @SearchStatus.Getter
  private keyword!: string;

  @SearchStatus.Getter
  private searchTotal!: number;

  @SearchStatus.Getter
  private searchResultData!: ISearchModel[];

  get searchResultsModel(): any[]{
    if( this.radioValue ==='union'){
      this.searchResults=[...this.searchResultData.filter( (item: any )=> item.g_name.match( this.keyword )!==null ) ];
    }else if( this.radioValue ==='class'){
      this.searchResults=[...this.searchResultData.filter( (item: any )=> item.name.match( this.keyword )!==null) ];
    }else if( this.radioValue==='tag'){
      this.searchResults=[...this.searchResultData.filter( (item: any )=> {
        return ( item.class_tags!==undefined) && ( item.class_tags.filter((target: any) =>target.keyword.match(this.keyword) !== null) );
      }) ];
    }else{
      this.searchResults = [...this.searchResultData];
    }
    return this.searchResults;
  }

  private getProfileImg(imgUrl: string | null | undefined ): string{
    return ImageSettingService.getProfileImg( imgUrl );
  }

  private getHashTag( items: string[] ): string | undefined {
    if( !items ){ return; }
    // console.log(' items=',  items)
    // if( items.length === 0 ){ return; }
    const keywords= items.map( ( prop: any ) => '#' + prop.keyword) ;
    return keywords.join(' ');
  }

  private gotoLink(item: any): void {
    this.$router.push( {path:'/class/enrollClass'} ).then(() => {
      console.log(item.class.g_name, '으로 이동');
    });
  }


  // 트랜지션을 시작할 때 인덱스 * 100 ms 만큼의 딜레이를 적용합니다.
  private beforeEnter(el: HTMLElement): void {
    if(el.dataset.index !=='0'){
      // el.classList.add('skeleton-inner');
      // console.log(this.startNum, this.endNum);
      // this.isLoading=true;
      el.style.transitionDelay = this.delayTime(120, String( el.dataset.index ), this.searchResults.length);
    }
  }

  private afterEnter(el: HTMLElement): void {

    // this.isLoading=false;
    el.style.transitionDelay = '';
  }

  private delayTime(speed: number, idx: string | number, len: number): string {
    const delay = (typeof idx === 'string') ? parseInt(idx as string, 10) : idx;
    return speed * (delay % len) + 'ms';
  }

  private optionChange( value: string, checked: boolean ): void{
    console.log(value, checked);
    this.radioValue=value;
  }



}
