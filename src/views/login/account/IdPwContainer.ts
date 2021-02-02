import {Vue, Component} from 'vue-property-decorator';
import WithRender from './IdPwContainer.html';
import {Route} from 'vue-router';


interface IPath{
  id:number;
  url:string;
  title:string;
}

@WithRender
@Component
export default class IdPwContainer extends Vue {

  private activeItem: number =0;
  private listInfos: IPath[] = [
    {id: 0, url: '/login/findId', title: '아이디 찾기'},
    {id: 1, url: '/login/findId/resetPw', title: '비밀번호 재설정'},
  ];

  private isActive( idx:number ):boolean{
    return this.activeItem === idx;
  }

  private gotoLink(idx: number): void {
    this.activeItem = idx;
    this.$router.push(this.listInfos[idx].url).then((r: Route) => {
      console.log(this.listInfos[idx].title);
    });
  }
}
