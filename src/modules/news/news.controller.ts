import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { ResponseMessage } from '@/common/decorators/response.decorator';

@Controller('news')
@ApiTags('News')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Get()
    @HttpCode(200)
    @ResponseMessage('Success fetching news')
    async getNews() {
        return await this.newsService.getNews();
    }
}
