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
    private classData: object = {};
    private count: number = 0;

    /* Getters */
    get myClassList(): object | string {
        return this.classData;
    }

    /* Mutations */
    @Mutation
    public [MYCLASS_LIST](classData: IMyClassList): void {
        this.classData = {
            profile_image: classData.profile_image,
            name: classData.name,
            nickname: classData.nickname,
            createdAt: classData.nickname,
            status: classData.status,
        };
        localStorage.setItem('classData', JSON.stringify(this.classData));
        this.count++;
    }

    /* Actions */
    @Action
    public [MYCLASS_LIST_ACTION](payload: IMyClassList[]): Promise<any> {
        return ClassService.getAllMyClass()
            .then((data: any) => {
                console.log(data);
                this.context.commit(MYCLASS_LIST, data.myclass_list.classData);
                return Promise.resolve(data);
            }).catch((error: any) => {
                console.log(error);
                return Promise.reject(error);
            });
    }
}