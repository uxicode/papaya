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

export {IClassInfo, INotifyList, INotifyFeedList};