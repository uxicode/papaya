<template>
  <select :style="{width:size+'px'}"
          class="form-control"
          :value="selectedValue"
          :id="id"
          @change="updateValue($event.target.value)">
    <option v-for="item in items" :value="item">{{ item }}</option>
  </select>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class SelectBox extends Vue{

  @Prop(String)
  private readonly id: string | undefined;

  @Prop(String)
  private size: string | undefined;

  @Prop(Array)
  private items: string[] | undefined;

  @Prop([String, Number, Date])
  private selectedValue!: string | number | Date;

  private updateValue( value: string | number ): void {
    this.$emit('change', value);
  }
}
</script>

<style scoped>

</style>
