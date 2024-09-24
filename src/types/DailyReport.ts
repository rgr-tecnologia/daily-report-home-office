import { StatusDailyReport } from "../enums/StatusDailyReport";
import { Profile } from "./Profile";

export type DailyReport = {
  Id: number;
  Employee: Profile;
  Status: StatusDailyReport;
  JobDate: Date;
  ManagerUserProfileId: number;
  DataRetroativa: boolean;
  JustificativaRetroativa: string;
  DataRetroativaTexto: Date | string;
};

export type DailyReportCreate = {
  EmployeeId: number;
  Status: StatusDailyReport;
  JobDate: string;
  ManagerUserProfileId: number;
  JustificativaRetroativa: string;
  DataRetroativa: boolean;
  DataRetroativaTexto: Date;
};

export type DailyReportUpdate = {
  Status: StatusDailyReport;
  DataRetroativa: boolean;
  JustificativaRetroativa: string;
  DataRetroativaTexto: Date;
  
};

export type DailyReportResponse = {
  Id: number;
  EmployeeId: number;
  Status: StatusDailyReport;
  JobDate: string;
  ManagerUserProfileId: number;
  DataRetroativa: boolean;
  JustificativaRetroativa: string;
  DataRetroativaTexto: Date;
  
};
