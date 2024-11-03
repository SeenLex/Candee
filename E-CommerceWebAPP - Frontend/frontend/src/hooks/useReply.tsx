import { useCallback, useState } from "react"
import { postReplyData, replyData } from "../types/ReplyType"
import { _post,_delete } from "../utils/api";

interface UseReplyResult{
    loading: boolean;
    createReply: (reply: postReplyData) => Promise<replyData | undefined>;
    deleteReply: (replyId: string) => Promise<void>;
}

const useReply = (token: string): UseReplyResult => {
    const [loading, setLoading] = useState(false);

    const createReply = useCallback(async (reply: postReplyData) => {
        setLoading(true);
        try{
            const response = await _post(`/reply/addReply`, reply, token);
            const res: replyData = response.reply;
            return res;
        }catch(error:any){
            console.log("Error creating reply:", error);
        }finally{
            setLoading(false);
        }
    }, [token]);
    const deleteReply = useCallback(async (replyId: string) => {
        setLoading(true);
        try{
           
            const response = await _delete('/reply/deleteReply', {replyId}, token);
            return response;
        }catch{
            console.log("Error deleting reply");
            
        }
        finally{
            setLoading(false);
        }
    }, [token]);

    return {createReply, loading,deleteReply};
}

export default useReply;