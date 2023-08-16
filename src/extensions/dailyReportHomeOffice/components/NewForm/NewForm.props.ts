import { JobItem } from "../../../../interfaces/JobItem";

export interface NewFormProps extends NewFormActions {
    onSaveDraft: () => void;
    onSaveAndSend: () => void;
    isEmployee: boolean;
    date: Date;
}

export interface NewFormActions {
    onAddJobItem: (jobItem: JobItem) => void;
}