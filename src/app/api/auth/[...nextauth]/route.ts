import { prisma } from '@/app/lib/prisma'
// import { session } from '@/app/lib/session'
import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

const authOption: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async signIn({ account, profile }){
            if(!profile?.email){
                throw new Error('No profile')
            }

            await prisma.user.upsert({
                where: {
                    email: profile.email,
                },
                create: {
                    email: profile.email,
                    name: profile.name,
                },
                update: {
                    name: profile.name,
                },
            });

            return true;
        },
        // async session({ session, user }: any) {
        //     session.user.id = user.id; // Attach user ID to session
        //     return session;
        // },
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOption)
export { handler as GET, handler as POST }