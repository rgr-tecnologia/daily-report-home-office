import { JobItemStatus } from "../enums/JobItemStatus";

export interface ResponseJobItem {
    Id: number;
    Title: string;
    Description: string;
    Status: JobItemStatus;
    HoraExtra: boolean;
    DailyReportHomeOfficeId: number;
    QuantidadeHoras: number ;
    HomeOffice: boolean;
    HoraInicio: string;
    HoraFim: string;
}

export interface JobItemDto {
    Id?: number;
    Title: string;
    Description: string;
    Status: JobItemStatus;
    HoraExtra: boolean;
    DailyReportHomeOfficeId: number;
    QuantidadeHoras: number ;
    HomeOffice: boolean;
    HoraInicio: Date;
    HoraFim: Date;
}