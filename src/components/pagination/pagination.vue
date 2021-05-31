<template>
  <div class="pagination">
    <a href="" @click.prevent="onPrevPageClick" class="arrow" :class="{'active':pageCount>1}">
      <img :src="require('@/assets/images/arrow-left.svg')" alt="">
    </a>
    <ul>
      <li class="num"
          v-for="(item, index) in pageItemsModel"
          :key="`paging-${item}`" :class="{'active':pageCount===item}">
        <a href="" @click.prevent="onPageNumClick( item )">{{ item }}</a>
      </li>
    </ul>
    <a href="" @click.prevent="onNextPageClick" class="arrow" :class="{'active':pageCount>0 && pageCount<totalPageCount}">
      <img :src="require('@/assets/images/arrow-right.svg')" alt="">
    </a>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

@Component
export default class Pagination extends Vue{

  @Prop(Number)
  private total!: number;

  @Prop(Number)
  private numOfPage!: number;

  @Prop(Number)
  private pageSize!: number;

  @Prop(String)
  private filterType!: string;

  private pageCount: number=1;
  private pageItems: number[] = [];
  // private numOfPage: number=10;
  // private pageSize: number=5;
  private totalPageCount: number=-1;

  //Prop 로 가져온 값을 변화할때마다 체크하여 함수 등을 실행 하고자 할때는 watch 를 써야 한다. //( 자주 사용되어선 안된다 )
  @Watch('total')
  public onChangeTotal(value: number, oldValue: number) {
    if (value !== oldValue) {
      this.createPaging();
    }
  }

  get pageItemsModel() {
    return this.pageItems;
  }

  get pageTotal() {
    return this.total;
  }

  public created() {
    this.createPaging();
  }

  private createPaging() {
    // console.log(this.total);
    this.pageCount=1;
    this.totalPageCount = this.getTotalPageCount({total: this.pageTotal, numOfPage: this.numOfPage});
    this.pageItems=[...this.getPageNum( {totalPageCount: this.totalPageCount, pageSize: this.pageSize, curPageNum:this.pageCount }) ];
    // console.log(this.pageItems);
  }

  /**
   * 총 페이지 카운트 구하기
   * @param paging
   * @private
   */
  private getTotalPageCount( paging: {total: number, numOfPage: number}): number {
    const { total, numOfPage } = paging;
    const reminderValue=( total%numOfPage === 0)? 0 : 1;
    return parseInt(`${total / numOfPage}`, 10)+reminderValue;
  }


  /**
   * 페이징 범위에 맞게 각 페이지 넘버 생성 배열 구하기
   * @param paging
   * @private
   */
  private getPageNum(  paging: { totalPageCount: number, pageSize: number, curPageNum: number} ): number[] {
    const { start, end }=this.getPageRange( paging );
    const pageNumItems: number[] = [];
    for (let i = start+1; i < end+1; i++) {
      pageNumItems.push(i);
    }
    return pageNumItems;
  }

  /**
   * 페이징 범위 구하기
   * @param paging
   * @private
   */
  private getPageRange( paging: { totalPageCount: number, pageSize: number, curPageNum: number} ): {start: number, end: number}{
    //total - 전체 개수
    //numOfPage - 페이지 당 개수
    //pageSize - 화면에 표시할 페이징 범위
    // curPageNum - 현재 페이지
    const { pageSize, curPageNum, totalPageCount} = paging;
    const reminderValChk = (curPageNum % pageSize === 0) ? -1 : 0;
    const curCountByPageSize: number = parseInt(`${curPageNum / pageSize}`, 10)+reminderValChk;

    const startPage=curCountByPageSize*pageSize;
    const endCalc= (curCountByPageSize + 1) * pageSize;
    const endPage = ( endCalc >= totalPageCount) ? totalPageCount : (curCountByPageSize + 1) * pageSize;
    // console.log('현재페이지 번호='+curPageNum, 'startPage=' + startPage, 'pageRange='+endPage, this.totalPageCount);
    return {
      start: startPage,
      end: endPage
    };
  }

  private onPageNumClick(num: number) {
    this.pageCount=num;
    this.pageItems=[...this.getPageNum( {totalPageCount: this.totalPageCount, pageSize: this.pageSize, curPageNum:this.pageCount }) ];
    this.$emit('pageChange', this.pageCount );
  }


  private onPrevPageClick() {
    if (this.pageCount <= 1) {
      this.pageCount=1;
    }else{
      this.pageCount--;
    }
    this.pageItems=[...this.getPageNum( {totalPageCount: this.totalPageCount, pageSize: this.pageSize, curPageNum:this.pageCount }) ];
    // console.log(this.pageCount);

    this.$emit('prev', this.pageCount );
  }
  private onNextPageClick() {
    this.pageCount++;
    if (this.pageCount > this.totalPageCount) {
      this.pageCount= this.totalPageCount;
    }
    this.pageItems=[...this.getPageNum( {totalPageCount: this.totalPageCount, pageSize: this.pageSize, curPageNum:this.pageCount }) ];

    this.$emit('next', this.pageCount );
  }

}
</script>

<style scoped>

</style>
