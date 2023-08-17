import { StatusDailyReport } from "../../../../enums/StatusDailyReport";
import { Profile } from "../../../../interfaces/Profile";
import { NewFormProps } from "../NewForm/NewForm.props";

export interface FormProps extends NewFormProps {
    date: Date;
    manager: Profile;
    employee: Profile;
    isManager: boolean;
    isEmployee: boolean;
    status: StatusDailyReport;
    onSaveDraft: () => void;
    onSaveAndSend: () => void;
    onSaveAndFinish: () => void;
}