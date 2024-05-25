import express from "express";
import { PrismaClient } from '@prisma/client';
import { validateAccessToken } from "../../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

router.get('/getUser', validateAccessToken, async (req, res) => {
    const id = req.user.id;

    try {
        const user = await prisma.user.findFirst({
            where: {
                id_user: parseInt(id)
            }
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Failed to retrieve user:', error);
        res.status(500).send('Server error');
    }
});

router.post('/updateUser', validateAccessToken, async (req, res) => {
    const { firstName, username } = req.body;
    const userId = req.user.id;

    try {
        const updatedUser = await prisma.user.update({
            where: { id_user: userId },
            data: {
                firstName,
                username
            }
        });
        res.json(updatedUser);
    } catch (error) {
        console.error("Failed to update user:", error);
        res.status(500).send("An error occurred while updating the user.");
    }
});

export default router;