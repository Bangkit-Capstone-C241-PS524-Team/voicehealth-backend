import { PrismaService } from '@/providers/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHistoryDto } from './dtos/createHistory.dto';
import { AuthService } from '../auth/auth.service';
import { DrugDetail } from '../drug/interfaces/drugs.interface';

@Injectable()
export class historyService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly authService: AuthService,
    ) {}

    async getHistoryByUser(id: string) {
        const user = await this.authService.findOne(id);

        const history = await this.prismaService.history.findMany({
            where: { user_id: user.id },
        });

        return history;
    }

    async createHistoryEntry(
        userId: string,
        keluhan: string,
        category: string,
        drugs: DrugDetail[],
    ) {
        return this.prismaService.history.create({
            data: {
                user_id: userId,
                keluhan,
                category,
                drugs,
            },
        });
    }

    async deleteHistory(historyId: string, userId: string) {
        const history = await this.prismaService.history.findUnique({
            where: { id: historyId },
        });

        if (!history) {
            throw new NotFoundException('History not found');
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) throw new NotFoundException('User not found');

        return await this.prismaService.history.delete({
            where: { id: historyId },
        });
    }
}
