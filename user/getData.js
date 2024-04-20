import express from "express";
import { PrismaClient } from '@prisma/client';
import { verifyAccessToken } from "../middleware/auth";

const prisma = new PrismaClient();
const router = express.Router();

router.get('/getUser', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
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


//víc specific request
router.get('/getUserName/', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
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

export default router;