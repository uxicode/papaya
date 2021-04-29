<template>
  <div class="form-add-list">
    <!-- start: 상단 -->
    <div class="add-item" style="margin: 0 40px;">
      <div class="add-item-top" v-if="fileItems.length>0">
        <p class="add-item-tit">{{ getTitle() }}</p>
        <div class="add-item-btn">
          <a href="" class="txt-btn" @click.prevent="removeAll">전체삭제</a>
        </div>
      </div>
    </div>
    <!-- end: 상단 -->

    <!-- start: 이미지 뷰 -->
    <div class="add-item-cnt" style="padding:0" v-if="fileItems !==undefined">
      <div class="add-photo" >

        <ul class="add-photo-list clearfix" :style="moveX">
          <li v-for="(item, index) in fileItems" :key="`file-${index}`">
            <div class="add-img"><img :src="item" class="thumb" alt=""></div>
            <a href="#" class="add-img-delete" @click.prevent.stop="removeThumb( index )"><img :src="require('@/assets/images/delete.svg')" alt="" @load="imageLoaded"></a>
          </li>
        </ul>

      </div>
      <div class="add-photo-control" v-if="fileItems.length>6">
        <a href="" class="btn only-ico-btn scroll-prev" @click.prevent="imgPreviewMove( true )"><img :src="require('@/assets/images/arrow-left.svg')" alt=""></a>
        <a href="" class="btn only-ico-btn scroll-next" @click.prevent="imgPreviewMove( false )"><img :src="require('@/assets/images/arrow-right.svg')" alt=""></a>
      </div>
    </div>
    <!-- end: 이미지 뷰 -->

  </div>


</template>

<script lang="ts">
import {Vue, Component, Prop, Emit} from 'vue-property-decorator';

@Component
export default class ImagePreview extends Vue{

  private moveCount: number=0;
  private moveX: string = '';

  @Prop(Array)
  private fileItems!: string[];

  @Emit()
  private removeThumb( idx: number ) {
    this.$emit('remove', idx);
  }

  @Emit()
  private imageLoaded(){
    this.$emit('loaded');
  }

  @Emit()
  private removeAll(): void{
    this.$emit('removeAll');
    this.moveX = '';
    this.moveCount=0;
  }


  private moveCountCal( isLeft: boolean =true ): void {

    const md = Math.ceil(this.fileItems.length / 2)-1;
    if (isLeft) {
      this.moveCount--;
      if (this.moveCount <=0) {
        this.moveCount=0;
      }
    } else {
      this.moveCount++;
      if (this.moveCount >=md) {
        this.moveCount=md;
      }
    }
  }
  private imgPreviewMove( isLeft: boolean ): void{
    this.moveCountCal(isLeft);
    const photoList=document.querySelector('.add-photo-list') as HTMLElement;

    // console.log('this.fileItems.length=', this.fileItems?.length);

    if(this.fileItems){
      const itemLen=this.fileItems.length;
      const rectInfo=photoList.getClientRects();
      // console.log('rectInfo=', rectInfo[0].width);
      // itemLen*(80+10);
      const itemTotalSize=itemLen*(80+10);
      //이미지 width > 총 width = 이미지 width/90 = move total count


      this.moveX =(itemTotalSize>rectInfo[0].width)? `transform: translateX( ${-1 * this.moveCount * 80}px )` : '' ;
      console.log('this.moveX=', this.moveX, this.moveCount );
    }

  }

  private getMoveTotalCount( imgW: number, ): void{

  }

  private getTitle() {
    return (!this.fileItems)? '' : `사진 ${this.fileItems.length}`;
  }
}
</script>

<style scoped>

</style>
