import { StatusDailyReport } from "../../../../enums/StatusDailyReport";
import { JobItemDto } from "../../../../interfaces/JobItem";

type JobItemAsString = {
    [K in keyof JobItemDto] : JobItemDto[K] extends Date? string: JobItemDto[K]
}

export interface JobListProps {
    items: JobItemAsString[];
    isManager: boolean;
    isEmployee: boolean;
    status: StatusDailyReport
}