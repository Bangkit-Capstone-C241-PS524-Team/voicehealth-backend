import { PrismaService } from '@/providers/prisma';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class DrugService {
    constructor(
        private readonly httpService: HttpService,
    ) {}

    async getDrugs(search: string) {
        const url = `https://magneto.api.halodoc.com/api/v1/buy-medicine/products/search/${search}?page=1&per_page=1`;
        const response = await lastValueFrom(this.httpService.get(url));
        return response.data;
    }

    async getDetailDrugs(slug: string) {
        const url = `https://magneto.api.halodoc.com/api/v1/buy-medicine/products/detail/${slug}`;
        const response = await lastValueFrom(this.httpService.get(url));
        return response.data;
    }
}
