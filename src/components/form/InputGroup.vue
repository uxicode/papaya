<template>
  <div class="form-group inline">
    <ValidationProvider name="모바일 번호" :rules="rules" v-slot="{ errors }">
      <input type="text" class="form-control"
             :placeholder="placeholder"
             @input="inputChange( $event.target.value )"
             :value="inputData"
             :style="{width:inputSize+'px'}">
      <btn :type="btnType" :size="btnSize" :state="btnState" @btnClick="buttonClick">{{ title }}</btn>
<!--      <p class="form-message approval" v-if="isMobileChk">모바일 인증이 완료 되었습니다. </p>-->
      <p class="form-message error">{{ errors[0] }}</p>
    </ValidationProvider>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import Btn from '../button/Btn.vue';

@Component({
  components:{
    Btn,
  }
})
export default class InputGroup extends Vue{

  @Prop(String)
  private rules: string | undefined;

  @Prop(String)
  private inputSize: string | undefined;

  @Prop(String)
  private placeholder: string | undefined;

  @Prop(String)
  private  btnType: string | undefined;

  @Prop(String)
  private  btnSize: string | undefined;

  @Prop(String)
  private title: string | undefined;

  @Prop(Boolean)
  private btnState!: boolean;

  private inputData: string='';

  private inputChange(value: string) {
    this.inputData=value;
    this.$emit('input', value );
  }

  private buttonClick() {
    console.log('input-group 클릭');
    this.$emit('buttonClick');
  }


}
</script>

<style scoped>

</style>
