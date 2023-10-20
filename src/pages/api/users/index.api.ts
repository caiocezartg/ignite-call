import { prisma } from "@/lib/prisma";
import { setCookie } from 'nookies'
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
        return res.status(400).json({ message: 'User already exists.' })
    }

    const user = await prisma.user.create({
        data: {
            name,
            username
        }
    })

    setCookie({ res }, '@ignite-call:user_id', user.id, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
    })

    return res.status(201).json(user)
}