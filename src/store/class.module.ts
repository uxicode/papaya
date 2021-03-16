import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import {INullable} from '@/views/model/types';
import {IMyClassList} from '@/views/model/my-class.model';
import MyClassService from '@/api/service/MyClassService';
import {MYCLASS_LIST, MODIFY_MYCLASS_LIST} from '@/store/mutation-class-types';
import {MYCLASS_LIST_ACTION, MODIFY_MYCLASS_LIST_ACTION} from '@/store/action-class-types';


@Module({
    namespaced: true,
})
export default class ClassModule extends VuexModule {
    /* State */
    private classData: IMyClassList[]=[];
    private count: number = 0;

    /* Getters */
    get myClassLists():  IMyClassList[]{
        return this.classData;
    }

    /* Mutations */
    @Mutation
    public [MYCLASS_LIST](classData: IMyClassList[] ): void {
        this.classData =classData;

        // console.log(this.classData);
        localStorage.setItem('classData', JSON.stringify(this.classData) );
        this.count++;
    }


    /* Actions */
    @Action({rawError: true})
    public [MYCLASS_LIST_ACTION](): Promise<INullable<IMyClassList[]>> {
        return MyClassService.getAllMyClass()
            .then((data: any) => {
                this.context.commit(MYCLASS_LIST, data.myclass_list);
                return Promise.resolve(data.myclass_list);
            }).catch((error: any) => {
                console.log(error);
                return Promise.reject(error);
            });
    }
}
