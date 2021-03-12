import {IMyClassList, IPostList} from '@/views/model/my-class.model';
import {INullable} from '@/views/model/init.model';
import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import ClassService from '@/api/service/MyClassService';

import {
    MYCLASS_LIST, POST_LIST
} from '@/store/mutation-class-types';

import {
    MYCLASS_LIST_ACTION, POST_LIST_ACTION,
} from '@/store/action-class-types';
import {IUserMe} from '@/api/model/user.model';

@Module({
    namespaced: true,
})
export default class ClassModule extends VuexModule {
    /* State */
    private classData: IMyClassList[]=[];
    private postData: IPostList[]=[];
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

    @Mutation
    public [POST_LIST](postData: IPostList[] ): void {
        this.postData =postData;

        // console.log(this.postData);
        localStorage.setItem('postData', JSON.stringify(this.postData) );
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

    @Action({rawError: true})
    public [POST_LIST_ACTION](): Promise<INullable<IPostList[]>> {
        return ClassService.getMyKeepPosts()
            .then((data: any) => {
                this.context.commit(POST_LIST, data.post_list);
                return Promise.resolve(data.post_list);
            }).catch((error: any) => {
                console.log(error);
                return Promise.reject(error);
            });
    }
}
