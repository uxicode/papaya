<template>
  <!--
 <check-button :btn-id="체크박스 아이디"
                      :check-name="체크박스 네임"
                      :b-data="v-model 로 쓰여질 배열 데이터 혹은 boolean 값"
                      :btn-value="체크박스 value"
                      @click="클릭시 실행할 함수">라벨 텍스트</check-button>
  -->
  <div class="btn-checkbox">
    <input type="checkbox"
           :name="checkName"
           :id="btnId"
           :value="btnValue"
           :checked="checked"
           v-model="bData"
           @click="update( $event.target.value, $event.target.checked )">
    <label :for="btnId">
      <slot></slot>
    </label>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Emit} from 'vue-property-decorator';

@Component
export default class CheckButton extends Vue{

  @Prop(String)
  public checkName!: string;

  @Prop(String)
  public btnId!: string;

  @Prop(String)
  public label!: string;

  @Prop(String )
  public btnValue!: string | boolean;

  @Prop( [ Array, Boolean ] )
  private bData!: string[] | boolean;

  private checked: boolean=true;

  @Emit()
  private update( value: string | boolean, checked: boolean ): void {
    // console.log( this.btnValue, value );
    this.checked=checked;
    this.btnValue=value;
    this.$emit('click', this.btnValue, this.checked );
  }



}
</script>

<style scoped>

</style>
