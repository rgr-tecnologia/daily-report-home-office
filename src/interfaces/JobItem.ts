import { JobItemStatus } from "../enums/JobItemStatus";

export interface CreateResponseJobItem {
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
    "odata.etag": string
}

export interface GetResponseJobItem {
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
    "@odata.etag": string
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
    Tag?: string
}