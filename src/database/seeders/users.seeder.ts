import { Prisma, PrismaClient } from '@prisma/client';

import { hashPassword } from '../../common/helpers/hash.helper';
import userData from './data/users.json';

const prisma = new PrismaClient();

export default async function usersSeeder() {
    for (const idx in userData) {
        const user = userData[idx];
        const userUpsert: Prisma.UserCreateInput = {
            name: user.name,
            username: user.username,
            email: user.email,
            password: await hashPassword(user.password),
            is_verified: user.is_verified,
        };

        await prisma.user.upsert({
            create: userUpsert,
            update: userUpsert,
            where: {
                email: userUpsert.email,
            },
        });
    }
    console.log('Users seeded successfully');
}
