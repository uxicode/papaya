import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {getAllPromise} from '@/views/model/types';
import MyClassService from '@/api/service/MyClassService';
import WithRender from './MyClassListDetailView.html';
import {Utils} from '@/utils/utils';

const MyClass = namespace('MyClass');

@WithRender
@Component
export default class MyClassListDetailView extends Vue{

  private pagingCount: number=1;
  private numOfPage: number=10;
  private mChk: boolean=false;


  @MyClass.Getter
  private classID!: string | number;

  private allData: any[] = [];

  get allDataModel(): any[]{
    return this.allData;
  }

  public created(): void{
    this.getClassList();
  }

  public getMax<T>( items: T[] ): T{
    return items.reduce( (a: T, b: T )=>{
      return a>b? a : b;
    });
  }

  //{total_count: 0, post_listcount: 0, post_list: Array(0)}
  //{ total: 0, class_schedule_list: Array(0)}
  // {page_item_count: 5, total: 0, curriculum_list: [], item_count: 0}
  private getClassList(): void{
    getAllPromise([
      MyClassService.getAllScheduleByClassId( this.classID, { page_no: 1, count:10} ),
      MyClassService.getAllCurriculumByClassId( this.classID, { page_no: 1, count:10} ),
      MyClassService.getAllPostsByClassId( this.classID, { page_no: 1, count:10}),
    ]).then( ( data: any )=>{

      const max=this.getMax<number>([data[0].class_schedule_list.length, data[1].curriculum_list.length, data[2].post_list.length] );
      // console.log(max);

      const allData: any[] = [];
      for (let i = 0; i < max; i++) {
        allData[i]=[];
        for (let j = 0; j < data.length; j++) {
          if (j=== 0) {
            if (data[j].class_schedule_list[i]!== undefined) {
              allData[i].push({list: data[j].class_schedule_list[i], name:'schedule'});
            }
          }else if (j=== 1) {
            if (data[j].curriculum_list[i]!== undefined) {
              allData[i].push({ list: data[j].curriculum_list[i], name:'curriculum'});
            }
          }else if (j=== 2) {
            if (data[j].post_list[i] !== undefined) {
              allData[i].push({ list: data[j].post_list[i], name:'post'});
            }
          }
        }
      }

      this.allData = [...allData];
      console.log(this.allData);
      // const allData=[ ...data[0].post_list,  ...data[1].class_schedule_list, ...data[2].curriculum_list];
    }).catch((error)=>{
      console.log('class more info error', error );
    });
  }


}
