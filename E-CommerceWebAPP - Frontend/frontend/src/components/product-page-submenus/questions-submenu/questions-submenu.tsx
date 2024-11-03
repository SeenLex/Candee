import React, { useEffect, useState } from "react";
import "./questions-submenu.css";
import {formatDateTime} from "../../../utils/formatDataTime.ts";
import useQuestion from "../../../hooks/useQuestion.tsx";
import QuestionModal from "../../modals/question-modal/question-modal.tsx";
import { postQuestionData } from "../../../types/QuestionType.ts";
import useReply from "../../../hooks/useReply.tsx";
import Spinner from "../../spinner/spinner.tsx";

const QuestionsSubmenu = ({productId, token, user}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReplyOpen, setIsReplyOpen] = useState({});
    const [replyContent, setReplyContent] = useState({});
    const [expandedReplies, setExpandedReplies] = useState({});

    const {loading: questionsLoading, productQuestions, fetchQuestionsByProduct, createQuestion,setProductQuestions} = useQuestion(token,user.id,productId);
    const {createReply, loading: replyLoading} = useReply(token);

    useEffect(() => {
      fetchQuestionsByProduct(productId);
    }, [fetchQuestionsByProduct, productId]);

    const handleAddQuestion = async (question: {content: string}) => {
        const newQuestion: postQuestionData = {
          user: user,

          ...question,
          product: productId,
          createdAt: new Date().toISOString(),
          replies: [],
        };
        await createQuestion(newQuestion);
      

        setProductQuestions([...productQuestions, newQuestion]);
     
    };

    const toggleReply = (questionId) => {
        setIsReplyOpen((prev) => ({...prev, [questionId]: !prev[questionId]}));
    };

    const handleReply = (e, questionId) => {
        setReplyContent((prev) => ({...prev, [questionId]: e.target.value}));
    };

    const toggleExpandedReplies = (questionId) => {
        setExpandedReplies((prev) => ({...prev, [questionId]: !prev[questionId]}));
    }

    const handleReplySubmit = async (questionId) => {
        const content = replyContent[questionId];
        if(!content) return;
        const newReply = {
            content,
            questionId,
        };
        const addedReply = await createReply(newReply);
        if(addedReply){
          setIsReplyOpen((prev) => ({...prev, [questionId]: false}));
          setReplyContent((prev) => ({...prev, [questionId]: ""}));

          fetchQuestionsByProduct(productId);
        }
    };

    return(
        <div className="product-reviews-container">
          <div className="product-reviews-header">
            <h1>Questions about the product ({productQuestions?.length || "0"})</h1>
            <button onClick={() => setIsModalOpen(true)}>Add a question</button>
          </div>
          <div className="question-cells-container">
            {questionsLoading && <Spinner />}
            {productQuestions && productQuestions.map((question) => (
              <div key={question?.id} className="question-cell">
                <div className="question-container">
                    <div className="left-review-cell">
                        <h3>{question?.user.name || user?.name} asked:</h3>
                        <p>{question?.content}</p>
                    </div>
                    <div className="right-review-cell">
                      <div className="review-rating-container">
                      </div>
                      <p>on: <strong>{formatDateTime(question?.createdAt)}</strong></p>
                    </div>
                </div>
                <div className="replies-container">
                  {question?.replies && question?.replies.slice(0, expandedReplies[question.id] ? question.replies.length : 1)
                    .map((reply) => (
                      <div key={reply?.id} className="reply-cell">
                        <div className="left-review-cell">
                          <h3>{reply?.user.name || user?.name} replied:</h3>
                          <p>{reply?.content}</p>
                        </div>
                        <div className="right-review-cell">
                          <p>on: <strong>{formatDateTime(reply?.createdAt)}</strong></p>
                        </div>
                      </div>
                    ))}
                    {question?.replies && question?.replies.length > 1 && (
                      <button onClick={() => toggleExpandedReplies(question.id)}>
                        {expandedReplies[question.id] ? "Show less" : "Show more"}
                      </button>
                    )}
                </div>
                <div className="reply-container">
                  {isReplyOpen[question.id] ? (
                    <div className="reply-container">
                      <textarea value={replyContent[question.id]} onChange={(e) => handleReply(e, question.id)} placeholder="Reply to this question"></textarea>
                      <button onClick={() => handleReplySubmit(question.id)} disabled={replyLoading}>{replyLoading ? "Sending reply..." : "Submit reply"}</button>
                      <button onClick={() => toggleReply(question.id)}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => toggleReply(question.id)}>Reply</button>
                  )}
                </div>     
              </div>
            ))}
          </div>
          <QuestionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddQuestion}></QuestionModal>
        </div>
    );
}
export default QuestionsSubmenu;