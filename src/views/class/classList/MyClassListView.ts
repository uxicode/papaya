import {Component, Vue, Prop} from 'vue-property-decorator';
import {IClassMember, IMyClassList} from '@/views/model/my-class.model';
import Btn from '@/components/button/Btn.vue';
import {Utils} from '@/utils/utils';
import {CLASS_BASE_URL} from '@/api/base';
import WithRender from './MyClassListView.html';
import ImageSettingService from '@/views/service/profileImg/ImageSettingService';

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
  private moreInfo!: IClassMember[];

  get loadingChk(): boolean{
    return this.isLoading;
  }

  get classItems(): IMyClassList[] | undefined {
    return this.classListData;
  }

  get classMoreInfo(): IClassMember[]{
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
    if(el.dataset.index !=='0'){
      // el.classList.add('skeleton-inner');
      console.log(this.startNum, this.endNum);
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

  public calcDate(dateValue: Date): number[] {
    const today = Date.now();
    const updateDate = new Date(dateValue);
    const updateDateTime=updateDate.getTime();
    const calcDate=today - updateDateTime;
    const msOfDay = 24*60*60*1000;
    const msOfHour = 60*60*1000;
    const msOfMin = 60*1000;
    // console.log(new Date(dateValue));
    //, new Date(dateValue), calcDate/ 1000 / 60 / 60 / 24/365

    const calcDay: number = Math.floor( calcDate / msOfDay );
    const calcHour: number =( calcDay>7 )? Math.floor( calcDate / msOfHour ) : Math.floor((calcDate%msOfDay) / msOfHour );
    const calcMin: number =( calcDay>7 )? Math.floor( calcDate / msOfMin ) : Math.floor((calcDate %msOfHour) /msOfMin );

    // const calcMonth = Math.floor( calcDate / (msOfDay * 30) );
    // const calcYear = Math.floor( calcDate / (msOfDay * 30 * 12));
    // calcYear=(calcYear>0)? new Date(dateValue).getFullYear() : 0;
    // calcMonth=(calcMonth>12)? calcMonth-12 : calcMonth;
    // console.log(today, '일수 차이=', calcDay );
    return [ calcDay,  calcHour, calcMin ];
  }
  private updatedDiffDate( dateValue: Date ): string{
    const resultDate=this.calcDate(dateValue);
    // console.log( resultDate[0], resultDate[1], resultDate[1]);
    return ( resultDate[0]>7 )? Utils.getTodayParseFormat( new Date(dateValue) ) : resultDate[1]+'시 '+resultDate[2]+'분 전';
  }

  private isPostUpdate( dateValue: Date ) {
    const resultDate=this.calcDate(dateValue);
    return ( resultDate[0] <=7 );
  }

  /**
   * 북마크 클릭
   * @param item
   * @private
   */
  private bookmarkToggle(item: IMyClassList ): void{
    item.me.is_bookmarked =( item.me.is_bookmarked === 0)? 1 : 0;

    this.$emit('updateBookmark', {
      classId: item.me.class_id,
      memberId: item.me.id,
      nickname: item.me.nickname,
      is_bookmarked: item.me.is_bookmarked
    } );

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
      console.log('step1');
    });
  }

  private gotoClassClickHandler( id: string | number): void{
    this.$emit('listClick', id);
  }

  private getProfileImg( idx: number ): string{
/*
    if(this.classMoreInfo[idx - 1]===undefined){
      return '';
    }else{
      return this.classMoreInfo[idx - 1].image_url;
    }*/

    return (this.classMoreInfo[idx - 1]===undefined) ? '' : ImageSettingService.getProfileImg( this.classMoreInfo[idx - 1].image_url );
  }

}
