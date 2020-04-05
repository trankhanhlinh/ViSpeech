import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportDto } from 'reports/dtos/reports.dto';
import { Repository } from 'typeorm';
import { GetStatisticsByProjectIdQuery } from '../impl/get-statistics-by-projectId.query';
import { ReportUtils } from 'utils/report.util';

@QueryHandler(GetStatisticsByProjectIdQuery)
export class GetStatisticsByProjectIdHandler implements IQueryHandler<GetStatisticsByProjectIdQuery> {
    constructor(
        @InjectRepository(ReportDto)
        private readonly repository: Repository<ReportDto>,
    ) {
    }

    async execute(query: GetStatisticsByProjectIdQuery): Promise<any> {
        Logger.log('Async GetStatisticsByProjectIdQuery...', 'GetStatisticsByProjectIdQuery');
        const { id, type } = query;

        try {
            const { fromDate, toDate, weekObj, monthObj, quarterObj, fromYear, toYear } = ReportUtils.getValidStatisticalQueryParams(query);
            let data = ReportUtils.prepareStatisticalData(type, fromDate, toDate, weekObj, monthObj, quarterObj, fromYear, toYear)
            const reports = await this.repository.find({ projectId: id });
            data = ReportUtils.getStatisticalData(type, data, reports);
            return data;
        } catch (error) {
            Logger.error(error, '', 'GetStatisticsByProjectIdQuery');
        }
    }
}