import { JobItemAsString } from "../JobList/JobList.props";

export interface ActionsColumnProps {
    isManager: boolean;
    isEmployee: boolean;
    status: string;
    item: JobItemAsString;
    onEdit?: (item: JobItemAsString) => void;
    onApprove: (item: JobItemAsString) => void;
    onReject: (item: JobItemAsString) => void;
}