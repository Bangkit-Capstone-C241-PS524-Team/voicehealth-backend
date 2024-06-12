import { Controller, Get, UseGuards, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt';
import { NewsService } from './news.service';
import { ResponseMessage } from '@/common/decorators/response.decorator';

@Controller('news')
@ApiTags('News')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    @ResponseMessage('Success fetching news')
    async getNews() {
        return await this.newsService.getNews();
    }
}
