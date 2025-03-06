import { prisma } from '@/app/lib/prisma'

export async function POST(request: Request) {
    const { profile } = await request.json()

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
}