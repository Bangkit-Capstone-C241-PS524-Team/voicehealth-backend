import { ResponseMessage } from '@/common/decorators/response.decorator';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DrugService } from './drug.service';
import { GetDrugDtos } from './dtos/getDrug.dto';

@Controller('drug')
@ApiTags('Drug')
export class DrugController {
    constructor(private readonly modelService: DrugService) {}

    @Post()
    @HttpCode(200)
    @ResponseMessage('Success get drugs detail')
    async getModelResponse(@Body() drugs: GetDrugDtos) {
        const res = await this.modelService.getDrugs(drugs);
        return res;
    }
}
