import bcrypt from 'bcrypt'
import {db} from './db.server'
import { createCookieSessionStorage, redirect } from 'remix'


export async function login({username, password}) {
    const user = await db.user.findUnique({
        where: {
            username
        }
    })

    if (!user) {
        return null 
    }

    const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)

    if(!isCorrectPassword) return null

    return user
}