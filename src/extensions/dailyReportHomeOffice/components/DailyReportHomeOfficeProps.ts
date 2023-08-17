import { FormDisplayMode } from "@microsoft/sp-core-library";
import { DailyReportDto } from "../../../interfaces/DailyReport";
import { FormProps } from "./Form/Form.props";

type BaseWithOmit = Omit<FormProps, 'onSaveDraft' | 'onSaveAndSend' | 'onAddJobItem' | 'onSaveAndFinish' | 'status'>

export interface DailyReportHomeOfficeProps extends BaseWithOmit {
    onSave: (data: DailyReportDto) => void
    formData: DailyReportDto
    displayMode: FormDisplayMode
}
