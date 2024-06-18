import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { GetDrugDtos } from './dtos/getDrug.dto';
import { DrugDetail } from './interfaces/drugs.interface';
import { AuthService } from '../auth/auth.service';
import { historyService } from '../history/history.service';

@Injectable()
export class DrugService {
    private readonly logger = new Logger(DrugService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly authService: AuthService,
        private readonly historyService: historyService,
    ) {}

    private async getMlPrediction(
        keluhan: string,
    ): Promise<{ category: string; drugs: string[] }> {
        const mlUrl = `${process.env.BACKENDML_URL}/predict`;
        this.logger.debug(
            `Requesting ML prediction from ${mlUrl} with keluhan: ${keluhan}`,
        );

        try {
            const mlResponse = await lastValueFrom(
                this.httpService.post<{ category: string; drugs: string[] }>(
                    mlUrl,
                    { keluhan },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    },
                ),
            );
            this.logger.debug(
                `ML prediction response: ${JSON.stringify(mlResponse.data)}`,
            );
            return mlResponse.data;
        } catch (error) {
            this.logger.error(
                `Error requesting ML prediction: ${error.message}`,
            );
            throw new HttpException(
                'Failed to get prediction from ML service',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private async fetchDrugDetailsFromHalodoc(drug: string): Promise<DrugDetail | null> {
        const encodedDrug = encodeURIComponent(drug);
        const halodocUrl = `${process.env.HALODOCAPI_URL}/v1/buy-medicine/products/search/${encodedDrug}?page=1&per_page=1`;

        this.logger.debug(`Fetching drug details from Halodoc: ${halodocUrl}`);

        try {
            const response = await lastValueFrom(this.httpService.get<{ result: any[] }>(halodocUrl));
            this.logger.debug(`Halodoc response: ${JSON.stringify(response.data)}`);

            if (response.data.result && response.data.result.length > 0) {
                const detailUrl = `${process.env.HALODOCAPI_URL}/v1/buy-medicine/products/detail/${response.data.result[0].slug}`;
                this.logger.debug(`Fetching detailed drug info from Halodoc: ${detailUrl}`);

                const detailResponse = await lastValueFrom(
                    this.httpService.get<{ description: string }>(detailUrl),
                );

                return {
                    id: response.data.result[0].external_id,
                    name: response.data.result[0].name,
                    image_url: response.data.result[0].image_url,
                    description: detailResponse.data.description,
                };
            } else {
                this.logger.warn(`No results found for ${drug} on Halodoc`);
                return null;
            }
        } catch (error) {
            this.logger.error(`Error fetching drug details from Halodoc for ${drug}: ${error.message}`);
            return null;
        }
    }

    private async fetchDrugDetailsFromAlodokter(drug: string): Promise<DrugDetail | null> {
        const encodedDrug = encodeURIComponent(drug);
        const alodokterUrl = `https://www.alodokter.com/api/aloshop/products?term=${encodedDrug}`;

        this.logger.debug(`Fetching drug details from Alodokter: ${alodokterUrl}`);

        try {
            const response = await lastValueFrom(this.httpService.get<{ result: { data: any[] } }>(alodokterUrl));
            this.logger.debug(`Alodokter response: ${JSON.stringify(response.data)}`);

            if (response.data.result && response.data.result.data && response.data.result.data.length > 0) {
                const product = response.data.result.data[0];
                return {
                    id: product.id,
                    name: product.name,
                    image_url: product.thumbnail_image || '',
                    description: product.generic?.name || '',
                };
            } else {
                this.logger.warn(`No results found for ${drug} on Alodokter`);
                return null;
            }
        } catch (error) {
            this.logger.error(`Error fetching drug details from Alodokter for ${drug}: ${error.message}`);
            return null;
        }
    }

    private async fetchDrugDetails(drug: string): Promise<DrugDetail[]> {
        const halodocDetail = await this.fetchDrugDetailsFromHalodoc(drug);
        const alodokterDetail = await this.fetchDrugDetailsFromAlodokter(drug);
        return [halodocDetail, alodokterDetail].filter(detail => detail !== null) as DrugDetail[];
    }

    public async getDrugs(body: GetDrugDtos, id: string) {
        const { keluhan } = body;
        const user = await this.authService.findOne(id);

        let mlPrediction;
        try {
            mlPrediction = await this.getMlPrediction(keluhan);
        } catch (error) {
            throw new HttpException(
                'Gagal untuk predict keluhan',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        const { category, drugs } = mlPrediction;

        const results = await Promise.all(
            drugs.map((drug: string) => this.fetchDrugDetails(drug)),
        );

        const filteredResults = results.flat().filter(
            (result) => result !== null,
        ) as DrugDetail[];

        await this.historyService.createHistoryEntry(
            user.id,
            keluhan,
            category,
            filteredResults,
        );

        let drugsOutput;
        if (filteredResults.length === 0) {
            drugsOutput = 'Gagal mendapatkan obat yang cocok';
        } else drugsOutput = filteredResults;

        return {
            category,
            drugs: drugsOutput,
        };
    }
}
