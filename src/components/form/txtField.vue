<template>
  <!--
  <txt-field input-type="input type / 해당 옵션없을시 default 값은 text"
              inputSize="input width / 해당 옵션없을시 default 값은 100%"
              add-class="input 태그에 추가할 css class //해당 옵션없을시 default 값은 공백처리"
              label="label 태그 text"
              id="input 아이디"
              placeholder="placeholder 내용"
              v-model="input model"
              rules="vee-validation 의 filter 함수"
              valid-name="vee-validation 의 ValidationProvider 태그의 아이디 - 에러 문구 호출시 해당 태그의 아이디를 참조한다."></txt-field>
  -->
  <div class="txt-field-container" :style="{width:size+'px'}">
    <ValidationProvider :name="validName"
                        :rules="rules"
                        v-slot="{ errors }">
      <label :for="id" v-if="isLabel">{{ label }}</label>
      <input class="form-control"
             :class="cssClassName"
             :id="id"
             :type="inputFieldType"
             :placeholder="placeholder"
             @input="inputChange( $event.target.value )"
             :value="inputData">
      <p class="form-message approval" v-if="isSuccess">{{ successFeedback }}</p>
      <p class="form-message error">{{ errors[0] }}</p>
    </ValidationProvider>
  </div>
</template>

<script lang="ts">

import {Vue, Component, Prop} from 'vue-property-decorator';

@Component
export default class TxtField extends Vue{

  @Prop(String)
  private readonly validName: string | undefined;

  @Prop(String)
  private readonly addClass: string | undefined;

  @Prop(String)
  private readonly id: string | undefined;

  @Prop(String)
  private inputType: string | undefined;

  @Prop(String)
  private rules: string | undefined;

  @Prop(String)
  private size: string | undefined;

  @Prop(String)
  private placeholder: string | undefined;

  @Prop(String)
  private label: string | undefined;

  @Prop(String)
  private successFeedback: string | undefined;

  @Prop(Boolean)
  private success: boolean | undefined;

  private inputData: string='';

  get cssClassName(): string{
    return (this.addClass !== undefined)? this.addClass : '';
  }

  get isSuccess(): boolean{
    return !!this.success;
  }

  get isValidShow(): boolean{
    return this.success!==undefined && this.success;
  }

  get isLabel(): boolean {
    return this.label!==undefined;
  }

  get inputFieldType(): string {
    return this.inputType===undefined? 'text' : this.inputType;
  }

  /**
   * mounted - 화면 렌더링 후
   */
  public mounted(): void{
    // console.log( this.$el.parentElement.classList.contains('inline') );
    //타입 지정 안해주면 Object is possibly null 에러 난다.
    const parentElement = this.$el.parentElement as HTMLElement;
    const parentClassList = parentElement.classList;
    //바로 위에 부모 노드에서 inline className 이 존재한다면 inline 클래스를 추가.
    if( parentClassList.contains('inline') ){
      this.$el.classList.add('inline');
    }
  }

  private inputChange(value: string) {
    this.inputData=value;
    this.$emit('input', value );
  }

}
</script>

<style lang="scss" scoped>
.txt-field-container{
  &.inline{
    display: inline-block;
  }
}
</style>
