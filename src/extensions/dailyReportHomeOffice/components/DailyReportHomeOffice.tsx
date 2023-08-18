import * as React from 'react';
import { DailyReportHomeOfficeProps } from './DailyReportHomeOfficeProps';
import { Stack } from '@fluentui/react';
import { JobList } from './JobList/JobList';
import { JobItemDto } from '../../../interfaces/JobItem';
import { PrimaryButton, Text } from 'office-ui-fabric-react';
import { DailyReportDto } from '../../../interfaces/DailyReport';
import { Form } from './Form/Form';
import { NewForm } from './NewForm/NewForm';

export function DailyReportHomeOffice(props: DailyReportHomeOfficeProps): JSX.Element {
  const {
    onSave,
    onSaveSecondary,
    employee,
    manager,
    isManager,
    isEmployee,
    formData,
    items
  } = props

  const {
    JobDate,
    Status
  } = formData

  const baseItem: JobItemDto = {
    Title: '',
    Description: '',
    Status: 'In review',
    HoraExtra: false,
    HoraInicio: new Date(),
    HoraFim: new Date(),
    DailyReportHomeOfficeId: null,
    QuantidadeHoras: 0,
    HomeOffice: false
  }

  const [jobItems, setJobItems] = React.useState<JobItemDto[]>(items)
  const [currentItem, setCurrentItem] = React.useState<JobItemDto>(baseItem)
  const [errorMessage, setErrorMessage] = React.useState<string>('')

  const findIndex = (array: JobItemDto[], criteria: (item: JobItemDto) => boolean): number => {
    let index = -1;

    for (let i = 0; i < array.length; i++) {
      if (criteria(array[i])) {
        index = i;
      }
    }

    return index
  }

  const validateJobItem = (jobItem: JobItemDto): boolean => {
    if(jobItem.HoraExtra === false && jobItem.HomeOffice === false) {
      setErrorMessage('Please, selecte Home office or Overtime')
      return false
    }
    else if(!jobItem.Title || !jobItem.Description) {
      setErrorMessage('Please, fill the Title and Description fields')
      return false
    }

    return true
  }

  const validateForm = (): boolean => {
    if(jobItems.length === 0) {
      setErrorMessage('Add at least one job description')
      return false
    }
    setErrorMessage('')
    return true
  }

  const onAddJobItem = (jobItem: JobItemDto): void => {
    if(!validateJobItem(jobItem)) return
    const {
      HoraInicio,
      HoraFim
    } = jobItem

    const itemToAdd = ({
        ...jobItem,
        QuantidadeHoras: Math.abs(HoraFim.getTime() - HoraInicio.getTime()) / 1000 / 3600
    })

    setJobItems([...jobItems, itemToAdd])
    setCurrentItem(baseItem)
    onSaveSecondary(itemToAdd) 

  }

  const onUpdateJobItem = (jobItem: JobItemDto): void => {
    if(!validateJobItem(jobItem)) return
    const {
      HoraInicio,
      HoraFim
    } = jobItem

    const itemToAdd = ({
        ...jobItem,
        QuantidadeHoras: Math.abs(HoraFim.getTime() - HoraInicio.getTime()) / 1000 / 3600
    })

    const index = findIndex(jobItems, (item: JobItemDto) => item.Id === jobItem.Id)
    const result = [...jobItems]

    result[index] = itemToAdd

    setJobItems([...result])
    setCurrentItem(baseItem)
    onSaveSecondary(itemToAdd)
  }


  const onSaveAndSend = (): void => {
    const formIsValid = validateForm()

    if(!formIsValid) return
    
    const FormData: DailyReportDto = {
      ...formData,
      Status: 'In review',
      EmployeeId: employee.Id,
      ManagerId: manager.Id,
    }

    onSave(FormData, true)
  }

  const onSaveAndFinish = (): void => {
    const FormData: DailyReportDto = {
      ...formData,
      Status: 'Reviewed',
      EmployeeId: employee.Id,
      ManagerId: manager.Id,
    }

    onSave(FormData, true)
  }

  const opApprove = (jobItem: JobItemDto): void => {
    const dataToUpdate = {
      ...jobItem,
      Status: 'Approved' as const,
    }

    const index = findIndex(jobItems, (item: JobItemDto) => item.Id === jobItem.Id)
    const result = [...jobItems]

    result[index] = dataToUpdate

    setJobItems([...result])

    onSaveSecondary(dataToUpdate)
  }

  const onReject = (jobItem: JobItemDto): void => {
    const dataToUpdate = {
      ...jobItem,
      Status: 'Rejected'  as const,
    }

    const index = findIndex(jobItems, (item: JobItemDto) => item.Id === jobItem.Id)
    const result = [...jobItems]

    result[index] = dataToUpdate

    setJobItems([...result])

    onSaveSecondary(dataToUpdate)
  }

  const onEdit = (item: JobItemDto): void => {
    setCurrentItem(item)
  }

  return (
    <Stack 
      tokens={{childrenGap: 'm'}}
      styles={{
        root: {
          alignItems: 'center',
        }
      }}>
      <Stack 
        tokens={{childrenGap: 'm'}}
        styles={{  
          root: {
            maxWidth: '40vw',
          }
        }}>
        <Text styles={{
          root: {
            alignSelf: 'flex-start',
          }
        }} 
        color='#0078D4' 
        variant='xLarge'>Daily report</Text>
        <Text style={{color: 'red', fontWeight: 'bold'}}> Warning: Correctly record activities 
        to ensure the Home Office benefit for the next week. </Text>
        <Form 
          date={JobDate}
          employee={employee}
          manager={manager}/>

        <Text style={{color: 'red'}}>{errorMessage}</Text>
        {
          isEmployee && formData.Status === 'Draft' && (
              <>
                  <NewForm 
                    onSubmit={onAddJobItem}
                    onUpdate={onUpdateJobItem}
                    currentItem={currentItem}
                    onDataChange={setCurrentItem}/>
                  <Stack tokens={{childrenGap: 'm'}} horizontal>
                      <PrimaryButton onClick={onSaveAndSend} text='Send to review'/>
                  </Stack>
              </>

          ) ||
          isManager && formData.Status === 'In review' && (
              <Stack tokens={{childrenGap: 'm'}} style={{alignItems: "flex-end"}} horizontal>
                  <PrimaryButton onClick={onSaveAndFinish} text='Finish review'/>
              </Stack>
          )
        }
        
        <JobList
          items={jobItems}
          isManager={isManager}
          isEmployee={isEmployee}
          status={Status}
          onApprove={opApprove}
          onReject={onReject}
          onEdit={onEdit}/>
      </Stack>
    </Stack>
  );
}
