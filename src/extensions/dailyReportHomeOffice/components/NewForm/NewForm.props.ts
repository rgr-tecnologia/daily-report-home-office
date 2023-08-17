import { JobItemDto } from "../../../../interfaces/JobItem";

export interface NewFormProps {
    onAddJobItem: (jobItem: JobItemDto) => void;
}