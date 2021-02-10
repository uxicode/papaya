<template>
  <button type="button"
          class="btn"
          :disabled="state"
          :class="buttonType"
          @click.stop="$emit('btnClick');">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component
export default class Btn extends Vue{
  @Prop(String)
  private readonly type: string | undefined;

  @Prop(String)
  private readonly size: string | undefined;

  //부모 태그에서는 -> v-bind 축약형 (:)
  // :state="!userMobileState"
  @Prop(Boolean)
  private state!: boolean;

  @Prop(String)
  private full!: string;

  get buttonType(): object{
    return {
      'primary': this.type===undefined || this.type === 'primary',
      'outline': this.type ==='outline',
      'grey': this.type ==='grey',
      'sm': this.size ==='small' || this.size ==='sm',
      'lg': this.size ==='large' || this.size ==='big' || this.size ==='lg',
      'btn-block': this.size === 'full',
      'lg btn-block': this.size === 'wide',
    };
  }

}
</script>

<style scoped>

</style>
