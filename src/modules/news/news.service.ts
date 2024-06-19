import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class NewsService {
    private readonly apiKey = '3e3720c459ba464aae89142a5d5b8ff6';  // API Key
    private readonly apiUrl = 'https://newsapi.org/v2/top-headlines?category=health&language=en';
    private readonly logger = new Logger(NewsService.name);

    constructor(private readonly httpService: HttpService) {}

    async getNews() {
        this.logger.log('Fetching news...');
        try {
            const response = await lastValueFrom(
                this.httpService.get(`${this.apiUrl}&apiKey=${this.apiKey}`)
            );
            this.logger.log('News fetched successfully');
            return response.data;
        } catch (error) {
            this.logger.error('Error fetching news', error);
            throw error;
        }
    }
}