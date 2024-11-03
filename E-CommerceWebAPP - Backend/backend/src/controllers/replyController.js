const Reply = require("../models/Reply");

exports.addReply = async (req, res) => {
    const newReply = new Reply({
        user: req.user.id,
        questionId: req.body.questionId,
        content: req.body.content,
    });
    try {
        const savedReply = await newReply.save();
        const populatedReply = await Reply.findById(savedReply._id).populate('user', 'name role');
        res.status(200).json({ message: 'Reply added', reply: populatedReply });
    } catch (err) {
        res.status(500).json({ message: 'Error adding reply', error: err.message });
    }

}
exports.deleteReply = async (req, res) => {
    try {
        const result = await Reply.findByIdAndDelete
            (req.body.replyId);
        console.log(result);
        if (!result) {
            res.status(404).json({ message: "Reply not found" });
            return;
        }
        res.status(200).json({ message: "Reply has been deleted" });
    }catch (err) {
        res.status(500).json({ message: "Error deleting reply", error: err.message });
    }
}