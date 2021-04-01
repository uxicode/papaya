<template>
  <section class="contents-left">
    <div class="class-home">
      <div class="class-home-info">
        <div class="info-img">
          <img :src="require('@/assets/images/bg-icon.png')" alt="">
          <a href="" class="img-change"><img :src="require('@/assets/images/btn-round 2.png')" alt=""></a>
        </div>
        <div class="info-txt">
          <p class="info-cn">{{myClassHomeModel.name}}</p>
          <span class="info-or">{{myClassHomeModel.g_name}}</span>
          <ul class="info-list">
            <li>{{ myClassHomeModel.startday }}</li>
            <li>{{ myClassHomeModel.is_private? '공개' : '비공개' }}</li>
            <li><a href="">멤버 {{ myClassHomeModel.member_count }} &gt;</a></li>
          </ul>
          <p class="info-tag">{{getHashTag(myClassHomeModel.class_tags) }}</p>
        </div>
        <div class="class-bookmark">
          <a type="button" class="btn ico-btn ico-left active"><span class="icon heart"></span>즐겨찾기</a>
        </div>
      </div>

      <div class="class-menu">
        <ul class="menu-list">
          <li v-for="(item, index) in sideMenuModel" :key="`item-${index}`">
            <a href="" :class="[`type${index+1}`, {'active': index===activeNum } ]" @click.stop.prevent="sideMenuClickHandler( index )">{{ item.title }}</a>
          </li>
<!--          <li><a href="" class="type2">알림</a></li>
          <li><a href="" class="type3">일정</a></li>
          <li><a href="" class="type4">파일함</a></li>
          <li><a href="" class="type5">교육과정</a></li>
          <li><a href="" class="type6">클래스 설정</a></li>-->
        </ul>
      </div>

    </div>
  </section>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {IClassInfo} from '@/views/model/my-class.model';


interface ISideMenu{
  id: number;
  title: string;
  link: string;
}

const MyClass = namespace('MyClass');

@Component
export default class SideMenu extends Vue{

  @Prop(Number)
  private activeNum: number | undefined;

  @MyClass.Getter
  private classID!: string | number;

  @MyClass.Getter
  private myClassHomeModel!: IClassInfo;

  private sideMenuData: ISideMenu[]=[
    {id:0, title: '클래스 홈', link:'' },
    {id:1, title: '알림', link:'' },
    {id:2, title: '일정', link:'' },
    {id:3, title: '파일함', link:'' },
    {id:4, title: '교육과정', link:'' },
    {id:5, title: '클래스 설정', link:'' },
  ];

  get sideMenuModel(): ISideMenu[]{
    return this.sideMenuData;
  }

  public created(): void{
    console.log('classID=', this.classID, this.sideMenuModel, this.myClassHomeModel );
  }

  private sideMenuClickHandler(idx: number): void{
    this.$emit('sideClick', idx);
  }

  private getHashTag( items: any[] ): string | undefined {
    if( items.length === 0 ){ return; }
    const keywords= items.map(( prop ) => '#' + prop.keyword);
    return keywords.join(' ');
  }

}
</script>

<style scoped>

</style>
