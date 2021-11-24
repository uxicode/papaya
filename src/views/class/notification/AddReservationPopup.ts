import {Component, Prop, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import Modal from '@/components/modal/modal.vue';
import TxtField from '@/components/form/txtField.vue';
import {ITimeModel} from '@/views/model/schedule.model';
import WithRender from '@/views/class/notification/AddReservationPopup.html';

const MyClass = namespace('MyClass');

@WithRender
@Component({
  components: {
    Modal,
    TxtField
  }
})
export default class AddReservationPopup extends Vue {
  @Prop(Boolean)
  private isOpen!: boolean;

  @MyClass.Getter
  private classID!: string | number;

  private reservationTimeChk: boolean=false;
  private dateMenu: boolean=false;
  private timeMenu: boolean=false;
  private alarmData: { alarmAt: string }={
    alarmAt:  ''
  };
  private datePickerModel: string= new Date().toISOString().substr(0, 10);
  private timeSelectModel: ITimeModel={ apm:'오전', hour:'12', minute: '30'};
  private referTimeItems={
    apm: ['오전', '오후'],
    hour: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    minute: [ '5', '10','15', '20','25', '30','35', '40', '45', '50', '55', '00']
  };

  get isValidation(): boolean{
    return (this.reservationTimeChk)? this.alarmData.alarmAt!=='' : true;
  }

  get currentTimeModel(): string{
    return `${this.timeSelectModel.apm} ${this.timeSelectModel.hour}시 ${this.timeSelectModel.minute} 분`;
  }

  private onReservationChange(value: string | boolean) {
    this.reservationTimeChk=!!value;
    this.alarmData.alarmAt=( this.reservationTimeChk )? new Date().toISOString().substr(0, 10) : '';
  }

  private addStartApmSchedule( val: string ) {
    console.log(val, this.currentTimeModel );
  }

  private datePickerChange( ) {
    this.dateMenu = false;
  }

  private onReservationSubmit() {
    // const date=new Date( this.datePickerModel );
    const hour = (this.timeSelectModel.apm === '오후') ? Number(this.timeSelectModel.hour) + 12 : Number(this.timeSelectModel.hour);
    const minute= Number( this.timeSelectModel.minute );

    //예약 알림 설정 토글이 true 인경우에만...
    this.alarmData.alarmAt =(this.reservationTimeChk)? `${this.datePickerModel} ${hour}:${minute}:00` : '';
    // console.log(this.reservationTimeChk, this.alarmData.alarmAt);
    this.$emit('submit', this.alarmData);
  }

  private popupChange( value: boolean ) {
    this.$emit('close', value);
  }
}
