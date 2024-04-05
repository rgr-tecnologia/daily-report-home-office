import { JobItemDto } from "../../../../types/JobItem";

export interface NewFormProps {
  onSubmit: (jobItem: JobItemDto) => void;
  onUpdate: (jobItem: JobItemDto) => void;
  onDataChange: (jobItem: JobItemDto) => void;
  currentItem: JobItemDto;
}
