<template>
  <ul class="img-list clearfix" v-if="getImgFileLen(fileItems)>0">
    <li class="img-item" v-for="( imgItem, imgIndex ) in getImgFileDataSort(fileItems)"
        :key="`img-${imgIndex}`" >
      <a :href="imgItem[location]"
         :data-count="getImgFileMoreCheck(fileItems)"
         :class="{'pseudo-del': getImgTotalNum(fileItems) }">
        <img :src="imgItem[location]" alt="">
      </a>
    </li>
  </ul>
</template>

<script lang="ts">
import {Vue, Component, Prop, Emit} from 'vue-property-decorator';
import {IAttachFileModel} from '@/views/model/post.model';

@Component
export default class ListInImgPreview extends Vue{

  @Prop(Array)
  private fileItems!: IAttachFileModel[];

  @Prop(String)
  private location!: string;

  private getImgFileLen( items: IAttachFileModel[] ): number{
    return (items) ? this.getImgFileDataSort( items ).length : 0;
  }

  private getImgFileDataSort(fileData: IAttachFileModel[] ) {
    return fileData.filter((item: IAttachFileModel) => item.contentType === 'image/png' || item.contentType === 'image/jpg' || item.contentType === 'image/jpeg' || item.contentType === 'image/gif');
  }

  private getImgFileMoreCheck(  items: IAttachFileModel[] ) {
    return (items)? ( this.getImgFileDataSort( items ).length>3 )? `+${this.getImgFileDataSort( items ).length - 3}` : '' : 0;
  }

  private getImgTotalNum(  items: IAttachFileModel[]  ) {
    return (items && this.getImgFileDataSort(items).length <=3);
  }
}
</script>

<style scoped>

</style>
