import {IMyClassList} from '@/views/model/my-class.model';
import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import ClassService from '@/api/service/MyClassService';

import {
    MYCLASS_LIST
} from '@/store/mutation-class-types';

import {
    MYCLASS_LIST_ACTION,
} from '@/store/action-class-types';

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
    public [MYCLASS_LIST](classData: IMyClassList[]): void {
        this.classData = classData;
        localStorage.setItem('classData', JSON.stringify(this.classData) );
        this.count++;
    }

    /* Actions */
    @Action({rawError: true})
    public [MYCLASS_LIST_ACTION](): Promise<IMyClassList[]> {
        return ClassService.getAllMyClass()
            .then((data: any) => {
                console.log(data);
                this.context.commit(MYCLASS_LIST, data.myclass_list);
                return Promise.resolve(data);
            }).catch((error: any) => {
                console.log(error);
                return Promise.reject(error);
            });
    }
}
