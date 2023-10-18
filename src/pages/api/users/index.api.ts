import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if(req.method !== 'POST'){
        return res.status(405).end()
    }

    const { name, username } = req.body

    const userAlreadyExists = await prisma.user.findUnique({
        where: {
            username
        }
    })

    if (userAlreadyExists){
        return res.status(500).json({ message: 'User already exists.' })
    }

    const user = await prisma.user.create({
        data: {
            name,
            username
        }
    })

    return res.status(201).json(user)
}