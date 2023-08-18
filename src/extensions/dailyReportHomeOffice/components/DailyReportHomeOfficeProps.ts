import { FormDisplayMode } from "@microsoft/sp-core-library";
import { DailyReportDto } from "../../../interfaces/DailyReport";
import { FormProps } from "./Form/Form.props";
import { JobItemDto } from "../../../interfaces/JobItem";

export interface DailyReportHomeOfficeProps extends FormProps {
    onSave: (data: DailyReportDto, reload: boolean) => void
    onSaveSecondary: (data: JobItemDto) => void
    displayMode: FormDisplayMode
    isEmployee: boolean
    isManager: boolean
    formData: DailyReportDto
    items: JobItemDto[]
}
