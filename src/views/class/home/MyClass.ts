import {Component, Vue} from 'vue-property-decorator';
import WithRender from './MyClass.html';

@WithRender
@Component
export default class MyClass extends Vue {

}
