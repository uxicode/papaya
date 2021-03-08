interface IMyClassList {
    profile_image: () => void;
    name: string;
    nickname: string;
    createdAt: number;
    status: string;
    memberNum: number;
    isUpdated: boolean;
    updatedDiffTime: string;
    is_bookmarked: number;
}

interface INotifyList {
    profile_image: () => void;
    name: string;
}

interface INotifyFeedList extends INotifyList {
    feedTit: string;
    writer: string;
    updatedDiffTime: string;
}

interface IFeedList {
    feedTit: string;
    profile_image: () => void;
    name: string;
    writer: string;
    updatedDiffTime: string;
    feedText: string[];
    feedType: string;
    feedViewer: number;
    comment: number;
}

export {IMyClassList, INotifyList, INotifyFeedList, IFeedList};