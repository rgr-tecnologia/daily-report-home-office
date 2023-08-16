import { JobItemStatus } from "../enums/JobItemStatus";

export interface JobItem {
    Title: string;
    Description: string;
    Status: JobItemStatus;
    HoraExtra: boolean;
    HoraInicio: Date;
    HoraFim: Date;
    DailyReportHomeOfficeId: number;
    QuantidadeHoras: number ;
    HomeOffice: boolean;   
}