import {Component, Vue, Prop} from 'vue-property-decorator';
import {ClassEachInfo, IMyClassList} from '@/views/model/my-class.model';
import Btn from '@/components/button/Btn.vue';
import {Utils} from '@/utils/utils';
import {CLASS_BASE_URL} from '@/api/base';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';
import WithRender from './MyClassListView.html';

@WithRender
@Component({
  components:{
    Btn
  }
})
export default class MyClassListView extends Vue{
  public isLoading: boolean= false;

  @Prop(Number)
  private startNum!: number;

  @Prop(Number)
  private endNum!: number;

  @Prop(Number)
  private listLoadNum!: number;

  @Prop([String, Number])
  private listTotal: string | number | undefined;

  @Prop(Array)
  private classListData: IMyClassList[] | undefined;

  @Prop(Array)
  private moreInfo!: ClassEachInfo[];

  // private bookmarkItems: any[]=[];

  get loadingChk(): boolean{
    return this.isLoading;
  }

  get classItems(): IMyClassList[] | undefined {
    return this.classListData;
  }

  get classMoreInfo(): ClassEachInfo[]{
    return this.moreInfo;
  }


  public getYears( dateTxt: string ): string{
    return ( String(dateTxt).split('-') )[0];
  }

  public nullCheck(value: string ): string{
    return (value===null)? '' : value;
  }


  // 트랜지션을 시작할 때 인덱스 * 100 ms 만큼의 딜레이를 적용합니다.
  public beforeEnter(el: HTMLElement): void {
    // console.log( el.dataset.index )
    if(el.dataset.index !=='0'){
      // el.classList.add('skeleton-inner');
      // console.log(this.startNum, this.endNum);
      this.isLoading=true;
      const delayTime = parseInt(el.dataset.index as string, 10);
      el.style.transitionDelay =200*(delayTime%this.listLoadNum) + 'ms';
    }
  }

  // 트랜지션을 완료하거나 취소할 때는 딜레이를 제거합니다.
  public afterEnter(el: HTMLElement): void {
    this.isLoading=false;
    el.style.transitionDelay = '';
    el.classList.remove('skeleton-inner');
  }

  private updatedDiffDate( dateValue: Date ): string{
    // const resultDate=Utils.calcDate(dateValue);
    // console.log( resultDate[0], resultDate[1], resultDate[1]);
    return Utils.updatedDiffDate(dateValue);
  }

  private isPostUpdate( dateValue: Date ) {
    const resultDate=Utils.calcDate(dateValue);
    return ( resultDate[0] <=7 );
  }

  /**
   * 북마크 클릭
   * @param item
   * @private
   */
  private bookmarkToggle(item: IMyClassList ): void{
    //화면에 바인딩되는 데이터를 직접 접근해서 변경하게 되면 Vue는 변화를 감지하여 re-rendering을 하게 된다. 즉 전체 렌더링을 다시하게 된다.
    item.me.is_bookmarked =( item.me.is_bookmarked === 0)? 1 : 0;

    this.$emit('updateBookmark', {
      classId: item.me.class_id,
      memberId: item.me.id,
      nickname: item.me.nickname,
      is_bookmarked: item.me.is_bookmarked
    } );

  }


  private getClassName(idx: number ): string{
    if(this.classMoreInfo[idx - 1]===undefined){
      return '';
    }else{
      return this.classMoreInfo[idx - 1].g_name;
    }
  }

  /**
   * 공개 / 비공개 처리
   * @param idx
   * @private
   */
  private getClassPrivate(idx: number ): string{
    if(this.classMoreInfo[idx - 1]===undefined){
      return '';
    }else{
      return (this.classMoreInfo[idx - 1].is_private) ? '공개' : '비공개';
    }
  }

  /**
   *  멤버 수 처리
   * @param idx
   * @private
   */
  private getMemberCount(idx: number ): string | number{
    if(this.classMoreInfo[idx - 1]===undefined){
      return '';
    }else{
      return this.classMoreInfo[idx - 1].member_count;
    }
  }

  /**
   * 더보기 클릭
   * @private
   */
  private moreInfoClick(): void {
    this.$emit('moreClick');
  }

  /**
   * 클래스 만들기 페이지로 이동
   * @private
   */
  private gotoCreateClassPage(): void{
    this.$router.push('/make-class/step1').then(()=>{
      // console.log('step1');
    });
  }

  private gotoClassClickHandler( id: string | number): void{
    this.$emit('listClick', id);
  }

  private getProfileImg( idx: number ): string{
    // console.log('this.classMoreInfo[idx - 1].image_url=', this.classMoreInfo[idx - 1].image_url);
    return (this.classMoreInfo[idx - 1]===undefined) ? '' : ImageSettingService.getProfileImg( this.classMoreInfo[idx - 1].image_url );
  }

}
