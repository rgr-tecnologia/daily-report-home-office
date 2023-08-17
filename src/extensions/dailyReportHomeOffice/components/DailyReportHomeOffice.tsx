import * as React from 'react';
import { DailyReportHomeOfficeProps } from './DailyReportHomeOfficeProps';
import { Stack } from '@fluentui/react';
import { JobList } from './JobList/JobList';
import { JobItemDto } from '../../../interfaces/JobItem';
import { Text } from 'office-ui-fabric-react';
import { JobListProps } from './JobList/JobList.props';
import { DailyReportDto } from '../../../interfaces/DailyReport';
import { Form } from './Form/Form';

export function DailyReportHomeOffice(props: DailyReportHomeOfficeProps): JSX.Element {
  const {
    onSave,
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
        status={Status}/>
    </Stack>
  );
}
