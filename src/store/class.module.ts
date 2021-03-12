import {IMyClassList} from '@/views/model/my-class.model';
import {INullable} from '@/views/model/init.model';
import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import ClassService from '@/api/service/MyClassService';

import {
    MYCLASS_LIST
} from '@/store/mutation-class-types';

import {
    MYCLASS_LIST_ACTION,
} from '@/store/action-class-types';
import {IUserMe} from '@/api/model/user.model';

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
        return ClassService.getAllMyClass()
            .then((data: any) => {
                this.context.commit(MYCLASS_LIST, data.myclass_list);
                return Promise.resolve(data.myclass_list);
            }).catch((error: any) => {
                console.log(error);
                return Promise.reject(error);
            });
    }
}
