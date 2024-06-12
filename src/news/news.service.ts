import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class NewsService {
  private readonly apiKey = 'API_KEY';  // API Key
  private readonly apiUrl = 'https://newsapi.org/v2/top-headlines?country=id&category=health';
  private readonly logger = new Logger(NewsService.name);

  constructor(private readonly httpService: HttpService) {}

  getNews(): Observable<any> {
    this.logger.log('Fetching news...');
    return this.httpService
      .get(`${this.apiUrl}&apiKey=${this.apiKey}`)
      .pipe(
        map(response => {
          this.logger.log('News fetched successfully');
          return response.data;
        }),
        catchError(error => {
          this.logger.error('Error fetching news', error);
          return throwError(error);
        })
      );
  }
}
