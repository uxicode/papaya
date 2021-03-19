type IMaybe<T> = T | undefined | null; //null 초기화 말고도 undefined 에 대한 초기화
type INullable<T> = T | null; //object null 초기화
const getAllPromise = <T>( promises: Array< Promise<T>>) => Promise.all(promises);
export {IMaybe, INullable, getAllPromise};
