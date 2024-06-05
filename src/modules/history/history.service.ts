import { PrismaService } from '@/providers/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHistoryDto } from './dtos/createHistory.dto';
import { AuthService } from '../auth/auth.service';

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

    async createHistory(id: string, createHistoryDto: CreateHistoryDto) {
        const user = await this.authService.findOne(id);

        const history = await this.prismaService.history.create({
            data: {
                ...createHistoryDto,
                user_id: user.id,
            },
        });

        return history;
    }

    async deleteHistory(id: string) {
        const history = await this.prismaService.history.findUnique({
            where: { id },
        });

        if (!history) {
            throw new NotFoundException('History not found');
        }

        return await this.prismaService.history.delete({
            where: { id },
        });
    }
}
