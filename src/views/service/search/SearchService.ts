
import {Observable, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, finalize, map, retry, share, switchMap, tap } from 'rxjs/operators';
import {FromEventTarget} from 'rxjs/internal/observable/fromEvent';

/**
 * input element 선택자
 * @param targetInputSelector
 */
function searchKeyEventObservable( targetInputSelector: string ): Observable<Event> {
  //키가 눌렸을 때 체크 Observable
  return fromEvent( document.querySelector( targetInputSelector ) as FromEventTarget<HTMLInputElement>, 'keyup')
    .pipe(
      debounceTime(300),
      map((event: any) => event.target.value), /*KeyboardEvent 로 전달되는 데이터를 입력된 검색어로 변환.*/
      distinctUntilChanged(), // 동일한 데이터가 계속 전달될 경우 이전과 다른 데이터가 전달되기 전까지 데이터를 전달하지 않는다. 즉 중복 데이터 처리
      share()  // keyup$ Observable 에서 user$ Observable 과 reset$ Observable 두개로 참조를 나누게 되는데 함께 정보를 공유한다.
    );
}



/**
 * //사용자가 입력한 값 처리 Observable
 * @param obv$ - Observable
 * @param loadChk - 로딩 중 체크 함수
 * @param promiseFunc - 통신할 promise 반환 api 함수
 * @param isLoading  - 로딩완료됨을 알릴 toggle 변수
 */
function searchUserKeyValueObservable(obv$: Observable<any>, loadChk: () => void, promiseFunc: ( name: any ) => Promise<any>, isLoading: boolean) {
  return obv$.pipe(
    filter( ( value: any)=> value.trim().length>1), //검색어 길이가 0 보다 큰경우 즉 검색어가 있을 경우에만,
    tap( ()=> loadChk() ),
    switchMap( async ( value: any ) => {
      //빈번하게 발생하는 데이터를 처리하는 경우 mergeMap 보다는 switchMap 이 더욱 효과적.
      //switchMap 은 기존에 존재하던 Observable 의 구독을 자동으로 해제함으로써 불필요한 데이터를 부르지 않는다.
      // 또한 이미 처리했던 Observable 을 자동으로 unsubscribe 하기 때문에 메모리 누수 문제에 대해서도 자유롭다.
      return await promiseFunc( value );
    }),
    tap( ()=> loadChk() ),
    retry(2),  // 검색어가 입력되어 2번의 오류가 발생하면 Observer.error 이 호출되어 keyup$ Observable 의  구독이 해제된다.
    finalize( ()=>isLoading=false )
  );
}

/**
 * // 검색어 입력이 없을시 이전 검색결과 없앤다.
 * @param obv$  - Observable
 * @param reset - 초기화할 함수 ( 검색 내역 및 로드 완료 toggle 변수 )
 */
function resetSearchInput( obv$: Observable<any>, reset: ()=>void) {
  return obv$.pipe(
    filter((value: any) => value.trim().length === 0),
    tap((value) => {
      reset();
    })
  );
}



export {searchKeyEventObservable, searchUserKeyValueObservable, resetSearchInput};
