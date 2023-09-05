import * as React from 'react';
import { DailyReportHomeOfficeProps } from './DailyReportHomeOfficeProps';
import { Stack } from '@fluentui/react';
import { JobList } from './JobList/JobList';
import { JobItemDto } from '../../../interfaces/JobItem';
import { DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton, Text, TextField } from 'office-ui-fabric-react';
import { DailyReportDto } from '../../../interfaces/DailyReport';
import { Form } from './Form/Form';
import { NewForm } from './NewForm/NewForm';

export function DailyReportHomeOffice(props: DailyReportHomeOfficeProps): JSX.Element {
  const {
    onSave,
    onSaveSecondary,
    onDeleteSecondary,
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
    HomeOffice: false,
    ObservacaoGestor: null
  }

  const [jobItems, setJobItems] = React.useState<JobItemDto[]>(items)
  const [currentItem, setCurrentItem] = React.useState<JobItemDto>(baseItem)
  const [errorMessage, setErrorMessage] = React.useState<string>()
  const [currentFormData, setCurrentFormData] = React.useState<DailyReportDto>(formData)
  const [isDialogHidden, setIsDialogHidden] = React.useState<boolean>(true)
  const [isRejectDialogHidden, setIsRejectDialogHidden] = React.useState<boolean>(true)
  const [isApproveDialogueHidden, setIsApproveDialogueHidden] = React.useState<boolean>(true)
  const [itemToDelete, setItemToDelete] = React.useState<JobItemDto>()
  const [itemToReject, setItemToReject] = React.useState<JobItemDto>()
  const [itemToApprove, setItemToApprove] = React.useState<JobItemDto>()
  const [observacaoGestor, setObservacaoGestor] = React.useState<string>()  

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
      setErrorMessage('Please, select Home office or Overtime')
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


  const onAddJobItem = async (jobItem: JobItemDto): Promise<void> => {
    if(!validateJobItem(jobItem)) return

    let saveFormResponse: DailyReportDto = null;
    if(currentFormData.Id === null) {
      saveFormResponse = await onSave(currentFormData, false)
      setCurrentFormData(saveFormResponse)
    }

    const {
      HoraInicio,
      HoraFim
    } = jobItem

    const itemToAdd: JobItemDto = ({
        ...jobItem,
        QuantidadeHoras: Math.abs(HoraFim.getTime() - HoraInicio.getTime()) / 1000 / 60 / 60,
        DailyReportHomeOfficeId: saveFormResponse.Id,
    })

    const responseSecondary = await onSaveSecondary(itemToAdd)

    setJobItems([...jobItems, responseSecondary])
    setCurrentItem({...baseItem})
  }

  const onUpdateJobItem = async (jobItem: JobItemDto): Promise<void> => {
    if(!validateJobItem(jobItem)) return
    const {
      HoraInicio,
      HoraFim
    } = jobItem

    const itemToAdd = ({
        ...jobItem,
        QuantidadeHoras: Math.abs(HoraFim.getTime() - HoraInicio.getTime()) / 1000 / 60 / 60
    })

    const index = findIndex(jobItems, (item: JobItemDto) => item.Id === jobItem.Id)
    const result = [...jobItems]

    result[index] = itemToAdd

    setJobItems([...result])
    setCurrentItem(baseItem)
    await onSaveSecondary(itemToAdd)
  }


  const onSaveAndSend = async (): Promise<void> => {
    const formIsValid = validateForm()

    if(!formIsValid) return
    
    const FormData: DailyReportDto = {
      ...currentFormData,
      Status: 'In review'
    }

    await onSave(FormData, true)
  }

  const onSaveAndFinish = async (): Promise<void> => {
    const canSaveAndFinish = jobItems.reduce((acc, item) => acc && !(item.Status === "In review"), true)

    if(!canSaveAndFinish) {
      setErrorMessage('Please, finish all reviews')
      return
    }

    const FormData: DailyReportDto = {
      ...currentFormData,
      Status: 'Reviewed'
    }
    await onSave(FormData, true)
  }

  const opApprove = async (jobItem: JobItemDto): Promise<void> => {
    const dataToUpdate = {
      ...jobItem,
      Status: 'Approved' as const,
    }

    const index = findIndex(jobItems, (item: JobItemDto) => item.Id === jobItem.Id)
    const result = [...jobItems]

    result[index] = dataToUpdate

    setJobItems([...result])

    await onSaveSecondary(dataToUpdate)
  }

  const onReject = async (jobItem: JobItemDto): Promise<void> => {
    const dataToUpdate = {
      ...jobItem,
      Status: 'Rejected' as const,
    }

    const index = findIndex(jobItems, (item: JobItemDto) => item.Id === jobItem.Id)
    const result = [...jobItems]

    result[index] = dataToUpdate

    setJobItems([...result])

    await onSaveSecondary(dataToUpdate)
  }

  const onEdit = (item: JobItemDto): void => {
    setCurrentItem(item)
  }

  const onDelete = async (item: JobItemDto): Promise<void> => {
    const index = findIndex(jobItems, (jobItem: JobItemDto) => jobItem.Id === item.Id)
    const result = [...jobItems]
    result.splice(index, 1)

    setJobItems(result)
    if(item.Id) {
      await onDeleteSecondary(item.Id)
    }
  }


  return (
    <>
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
              maxWidth: '35vw',
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
        </Stack>
      </Stack>
      <Stack
        styles={{  
          root: {
            alignItems: 'center',
            marginTop: '2rem'
          }
        }}>
        <Stack
          styles={{  
            root: {
              width: 'max-content',
            }
          }}>
          <JobList
            items={jobItems}
            isManager={isManager}
            isEmployee={isEmployee}
            status={Status}
            onApprove={(item: JobItemDto) : void => {
              setItemToApprove(item)
              setIsApproveDialogueHidden(false)
            }}
            onReject={(item: JobItemDto) : void => {
              setItemToReject(item)
              setIsRejectDialogHidden(false)
            }}
            onEdit={onEdit}
            onDelete={(item: JobItemDto) : void => {
              setItemToDelete(item)
              setIsDialogHidden(false)
            }}/>
        </Stack>
      </Stack>
      <Dialog 
        hidden={isDialogHidden}
        dialogContentProps={
          {
            type: DialogType.normal,
            title: 'Delete activity?',
            closeButtonAriaLabel: 'Cancel',
            subText: 'Do you want to delete this activity? (This action cannot be undone)',
          }
        }>
          <DialogFooter>
            <PrimaryButton onClick={async () => {
              setIsDialogHidden(true)
              await onDelete(itemToDelete)
            }} text="Delete" />
            <DefaultButton onClick={() => setIsDialogHidden(true)} text="Cancel" />
          </DialogFooter>
        </Dialog>

        <Dialog 
          hidden={isRejectDialogHidden}
          dialogContentProps={
            {
              type: DialogType.normal,
              title: 'Reject activity?',
              closeButtonAriaLabel: 'Cancel',
              subText: 'Do you want to Reject this activity? (Please add a note)',
            }
          }>
            <TextField multiline={true}
              value={observacaoGestor} 
              onChange={(event, newValue) => setObservacaoGestor(newValue)}/>
              <PrimaryButton onClick={async () => {
                setIsRejectDialogHidden(true)
                await onReject({
                  ...itemToReject,
                  ObservacaoGestor: observacaoGestor
                })
                setObservacaoGestor(null)
              }} text="Reject" />
              <DefaultButton onClick={() => setIsRejectDialogHidden(true)} text="Cancel" />
        </Dialog>
        <Dialog 
          hidden={isApproveDialogueHidden}
          dialogContentProps={
            {
              type: DialogType.normal,
              title: 'Approve activity?',
              closeButtonAriaLabel: 'Cancel',
              subText: 'Do you want to Approve this activity? (You may add a note)',
            }
          }>
            <TextField multiline={true}
              value={observacaoGestor} 
              onChange={(event, newValue) => setObservacaoGestor(newValue)}/>
              <PrimaryButton onClick={async () => {
                setIsApproveDialogueHidden(true)
                await opApprove({
                  ...itemToApprove,
                  ObservacaoGestor: observacaoGestor
                })
                setObservacaoGestor(null)
              }} text="Approve" />
              <DefaultButton onClick={() => setIsApproveDialogueHidden(true)} text="Cancel" />
        </Dialog>
    </>
  );
}
