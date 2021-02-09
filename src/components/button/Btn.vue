<template>
  <button type="button" class="btn sm grey"
          :disabled="!userMobileState" @click.stop="getUserIdByMobile">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component
export default class Btn extends Vue{
  @Prop(String)
  private readonly type: string | undefined;

  get buttonType():string{
    if( this.type === undefined){
      return 'primary';
    }else{
      return 'outline';
    }
  }
}
</script>

<style scoped>

</style>
