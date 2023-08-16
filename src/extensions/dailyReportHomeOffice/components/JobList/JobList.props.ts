import { JobItem } from "../../../../interfaces/JobItem";

type JobItemAsString = {
    [K in keyof JobItem] : JobItem[K] extends Date? string: JobItem[K]
}

export interface JobListProps {
    items: JobItemAsString[];
    isManager: boolean;
    isEmployee: boolean;
}