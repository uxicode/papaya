<template>
  <div class="form-group inline">
    <ValidationProvider :name="name"
                        :rules="rules"
                        v-slot="{ errors }">
      <input class="form-control"
             :type="inputFieldType"
             :placeholder="placeholder"
             @input="inputChange( $event.target.value )"
             :value="inputData"
             :style="{width:inputSize+'px'}">
      <btn v-if="hasBtn"
           :type="btnType"
           :size="btnSize"
           :state="btnState"
           @btnClick="buttonClick">{{ title }}</btn>
      <p class="form-message approval" v-if="success">{{ successFeedback }}</p>
      <p class="form-message error" v-else>{{ errors[0] }}</p>
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
  private inputType: string | undefined;

  @Prop(String)
  private readonly name: string | undefined;

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

  @Prop(String)
  private successFeedback: string | undefined;

  @Prop(Boolean)
  private btnState!: boolean;

  @Prop(Boolean)
  private success!: boolean;

  private inputData: string='';

  get inputFieldType(): string {
    return this.inputType===undefined? 'text' : this.inputType;
  }

  get hasBtn(): boolean{
    return this.btnType!==undefined || this.btnSize!==undefined;
  }

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
