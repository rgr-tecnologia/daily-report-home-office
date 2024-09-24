import { JobItemStatus } from "../enums/JobItemStatus";

export interface CreateJobItem {
  Title: string;
  Description: string;
  Status: JobItemStatus;
  HoraExtra: boolean;
  DailyReportHomeOfficeId: number;
  QuantidadeHoras: number;
  HomeOffice: boolean;
  HoraInicio: string;
  HoraFim: string;
  ObservacaoGestor: string;
  DataRetroativa: boolean;
  JustificativaRetroativa:string;
  DataRetroativaTexto: Date;
} 

export interface UpdateJobItem {
  Id: number;
  Title: string;
  Description: string;
  Status: JobItemStatus;
  HoraExtra: boolean;
  DailyReportHomeOfficeId: number;
  QuantidadeHoras: number;
  HomeOffice: boolean;
  HoraInicio: string;
  HoraFim: string;
  ObservacaoGestor: string;
  DataRetroativa: boolean;
  JustificativaRetroativa: string;
  DataRetroativaTexto: Date;
  
}

export interface JobItemDto {
  Id: number;
  Title: string;
  Description: string;
  Status: JobItemStatus;
  HoraExtra: boolean;
  DailyReportHomeOfficeId: number;
  QuantidadeHoras: number;
  HomeOffice: boolean;
  HoraInicio: Date;
  HoraFim: Date;
  ObservacaoGestor: string;
  DataRetroativa: boolean;
  JustificativaRetroativa:string;
  DataRetroativaTexto: Date | string;
  
}
