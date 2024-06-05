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
import { CreateHistoryDto } from './dtos/createHistory.dto';

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

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(201)
    @ResponseMessage('Success create history')
    async create(
        @Token('id') id: string,
        @Body() createHistoryDto: CreateHistoryDto,
    ) {
        const res = await this.historyService.createHistory(
            id,
            createHistoryDto,
        );
        return res;
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(201)
    @ResponseMessage('Success create history')
    async delete(@Param('id') id: string) {
        const res = await this.historyService.deleteHistory(id);
        return res;
    }
}
