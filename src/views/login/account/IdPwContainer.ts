import {Component, Vue} from 'vue-property-decorator';
import WithRender from './IdPwContainer.html';
import {Route} from 'vue-router';


interface IPath{
  id:number;
  url:string;
  title:string;
  key:string;
}

@WithRender
@Component
export default class IdPwContainer extends Vue {



  private activeItem: number =0;
  private listInfos: IPath[] = [
    {id: 0, url: '/login/findId', title: '아이디 찾기', key:'findId'},
    {id: 1, url: '/login/findId/resetPw', title: '비밀번호 재설정', key:'resetPw'},
  ];

  private created(){
    // console.log( 'this.$route=', this.$route.name );
    if( this.$route.name === 'resetPw' ){
      // this.gotoLink(1);
      this.gotoLink( this.findMenuIdxByKey( 'resetPw') );
    }
  }

  private isActive( idx:number ):boolean{
    return this.activeItem === idx;
  }

  private findMenuIdxByKey( key:string ):number{
    const findItem:IPath[]=this.listInfos.filter( (item:IPath)=>item.key===key);
    return findItem[0].id;
  }

  private gotoLink(idx: number): void {
    this.activeItem = idx;
    this.$router.push(this.listInfos[idx].url).then((r: Route) => {
      console.log(this.listInfos[idx].title);
    });
  }
}
