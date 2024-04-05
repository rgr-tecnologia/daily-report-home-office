import { JobItemDto } from "../../../../types/JobItem";
export interface ActionsColumnProps {
  isManager: boolean;
  isEmployee: boolean;
  status: string;
  item: JobItemDto;
  onEdit?: (item: JobItemDto) => void;
  onApprove: (item: JobItemDto) => void;
  onReject: (item: JobItemDto) => void;
  onDelete: (item: JobItemDto) => void;
}
