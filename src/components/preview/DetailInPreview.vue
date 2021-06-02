<template>
  <div class="fd-inner" v-if="items!==null">
    <p class="fd-inner-txt fc-red">{{ isVote(items[finishAt]) ? '투표 중' : '투표마감' }}
      <span class="vote-count"><span class="count-num">0</span>/233명 응답</span>
    </p>

    <div class="vote-area">
      <div class="vote-top">
        <p class="vote-tit">{{ items[title] }}</p>
        <ul class="vote-option clearfix">
          <li>{{ (items[choice]) ? '복수선택' : '단일선택' }}</li>
          <li>{{ (items[mode]) ? '익명투표' : '공개투표' }}</li>
          <li>{{ (items[finishAt]) ? items[finishAt] + ' 마감' : '종료일자없음' }}</li>
        </ul>
      </div>
      <div class="vote-checkbox" v-if="choicesList.length>0">
        <div class="vote-select" v-for="(item, index) in choicesList" :key="`choiceItem-${index}`">
          <!--<div class="btn-radio">
            <input type="radio" name="email" id="radio1">
            <label for="radio1">경주<br><span><em class="vote-current">0</em>명</span></label>
          </div>-->
          <radio-button :btn-id="`radio-${index}`"
                        radio-name="radio"
                        :btn-value="item.text"
                        :active-value="radioValue"
                        v-model="radioValue"
                        @click="optionFindChange">{{ item.text }}<br><span><em class="vote-current">0</em>명</span></radio-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop } from 'vue-property-decorator';
import RadioButton from '@/components/radio/RadioButton.vue';

@Component({
  components: {
    RadioButton
  }
})
export default class DetailInPreview extends Vue{

  @Prop(Object)
  private items!: any;
/*
  vote_choices: [
    {
       createdAt: "2021-05-30 17:50:55"
      id: 341
      image_url: null
      index: 3
      text: "fasdfsadfasdf"
      updatedAt: "2021-05-30 17:50:55"
      user_choices: []
       vote_id: 191
    }
  ]
  */
  @Prop(Array)
  private choicesList!: Array<{
    createdAt: string,
    id: number,
    image_url: string,
    index: number,
    text: string,
    updatedAt: string,
    user_choices: [],
    vote_id: number
  }>;

  @Prop(String)
  private finishAt!: string; //finishAt

  @Prop(String)
  private title!: string; //title

  @Prop(String)
  private choice!: string;  //multi_choice

  @Prop(String)
  private mode!: string;  //anonymous_mode

  private radioValue: string = '';

  public isVote(item: Date | null): boolean {
    if (item === null) {return true;}
    const finishTime = new Date(item).getTime();
    const currentTime = new Date().getTime();
    return (finishTime > currentTime);
  }

  public optionFindChange( value: string | number | boolean, checked: boolean ) {
    console.log(value, checked);
    // this.btnValue=value;
    // this.$emit('click', this.currentValue, this.checked );
  }


}
</script>

<style scoped>

</style>
