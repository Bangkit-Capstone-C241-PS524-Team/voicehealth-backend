import { ResponseMessage } from '@/common/decorators/response.decorator';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt';
import { DrugService } from './drug.service';

@Controller('drug')
@ApiTags('Drug')
export class DrugController {
    constructor(private readonly modelService: DrugService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    @ResponseMessage('Success get history')
    async getModelResponse(@Query('search') search: string) {
        const res = await this.modelService.getDrugs(search);
        return res;
    }

    @Get('detail')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    @ResponseMessage('Success get history')
    async getDetailDrugs(@Query('slug') slug: string) {
        const res = await this.modelService.getDetailDrugs(slug);
        return res;
    }
}
