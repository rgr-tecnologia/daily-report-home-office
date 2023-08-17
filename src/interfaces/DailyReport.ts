import { StatusDailyReport } from "../enums/StatusDailyReport";
import { JobItemDto } from "./JobItem";

export interface DailyReportDto extends DailyReportItemDto {
    Id?: number;
    items?: JobItemDto[];
}

export interface GetDailyReportDto extends DailyReportItemDto {
    Id: number;
    CreatedAt: string;
}

interface DailyReportItemDto {
    EmployeeId: number;
    ManagerId: number;
    Status: StatusDailyReport;    
}