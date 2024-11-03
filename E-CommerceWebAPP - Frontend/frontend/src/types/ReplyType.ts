import { reviewUserData } from "./UserType";

interface replyData{
    id: string;
    user: reviewUserData;
    content: string;
    questionId: string;
    createdAt: string;
    updatedAt: string;
}
interface postReplyData{
    questionId: string;
    content: string;
}
export type {replyData, postReplyData};