const User = require("../models/User.model");

const Session = require("../models/Session.model");

// GET PROFILE
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-passwordHash");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const { name, preferences } = req.body;

        // Build update object
        const updateData = {};
        if (name) updateData.name = name;
        if (preferences) updateData.preferences = preferences;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-passwordHash");

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

// SEARCH USERS
exports.searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);

        const users = await User.find({
            $or: [
                { name: { $regex: q, $options: "i" } },
                { email: { $regex: q, $options: "i" } }
            ]
        }).select("_id name email").limit(5);

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Search failed" });
    }
};

// COMPARE USERS
exports.compareUsers = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const targetUserId = req.params.userId;

        if (currentUserId === targetUserId) {
            return res.status(400).json({ error: "Cannot compare with yourself" });
        }

        const getAggregatedMetrics = async (uid) => {
            const sessions = await Session.find({ userId: uid });
            const defaultMetrics = {
                typingSpeed: 0,
                accuracyRate: 0,
                pasteRatio: 0,
                backspaceCount: 0,
                compileAttempts: 0,
                sessionDuration: 0
            };

            if (!sessions || sessions.length === 0) return defaultMetrics;

            const total = sessions.length;
            const sum = (key) => sessions.reduce((acc, s) => acc + (s[key] || 0), 0);

            const totalTyped = sum('typedChars');
            const totalDuration = sum('sessionTime');
            const totalMinutes = totalDuration / 60;

            // Recalculate WPM based on total chars and total time
            const avgSpeed = totalMinutes > 0
                ? Math.round((totalTyped / 5) / totalMinutes)
                : 0;

            const totalBackspaces = sum('backspaceCount');
            const totalPasteChars = sum('pasteCharacters');
            const avgDuration = Math.round(totalDuration / total);
            const avgCompileAttempts = Math.round(sum('saveCount') / total);

            const accuracy = totalTyped > 0
                ? Math.max(0, Math.round(100 - ((totalBackspaces / totalTyped) * 100)))
                : 100;

            const pasteRatio = totalTyped > 0
                ? Math.round((totalPasteChars / totalTyped) * 100)
                : 0;

            return {
                typingSpeed: avgSpeed,
                accuracyRate: accuracy,
                pasteRatio: pasteRatio,
                backspaceCount: Math.round(totalBackspaces / total),
                compileAttempts: avgCompileAttempts,
                sessionDuration: avgDuration
            };
        };

        const currentUserMetrics = await getAggregatedMetrics(currentUserId);
        const comparedUserMetrics = await getAggregatedMetrics(targetUserId);

        res.json({
            currentUser: currentUserMetrics,
            comparedUser: comparedUserMetrics
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Comparison failed" });
    }
};
