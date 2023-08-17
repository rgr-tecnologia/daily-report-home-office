import { FormDisplayMode } from "@microsoft/sp-core-library";
import { DailyReportDto } from "../../../interfaces/DailyReport";
import { JobItemDto } from "../../../interfaces/JobItem";
import { FormProps } from "./Form/Form.props";

type BaseWithOmit = Omit<FormProps, 'onSaveDraft' | 'onSaveAndSend' | 'onAddJobItem' | 'onSaveAndFinish'>

export interface DailyReportHomeOfficeProps extends BaseWithOmit {
    onSave: (data: DailyReportDto) => void
    items: JobItemDto[]
    displayMode: FormDisplayMode
}
