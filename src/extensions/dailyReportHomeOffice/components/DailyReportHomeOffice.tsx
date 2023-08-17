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
    employee, 
    date, 
    manager,
    items,
    onSave,
    isManager,
    isEmployee
  } = props

  const [jobItems, setJobItems] = React.useState<JobItemDto[]>(items)

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
      Id: null,
      EmployeeId: employee.Id,
      ManagerId: manager.Id,
      Status: 'Draft',
      items: jobItems
    }

    onSave(FormData)
  }

  const onSaveAndSend = (): void => {
    const FormData: DailyReportDto = {
      Id: null,
      EmployeeId: employee.Id,
      ManagerId: manager.Id,
      Status: 'In review',
      items: jobItems
    }

    onSave(FormData)
  }

  const onSaveAndFinish = (): void => {
    const FormData: DailyReportDto = {
      Id: null,
      EmployeeId: employee.Id,
      ManagerId: manager.Id,
      Status: 'Reviewed',
      items: jobItems
    }

    onSave(FormData)
  }

  return (
    <Stack>
      <Text style={{color: 'red'}}> Disclaimer genérico</Text>
      <Form 
        employee={employee}
        date={date}
        manager={manager}
        onAddJobItem={onAddJobItem} 
        onSaveDraft={onSaveDraft}
        onSaveAndSend={onSaveAndSend}
        onSaveAndFinish={onSaveAndFinish}
        isManager={isManager}
        isEmployee={isEmployee}/>
      <JobList
        items={formatJobItemsDateProperties(jobItems)}
        isManager={isManager}
        isEmployee={isEmployee}/>
    </Stack>
  );
}