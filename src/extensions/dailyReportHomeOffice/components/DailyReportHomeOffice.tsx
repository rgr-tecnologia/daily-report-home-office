import * as React from 'react';
import { DailyReportHomeOfficeProps } from './DailyReportHomeOfficeProps';
import { Stack } from '@fluentui/react';
import { JobList } from './JobList/JobList';
import { JobItemDto } from '../../../interfaces/JobItem';
import { Text } from 'office-ui-fabric-react';
import { JobItemAsString, JobListProps } from './JobList/JobList.props';
import { DailyReportDto } from '../../../interfaces/DailyReport';
import { Form } from './Form/Form';

export function DailyReportHomeOffice(props: DailyReportHomeOfficeProps): JSX.Element {
  const {
    onSave,
    onSaveSecondary,
    employee,
    manager,
    isManager,
    isEmployee,
    formData,
  } = props

  const {
    JobDate,
    Status
  } = formData

  const [jobItems, setJobItems] = React.useState<JobItemDto[]>(formData.items)

  const onAddJobItem = (jobItem: JobItemDto): void => setJobItems([...jobItems, jobItem])

  const formatJobItemsDateProperties = (items: JobItemDto[]): JobListProps["items"] => {
    return items.map(item => ({
      ...item,
      HoraInicio: item.HoraInicio.toLocaleTimeString(),
      HoraFim: item.HoraFim.toLocaleTimeString(),
    }))
  }

  const onSaveDraft = (): void => {
    const FormData: DailyReportDto = {
      ...formData,
      Status: 'Draft',
      items: jobItems,
    }

    onSave(FormData)
  }

  const onSaveAndSend = (): void => {
    const FormData: DailyReportDto = {
      ...formData,
      Status: 'In review',
      items: jobItems
    }

    onSave(FormData)
  }

  const onSaveAndFinish = (): void => {
    const FormData: DailyReportDto = {
      ...formData,
      Status: 'Reviewed',
      items: jobItems
    }

    onSave(FormData)
  }

  const opApprove = (item: JobItemAsString): void => {
    onSaveSecondary({
      ...item,
      Status: 'Approved',
      HoraInicio: new Date(item.HoraInicio),
      HoraFim: new Date(item.HoraFim),
    })
  }

  const onReject = (item: JobItemAsString): void => {
    onSaveSecondary({
      ...item,
      Status: 'Rejected',
      HoraInicio: new Date(item.HoraInicio),
      HoraFim: new Date(item.HoraFim),
    })
  }

  return (
    <Stack>
      <Text style={{color: 'red'}}> Disclaimer genérico</Text>
      <Form 
        date={JobDate}
        employee={employee}
        manager={manager}
        isManager={isManager}
        isEmployee={isEmployee}
        status={Status}
        onAddJobItem={onAddJobItem} 
        onSaveDraft={onSaveDraft}
        onSaveAndSend={onSaveAndSend}
        onSaveAndFinish={onSaveAndFinish}/>
      <JobList
        items={formatJobItemsDateProperties(jobItems)}
        isManager={isManager}
        isEmployee={isEmployee}
        status={Status}
        onApprove={opApprove}
        onReject={onReject}/>
    </Stack>
  );
}
