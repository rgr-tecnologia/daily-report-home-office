import { FormDisplayMode } from "@microsoft/sp-core-library";
import {
  DailyReport,
  DailyReportCreate,
  DailyReportResponse,
  DailyReportUpdate,
} from "../../../types/DailyReport";
import { JobItemDto } from "../../../types/JobItem";

export interface DailyReportHomeOfficeProps {
  onCreate: (data: DailyReportCreate) => Promise<DailyReportResponse>;
  onUpdate: (
    id: number,
    data: DailyReportUpdate
  ) => Promise<DailyReportResponse>;
  onSaveSecondary: (data: JobItemDto) => Promise<JobItemDto>;
  onDeleteSecondary: (id: number) => Promise<void>;
  displayMode: FormDisplayMode;
  isEmployee: boolean;
  isManager: boolean;
  formData: DailyReport;
  items: JobItemDto[];
}
