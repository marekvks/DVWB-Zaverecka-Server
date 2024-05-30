import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const add = async (req, res) => {
    const { firstName, lastName, username, email } = req.body;
    const userId = req.user.id;

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id_user: userId
            },
            data: {
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email
            }
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Failed to update user:", error);
        
        if (error.code === 'P2002' && error.meta && error.meta.target.includes('username')) {
            res.status(400).json({ message: "Username already exists. Please choose a different username." });
        } else {
            res.status(500).json({ message: "An unexpected error occurred." });
        }
    }
};

export default add;