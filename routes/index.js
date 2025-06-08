const express = require("express");
const Logs = require("../models/Logs");
const router = express.Router();

router.get('/logs', async (req, res) => {
    try {
        const { level, service, start, end, limit = 20, skip = 0 } = req.query;

        const filter = {};
        if (level) filter.level = level;
        if (service) filter.service = service;
        if (start || end) {
            filter.timestamp = {};
            if (start) filter.timestamp.$gte = new Date(start);
            if (end) filter.timestamp.$lte = new Date(end);
        }

        const logs = await Logs.find(filter).sort({ timestamp: -1 }).skip(Number(skip)).limit(Number(limit));
        return res.json(logs);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            message: "Internal Server Errors"
        })
    }
});

router.get('/stats', async (req, res) => {
    try {
        const seconds = parseInt(req.query.seconds) || 60;
        const since = new Date(Date.now() - seconds * 1000);

        const [levelCounts, totalCount] = await Promise.all([
            Logs.aggregate([
                { $match: { timestamp: { $gte: since } } },
                { $group: { _id: "$level", count: { $sum: 1 } } }
            ]),
            Logs.countDocuments({ timestamp: { $gte: since } })
        ]);

        const counts = { INFO: 0, WARN: 0, ERROR: 0 };
        levelCounts.forEach(item => counts[item._id] = item.count);
        const errorRate = totalCount > 0 ? ((counts.ERROR / totalCount) * 100).toFixed(2) : 0;

        return res.json({ counts, totalCount, errorRate });
    }

    catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            message: "Internal Server Errors"
        })
    }
});



module.exports = router;