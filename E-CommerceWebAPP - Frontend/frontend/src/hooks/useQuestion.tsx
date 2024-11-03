import { useCallback, useEffect, useState } from "react";
import { _delete, _get, _post } from "../utils/api";
import { postQuestionData, questionData } from "../types/QuestionType";
import { userData } from "../types/UserType";

interface useQuestionResult{
    questions: questionData[]| undefined;
    productQuestions: questionData[]| undefined;

    loading: boolean;
    fetchQuestionsByProduct: (productId: string) => Promise<void>;
    fetchQuestionsByUser: (userId: string) => Promise<void>;
    createQuestion: (question: postQuestionData) => Promise<questionData | undefined>;
    deleteQuestion: (questionId: string) => Promise<questionData | undefined>;
    setQuestions: React.Dispatch<React.SetStateAction<questionData[] | undefined>>;
    setProductQuestions: React.Dispatch<React.SetStateAction<questionData[] | undefined>>;

}

const useQuestion = (token: string, userId?: string,productId?: string): useQuestionResult => {
    const [questions, setQuestions] = useState<questionData[]| undefined>(undefined);
    const [productQuestions, setProductQuestions] = useState<questionData[]| undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchQuestionsByProduct = useCallback(async (productId: string) => {
        setLoading(true);
        try {
            const response = await _get(`/question/findQuestion/${productId}`, token);
            
            const res: questionData[] = response.questions;
            setProductQuestions(res);
        } catch (error: any) {
            console.log("Error fetching questions by product:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchQuestionsByUser = useCallback(async () => {
        setLoading(true);
       
        try {
            
            const response = await _get(`/question/findUserQuestion/${userId ? userId : 'admin'}`, token);
            const res: questionData[] = response.questions;
            
            setQuestions(res);
        } catch (error: any) {
            console.log("Error fetching questions by user:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);
    const deleteQuestion = useCallback(async (questionId: string) => {
        setLoading(true);
        try {
            const response = await _delete(`/question/deleteQuestion/`, {questionId}, token);
            const res: questionData = response.question;
            return res;
        } catch (error: any) {
            console.log("Error deleting question:", error);
        } finally {
            setLoading(false);
        }
    }
    , [token]);

    const createQuestion = useCallback(async (question: postQuestionData) => {
        setLoading(true);
        try {
            const response = await _post(`/question/addQuestion`, question, token);
            const res: questionData = response.question;
            setQuestions((prevQuestions) => (prevQuestions ? [res, ...prevQuestions] : [res]));
            return res;
        } catch (error: any) {
            console.log("Error creating question:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);
    useEffect(() => {
        if (productId) {
            fetchQuestionsByProduct(productId);
        }
    }, [productId]);

  
    useEffect(() => {
        if (userId || userId === "admin") {
            fetchQuestionsByUser();
        }
    }, [userId]);

    return {questions, setQuestions,productQuestions,setProductQuestions, loading, fetchQuestionsByProduct, fetchQuestionsByUser, createQuestion, deleteQuestion};
}

export default useQuestion;