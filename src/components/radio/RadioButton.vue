<template>
  <div class="btn-radio">
    <input type="radio"
           :name="radioName"
           :id="btnId"
           :value="btnValue"
           v-model="radioData"
           :checked="checkedState"
           @click="update">
    <label :for="btnId">
      <slot></slot>
    </label>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component
export default class RadioButton extends Vue {

  @Prop(String)
  public btnId!: string;

  @Prop(String)
  public radioName!: string;

  @Prop(String)
  public btnValue!: string;

  @Prop(String)
  public label!: string;

  @Prop(String)
  private radioData!: string;

  private update(event: any) {
    this.btnValue = event.target.value;
    // this.btnValue=value;
    this.$emit('click', this.btnValue);
  }

  private checkedState(): boolean {
    // console.log( '라디오체크상태', this.radioData === this.btnValue );
    return this.radioData === this.btnValue;
  }

  private mounted() {
    // console.log( '라디오체크상태', this.radioData );
  }

}
</script>

<style scoped>

</style>
