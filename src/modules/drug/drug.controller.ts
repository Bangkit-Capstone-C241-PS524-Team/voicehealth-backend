import { ResponseMessage } from '@/common/decorators/response.decorator';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DrugService } from './drug.service';
import { GetDrugDtos } from './dtos/getDrug.dto';
import { JwtAuthGuard } from '@/common/guards/jwt';
import { Token } from '@/common/decorators/token.decorators';

@Controller('drug')
@ApiTags('Drug')
export class DrugController {
    constructor(private readonly modelService: DrugService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    @ResponseMessage('Berhasil mendapatkan obat dari keluhan')
    async getModelResponse(@Body() body: GetDrugDtos, @Token('id') id: string) {
        const res = await this.modelService.getDrugs(body, id);
        return res;
    }
}
