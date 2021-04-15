import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import {getAllPromise} from '@/views/model/types';
import MyClassService from '@/api/service/MyClassService';
import WithRender from './MyClassListDetailView.html';

const MyClass = namespace('MyClass');

@WithRender
@Component
export default class MyClassListDetailView extends Vue{

  private pagingCount: number=0;


  @MyClass.Getter
  private classID!: string | number;

  private allData: any[] = [];

  get allDataModel(): any[]{
    return this.allData;
  }

  public created(): void{
    this.getClassList();
  }

  //{total_count: 0, post_listcount: 0, post_list: Array(0)}
  //{ total: 0, class_schedule_list: Array(0)}
  // {page_item_count: 5, total: 0, curriculum_list: [], item_count: 0}
  private getClassList(): void{
    getAllPromise([
      MyClassService.getAllPostsByClassId( this.classID, this.pagingCount ),
      MyClassService.getAllScheduleByClassId( this.classID, this.pagingCount ),
      MyClassService.getAllCurriculumByClassId( this.classID, this.pagingCount ),
    ]).then( ( data: any )=>{
      this.allData=data;
      console.log( data );
    }).catch((error)=>{
      console.log('class more info error', error );
    });
  }
}
