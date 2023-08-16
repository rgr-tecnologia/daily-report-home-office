import { StatusDailyReport } from "../enums/StatusDailyReport";
import { JobItem } from "./JobItem";

export interface DailyReportFormData {
    Id: number;
    EmployeeId: number;
    ManagerId: number;
    Status: StatusDailyReport;
    items: JobItem[];
}