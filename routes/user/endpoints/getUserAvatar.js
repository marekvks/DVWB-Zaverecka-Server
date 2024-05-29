import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getUserAvatar = async (req, res) => {

    try {
        const user = await prisma.user.findFirst({
            where: {
                id_user: req.params.id
            }
        })
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const avatarPath = user.avatarPath;

        if (!avatarPath) {
            return res.status(404).json({ error: 'Avatar not found' });
        }

        const fullPath = path.join(__dirname, 'uploads', avatarPath);

        res.sendFile(fullPath, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to send file' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default getUserAvatar;