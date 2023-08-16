import { FormDisplayMode } from "@microsoft/sp-core-library";
import { DailyReportFormData } from "../../../interfaces/DailyReportFormData";
import { JobItem } from "../../../interfaces/JobItem";
import { FormProps } from "./Form/Form.props";

type BaseWithOmit = Omit<FormProps, 'onSaveDraft' | 'onSaveAndSend' | 'onAddJobItem'>

export interface DailyReportHomeOfficeProps extends BaseWithOmit {
    onSave: (data: DailyReportFormData) => void
    items: JobItem[]
    displayMode: FormDisplayMode
}
