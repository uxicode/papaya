<template>
  <div class="fd-inner">
    <p class="fd-inner-txt fc-red">{{ isVote(items[finishAt]) ? '투표 중' : '투표마감' }}
      <span class="vote-count"><span class="count-num">0</span>/233명 응답</span>
    </p>

    <div class="vote-area">
      <div class="vote-top">
        <p class="vote-tit">{{ fileItems[title] }}</p>
        <ul class="vote-option clearfix">
          <li>{{ (items[choice]) ? '복수선택' : '단일선택' }}</li>
          <li>{{ (items[mode]) ? '익명투표' : '공개투표' }}</li>
          <li>{{ (items[finishAt]) ? fileItems[finishAt] + ' 마감' : '종료일자없음' }}</li>
        </ul>
      </div>
      <div class="vote-checkbox">
        <div class="vote-select">
          <div class="btn-radio">
            <input type="radio" name="email" id="radio1">
            <label for="radio1">경주<br><span><em class="vote-current">0</em>명</span></label>
          </div>
        </div>

        <div class="vote-select">
          <div class="btn-radio">
            <input type="radio" name="email" id="radio2">
            <label for="radio2">제주도<br><span><em class="vote-current">0</em>명</span></label>
          </div>
          <div class="vote-img">
            <img :src="require('@/assets/images/pic.png')" class="thumb" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Emit} from 'vue-property-decorator';

@Component
export default class DetailInPreview extends Vue{

  @Prop(Object)
  private items!: any;

  @Prop(String)
  private finishAt!: string; //finishAt

  @Prop(String)
  private title!: string; //title

  @Prop(String)
  private choice!: string;  //multi_choice

  @Prop(String)
  private mode!: string;  //anonymous_mode

  private getTitle() {
    return (!this.fileItems)? '' : `첨부 파일 ${this.fileItems.length}`;
  }

  private isVote(item: Date | null): boolean {
    if (item === null) {return true;}
    const finishTime = new Date(item).getTime();
    const currentTime = new Date().getTime();
    return (finishTime > currentTime);
  }


}
</script>

<style scoped>

</style>
