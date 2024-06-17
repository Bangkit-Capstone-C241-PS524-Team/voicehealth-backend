import { ResponseMessage } from '@/common/decorators/response.decorator';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { historyService } from './history.service';
import { Token } from '@/common/decorators/token.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt';

@Controller('history')
@ApiTags('History')
export class HistoryController {
    constructor(private readonly historyService: historyService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    @ResponseMessage('Success get history')
    async get(@Token('id') id: string) {
        const res = await this.historyService.getHistoryByUser(id);
        return res;
    }

    @Delete(':historyId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(201)
    @ResponseMessage('Success delete history')
    async delete(
        @Param('historyId') historyId: string,
        @Token('id') userId: string,
    ) {
        const res = await this.historyService.deleteHistory(historyId, userId);
        return res;
    }
}
