import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { GetDrugDtos } from './dtos/getDrug.dto';
import { DrugDetail } from './interfaces/drugs.interface';

@Injectable()
export class DrugService {
    constructor(private readonly httpService: HttpService) {}

    private async getMlPrediction(
        keluhan: string,
    ): Promise<{ category: string; drugs: string[] }> {
        const mlUrl = `${process.env.BACKENDML_URL}/predict`;
        const mlResponse = await lastValueFrom(
            this.httpService.post(mlUrl, { keluhan }),
        );

        return mlResponse.data;
    }

    private async fetchDrugDetails(drug: string): Promise<DrugDetail | null> {
        const url = `${process.env.HALODOCAPI_URL}/v1/buy-medicine/products/search/${drug}?page=1&per_page=1`;
        const response = await lastValueFrom(this.httpService.get(url));

        if (
            !response ||
            !response.data.result ||
            response.data.result.length === 0
        )
            return null;

        const detailUrl = `${process.env.HALODOCAPI_URL}/v1/buy-medicine/products/detail/${response.data.result[0].slug}`;
        const detailResponse = await lastValueFrom(
            this.httpService.get(detailUrl),
        );

        return {
            id: response.data.result[0].external_id,
            name: response.data.result[0].name,
            image_url: response.data.result[0].image_url,
            description: detailResponse.data.description,
        };
    }

    public async getDrugs(
        body: GetDrugDtos,
    ): Promise<{ category: string; drugs: DrugDetail[] }> {
        const { keluhan } = body;

        const mlPrediction = await this.getMlPrediction(keluhan);
        const { category, drugs } = mlPrediction;

        const results = await Promise.all(
            drugs.map((drug: string) => this.fetchDrugDetails(drug)),
        );

        return {
            category,
            drugs: results.filter((result) => result !== null) as DrugDetail[],
        };
    }
}
