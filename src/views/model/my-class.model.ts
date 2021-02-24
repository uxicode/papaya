interface IClassInfo {
    classThumb: () => void;
    className: string;
    classOwner: string;
    createdYear: number;
    classType: string;
    memberNum: number;
    isUpdated: boolean;
    updatedDiffTime: string;
    isFavorite: boolean;
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
    feedType: string;
    //imgList: Array<() => void>;
    feedViewer: number;
    comment: number;
}

export {IClassInfo, INotifyList, INotifyFeedList, IFeedList};