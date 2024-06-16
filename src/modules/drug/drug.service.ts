import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { GetDrugDtos } from './dtos/getDrug.dto';

@Injectable()
export class DrugService {
    constructor(private readonly httpService: HttpService) {}

    async getDrugs(body: GetDrugDtos) {
        const results = await Promise.all(
            body.drugs.map(async (drug) => {
                const url = `https://magneto.api.halodoc.com/api/v1/buy-medicine/products/search/${drug}?page=1&per_page=1`;
                const response = await lastValueFrom(this.httpService.get(url));
                if (
                    !response ||
                    !response.data.result ||
                    response.data.result.length === 0
                )
                    return null;

                const detailUrl = `https://voicehealth-backend-lnk4vu7nua-et.a.run.app/api/drug/detail?slug=${response.data.result[0].slug}`;
                const detailResponse = await lastValueFrom(
                    this.httpService.get(detailUrl),
                );

                return {
                    id: response.data.result[0].external_id,
                    name: response.data.result[0].name,
                    image_url: response.data.result[0].image_url,
                    description: detailResponse.data.description,
                };
            }),
        );

        return results.filter((result) => result !== null);
    }
}
