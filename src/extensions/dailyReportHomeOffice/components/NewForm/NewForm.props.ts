import { JobItemDto } from "../../../../interfaces/JobItem";

export interface NewFormProps {
    onSubmit: (jobItem: JobItemDto) => void;
    onUpdate: (jobItem: JobItemDto) => void;
    onDataChange: (jobItem: JobItemDto) => void;
    currentItem: JobItemDto;
}