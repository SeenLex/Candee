const Question = require('../models/Question');
const { default: mongoose } = require('mongoose');

exports.addQuestion = async (req, res) => {  
        const newQuestion = new Question({
            user: req.user.id,
            product: req.body.product,
            content: req.body.content,
        });

        try {   
            
            const savedQuestion = await newQuestion.save();
            const populatedQuestion = await Question.findById(savedQuestion._id).populate('user', 'name role');
            res.status(200).json({ message: 'Question added', question: populatedQuestion });
        } catch (err) {
            res.status(500).json({ message: 'Error adding question', error: err.message });
        }
}
exports.updateQuestion = async (req, res) => {
    try {
        const updatedQuestion = await Question.findByIdAndUpdate(req
            .body.id, {
            $set: req.body,
        }, { new: true });
        if (!updatedQuestion) {
            res.status(404).json({ message: "Question not found" });
            return;
        }
        res.status(200).json({ message: "Question has been updated", question:updatedQuestion });

    } catch (err) {
        res.status(500).json({ message: "Error updating question", error: err.message });
    }
}
exports.deleteQuestion = async (req, res) => {
        try {
            const questionId = req.body.questionId;
            const result = await Question.findByIdAndDelete(questionId);
            await mongoose.model('Reply').deleteMany({questionId});
            if (!result) {
                res.status(404).json({ message: "Question not found" });
                return;
            }
            res.status(200).json({ message: "Question has been deleted" });
        }
        catch (err) {
            res.status(500).json({ message: "Error deleting question", error: err.message });
        }
}
exports.getQuestionByProduct = async (req, res) => {
    try { 
        const questions = await Question.find({ product: req.params.productId })
            .populate({path: 'replies', populate: {path: 'user', select: 'name role'}}).populate('user', 'name role');
        if(!questions){
            return res.status(404).json({ message: 'No questions found for this product' });
        }
        const processedQuestions = questions.map(question => ({
            id: question._id,
            content: question.content,
            user: question.user,
            replies: question.replies.map(reply => ({
                id: reply._id,
                content: reply.content,
                user: reply.user,
                isDistributor: reply.isDistributor,
                createdAt: reply.createdAt,
                updatedAt: reply.updatedAt
            })),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt

        }));
        res.status(200).json({ message: 'Questions found',
            questions: processedQuestions });
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ message: 'Error fetching questions', error: err.message });
    }
}
exports.getQuestionByUser = async (req, res) => {
    try {
        console.log(req.user.id);
        console.log(req.params.userId);
        let questions = null;
        
        if(req.user.role === "admin"){

            questions = await Question.find().populate("user", "name role").populate("product","name images").populate({path: 'replies', populate: {path: 'user', select: 'name role'}});
        
        }
        if(req.user.role === "customer" && req.user.id === req.params.userId){
            questions = await Question.find({ user: req.params.userId }).populate({path: 'replies', populate: {path: 'user', select: 'name role'}}).populate('user', 'name role').populate('product','name images');
        }
        if((req.user.role === "customer" && req.user.id !== req.params.userId)){
            return res.status(500).json({ message: "Unauthorized" });
        }
        if (!questions) {
            return res.status(404).json({ message: 'No questions found for this user' });
        }
        const processedQuestions = questions.map(question => ({
            id: question._id,
            content: question.content,
            user: question.user,
            product: question.product,
            replies: question.replies.map(reply => ({
                id: reply._id,
                content: reply.content,
                user: reply.user,
                isDistributor: reply.isDistributor,
                createdAt: reply.createdAt,
                updatedAt: reply.updatedAt
            })),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt
        }));
        res.status(200).json({ message: 'Questions found',
            questions: processedQuestions });
        
    } catch (err) {
        res.status(500).json({ message: 'Error fetching questions', error: err.message });
    }
}

