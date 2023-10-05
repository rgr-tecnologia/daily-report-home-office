import * as React from 'react';
import { TimePicker } from '@fluentui/react';
import { Checkbox, IComboBox, PrimaryButton, Separator, Stack, TextField } from "office-ui-fabric-react"
import { NewFormProps } from './NewForm.props';
import { JobItemDto } from '../../../../interfaces/JobItem';

export function NewForm(props: NewFormProps): JSX.Element {
    const {
        onSubmit,
        onUpdate,
        currentItem
    } = props
    
    const [jobItemData, setJobItemData] = React.useState<JobItemDto>(currentItem)

    React.useEffect(() => {
        setJobItemData(currentItem)
    }, [currentItem])
    
    const onDataChange = (key: 'Title' | 'Description', value: string): void => {
        const itemData = {...jobItemData}
        itemData[key] = value

        setJobItemData(itemData)
    }

    const onChangeHoraExtra = (
        event: React.FormEvent<HTMLElement | HTMLInputElement>, 
        checked: boolean
    ): void => {
        const baseData: JobItemDto = {
            ...jobItemData,
            HoraExtra: checked
        }

        if(checked === false) {
            baseData.HoraInicio = new Date()
            baseData.HoraFim = new Date()
        }
        
        setJobItemData(baseData)
    }

    const  onChangeHomeOffice = (
        event: React.FormEvent<HTMLElement | HTMLInputElement>, 
        checked: boolean
    ): void => {
        const baseData: JobItemDto = {
            ...jobItemData,
            HomeOffice: checked
        }
        
        setJobItemData(baseData)
    }  

    const validateTime = (time: Date) => {
        if(isNaN(time.getTime())) {
            return false
        }
        return true
    }

    const onChangeHoraInicio = (
        event: React.FormEvent<IComboBox>, 
        time: Date): void => {
            const validationResult = validateTime(time)

            if(!validationResult) return
            setJobItemData({
                ...jobItemData,
                HoraInicio: time
            })
        }

    const onChangeHoraFim = (
        event: React.FormEvent<IComboBox>, 
        time: Date): void => {
            const validationResult = validateTime(time)

            if(!validationResult) return            
            setJobItemData({
                ...jobItemData,
                HoraFim: time
            })
        }
            
    

    return (
        <>
            <Stack>
                <Separator />
            </Stack>
            <Stack tokens={{childrenGap: 'm'}}>
                <TextField 
                    value={jobItemData.Title}
                    onChange={(event) => onDataChange('Title', (event.target as HTMLInputElement).value)}
                    label='Title' 
                    required/>
                <TextField 
                    value={jobItemData.Description}
                    onChange={(event) => onDataChange('Description', (event.target as HTMLInputElement).value)}
                    label='Description' 
                    multiline 
                    resizable={false}
                    required/>
                <Stack horizontal tokens={{
                    childrenGap: 'm'
                }}>
                    <Checkbox checked={jobItemData.HomeOffice} label='Home Office' onChange={onChangeHomeOffice}/>
                    <Checkbox checked={jobItemData.HoraExtra} label='Overtime' onChange={onChangeHoraExtra}/>                    
                    {jobItemData.HoraExtra && (<>
                    <TimePicker 
                        value={jobItemData.HoraInicio} 
                        label='Start time' onChange={onChangeHoraInicio}
                        required/>
                    <TimePicker 
                        value={jobItemData.HoraFim} 
                        label='End time' 
                        onChange={onChangeHoraFim}
                        required/>
                </>)}
                </Stack>
                <Stack 
                    tokens={{
                        maxWidth: 'fit-content'
                    }}
                    styles={{root: {alignSelf: 'end'}}}
                    >
                    { !currentItem.Id && <PrimaryButton 
                        text='Add job'
                        iconProps={{iconName: 'Add'}}
                        onClick={() => onSubmit(jobItemData)}/>}
                    
                    { currentItem.Id && <PrimaryButton 
                        text='Update job'
                        iconProps={{iconName: 'Add'}}
                        onClick={() => onUpdate(jobItemData)}/>}
                </Stack>
            </Stack>
        </>
    )
}