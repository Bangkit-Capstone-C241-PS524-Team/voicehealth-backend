import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';

@Injectable()
export class NewsService {
  private readonly apiKey = '3e3720c459ba464aae89142a5d5b8ff6v';  // Ganti dengan API key News API Anda
  private readonly apiUrl = 'https://newsapi.org/v2/top-headlines?country=id&category=health&apiKey=3e3720c459ba464aae89142a5d5b8ff6';

  constructor(private readonly httpService: HttpService) {}

  getNews() {
    return this.httpService
      .get(`${this.apiUrl}&apiKey=${this.apiKey}`)
      .pipe(map(response => response.data));
  }
}
