interface IClassInfo {
    classThumb: () => void;
    className: string;
    classOwner: string;
    createdYear: number;
    classType: string;
    memberNum: number;
    isUpdated: boolean;
    updatedDiffTime: string;
    isBookmarked: number;
}

interface INotifyList {
    classThumb: () => void;
    className: string;
}

interface INotifyFeedList extends INotifyList {
    feedTit: string;
    writer: string;
    updatedDiffTime: string;
}

interface IFeedList {
    feedTit: string;
    classThumb: () => void;
    className: string;
    writer: string;
    updatedDiffTime: string;
    feedText: string[];
    feedType: string;
    feedViewer: number;
    comment: number;
}

interface IMyClassList {
    id: number;
    name: string;
    class_tags: [];
    me: {};
    owner: {};
}

export {IClassInfo, INotifyList, INotifyFeedList, IFeedList, IMyClassList};