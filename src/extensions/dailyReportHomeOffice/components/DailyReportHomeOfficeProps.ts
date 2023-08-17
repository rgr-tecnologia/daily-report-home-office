import { FormDisplayMode } from "@microsoft/sp-core-library";
import { DailyReportDto } from "../../../interfaces/DailyReport";
import { FormProps } from "./Form/Form.props";
import { JobItemDto } from "../../../interfaces/JobItem";

type BaseWithOmit = Omit<FormProps, 'onSaveDraft' | 'onSaveAndSend' | 'onAddJobItem' | 'onSaveAndFinish' | 'status'>

export interface DailyReportHomeOfficeProps extends BaseWithOmit {
    onSave: (data: DailyReportDto) => void
    onSaveSecondary: (data: JobItemDto) => void
    formData: DailyReportDto
    displayMode: FormDisplayMode
}
