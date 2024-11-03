const router = require('express').Router();
const { getGfs } = require('../middleware/gridFsStorage');

router.get('/uploads/:filename', (req, res) => {
    const gfs = getGfs();
    if (!gfs) {
        return res.status(500).json({ message: 'GFS not initialized' });
    }

    gfs.find({ filename: req.params.filename }).toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'No files found' });
        }
        gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

module.exports = router;