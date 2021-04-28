class Utils{

  /**
   * 모바일 번호 정규식
   */
  public static getMobileRegx(): RegExp{
    return  /^\d{3}\d{3,4}\d{4}$/;
  }

  /**
   * 특수문자 / 한글 제외 - 영문 / 숫자만 가능 문자 정규식
   */
  public static getEnWordRegx(): RegExp{
    //x(?=y) 오직 'y'가 뒤따라오는 'x' 에만 대응
    //x(?!y) - 'x' 뒤에 'y'가 없는 경우에만 'x' 일치.
    return /^(?=.*[a-zA-Z])(?!.*[^a-zA-Z0-9_])+[a-zA-Z0-9]/;
  }

  /**
   * 특수문자와 넘버를 포함시킨 영문 min 에서 max 까지 가능
   * @param min
   * @param max
   */
  public static getPwdRegx( min: number, max: number): RegExp{
    //x(?=y) 오직 'y'가 뒤따라오는 'x' 에만 대응
    return new RegExp(`(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9_])(?=.*[0-9]).{${min},${max}}$`);
  }

  /**
   * 특수문자를 제외하고 문자 시작하여 숫자 포함한  min 에서 max 까지 가능
   * @param min
   * @param max
   */
  public static getUserIdRegx( min: number, max: number ): RegExp{
    //x(?!y) - 'x' 뒤에 'y'가 없는 경우에만 'x' 일치.
    //정규표현식을 아래와 같이 변수를 연동하는 등의 동적 표현시엔 RegExp 생성자를 사용한다.
    return new RegExp( `^(?=.*[a-zA-Z])(?!.*[^a-zA-Z0-9_])+[a-zA-Z0-9]{${min},${max}}$`);
  }

  /**
   * email 체크
   */
  public static getEmailRegx(): RegExp{
    return /^[a-z0-9!#$%&'*+\\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/ig;
  }

  /**
   * 문자열 여러개 중 개별 1개 문자에 대한 바이트 계산
   * @param txt 문자
   * @returns {number}
   */
  public static getCharByteSize(txt: string): number {
    if (txt === null || txt.length === 0) {
      return 0;
    }
    //byte 는 -128 ~ 127 까지  0x00 ~ 0xFF (1 바이트)
    //2byte = 16bit = 2^16 = 65,536
    const charCode = txt.charCodeAt(0);
    if (charCode <= 127 ) {  //0x00007F
      return 1;
    } else if (charCode <= 2047 ) { //0x0007FF
      return 2;
    } else if (charCode <= 65535 ) {//0x00FFFF
      return 3;
    } else {
      return 4;
    }
  }

  /**
   * 여러 문자열 중 검색시 1개 문자에 대한 바이트 계산
   * @param txt 문자
   * @param idx 인덱스
   * @returns {*|number}
   */
  public static getCharIndexToBytes(txt: string, idx: number): number {
    return Utils.getCharByteSize( Utils.getCharByIndex(txt, idx) );
  }

  public static getCharByIndex(txt: string, idx: number): string {
    return txt.charAt(idx);
  }


  /**
   * 크로스브라우징 window.width
   * @returns {Number|number}
   */
  public static getWindowWidth(): number {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

  /**
   * 크로스브라우징 window.height
   * @returns {Number|number}
   */
  public static getWindowHeight(): number {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  }


  public static getDocHeight(): number{
    const doc = document;
    return Math.max(
      doc.body.scrollHeight, doc.documentElement.scrollHeight,
      doc.body.offsetHeight, doc.documentElement.offsetHeight,
      doc.body.clientHeight, doc.documentElement.clientHeight
    );
  }

  /**
   * 인수로 전달된 엘리먼트의 영역 범위( 위치 및 사이즈 ) 호출
   * @param ele
   * @returns {*}
   */
  public static getBoundingClientRect(ele: HTMLElement): object {
    const clientRect: DOMRect = ele.getBoundingClientRect();

    // ie8 에서 width/height 속성이 없다.
    if (typeof clientRect.height === 'undefined') {
      return {
        top: clientRect.top,
        bottom: clientRect.bottom,
        left: clientRect.left,
        right: clientRect.right,
        width: clientRect.right - clientRect.left,
        height: clientRect.bottom - clientRect.top
      };
    }
    return clientRect;
  }

  /**
   * 대시(-)가 붙은 날짜를 숫자타입으로 배열에 넣어 리턴 [ 년, 월, 일 ]
   * @param date
   * @returns {number[]}
   */
  public static dateDashFormatUndo( date: string ): number[] {
    const dateInfo: string[]=String( date ).split('-');
    // tslint:disable-next-line:radix
    return [ parseInt( dateInfo[0] ), parseInt( dateInfo[1] ), parseInt( dateInfo[2] ) ];
  }

  /**
   * 오늘을 기준으로 2020-07-11 처럼 대시(-)가 붙은 날짜로 변환
   * @param today
   * @returns {string}
   */
  public static  getTodayParseFormat( today: Date )  {
    const dateInfo: number[] =Utils.getTodayFullValue( today );
    return Utils.getDateDashFormat( dateInfo[0], dateInfo[1], dateInfo[2] );
  }

  /**
   *  윤년 체크
   * @param year
   * @returns {boolean}
   */
  public static  isLeapYear(year: number) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
  }

  /**
   * 지정한 월의 날짜 개수 구하기
   * @param year
   * @param month
   * @returns {number}
   */
  public static  getDaysInMonth(year: number, month: number): number {
    return [31, ( Utils.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }

  /**
   * 1970년 1월 1일 00:00:00 국제 표준시(UTC)와의 차이를 밀리초 수로 나타내 반환.
   * @returns {Date}
   * @constructor
   */
  public static UTCDate(...args: number[] ): Date{
    // @ts-ignore
    return new Date(Date.UTC.apply(Date, args) );
  }
  /**
   * 오늘을 기준으로 국제 표준시(UTC) 반환
   * @returns {Date}
   * @constructor
   */
  public static UTCToday(): Date{
    const today = new Date();
    return Utils.UTCDate( today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  }

  /**
   * 특정 날부터 지정한 기간의 날짜 구하기 -> 즉 2020-10-7 에서 1개월 후는 2020-11-23 이다. 여기서 23일 을 구하는 함수
   * @param year
   * @param month
   * @param day
   * @returns {number}
   */
  public static getRemainderFromToday( year: number, month: number, day: number ): number {
    return Utils.getDaysInMonth( year, month ) - day;
  }

  /**
   * 오늘을 기준으로 년,월,일 을 배열 타입 리턴
   * @param today
   * @returns {(number)[]}
   */
  public static  getTodayFullValue( today: Date ): number[] {
    return [ today.getFullYear(), today.getMonth() + 1,  today.getDate() ];
  }

  /**
   * 숫자로 되어 있는 년, 월, 일을 대시(-)가 붙은 날로 변환 즉 숫자  2020, 7, 11 을 --> 2020-07-11 로 변환
   * @param yyyy
   * @param mm
   * @param dd
   * @returns {string}
   */
  public static getDateDashFormat( yyyy: string | number, mm: string | number, dd: string | number ) {
    return yyyy+'-'+( mm<10 ? '0'+mm : mm )+'-'+( dd<10 ? '0'+dd : dd );
  }

  public static dayToString( date: Date ): string{
    const dayNum: string[] = ['일', '월', '화', '수', '목', '금', '토'];
    return dayNum[date.getDay()]+'요일';
  }

  public static getFullDay(date: Date): string{
    return Utils.getTodayParseFormat(date)+' '+Utils.dayToString( date )+' '+Utils.getFullTimes( date );
  }

  public static getFullTimes( date: Date ): string{
    const hours=Utils.hoursConvertToApm( date.getHours() );
    const minutes =date.getMinutes();
    return hours + '시 ' + minutes + '분';
  }

  public static hoursConvertToApm( hours: number ): string | number{
    return hours>12? String( '오후 '+( hours-12) ) : hours;
  }

  public static getRandomNum( min: number, max: number ): number {
    return Math.floor(Math.random()*(max-min+1)) + min;
  }

  public static getWindowReload(): void{
    window.location.reload();
  }

  /*
  어떤 페이지를 로딩하는 데 필요한 전체 시간 계산하기.
  * var perfData = window.performance.timing;
var pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

요청 응답 시간 계산하기.
var connectTime = perfData.responseEnd - perfData.requestStart;
  * */

}

export {Utils};
