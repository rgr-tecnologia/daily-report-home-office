import * as React from 'react';
import { TimePicker } from '@fluentui/react';
import { Checkbox, IComboBox, PrimaryButton, Separator, Stack, Text, TextField } from "office-ui-fabric-react"
import { NewFormProps } from './NewForm.props';
import { JobItemDto } from '../../../../interfaces/JobItem';

export function NewForm(props: NewFormProps): JSX.Element {
    const {
        onAddJobItem
    } = props

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
    
    const [jobItemData, setJobItemData] = React.useState<JobItemDto>({...baseItem})
    const [errorMessage, setErrorMessage] = React.useState<string>('')
    
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
            baseData.HoraInicio = baseItem.HoraInicio
            baseData.HoraFim = baseItem.HoraFim
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

    const onChangeHoraInicio = (
        event: React.FormEvent<IComboBox>, 
        time: Date): void => setJobItemData({
        ...jobItemData,
        HoraInicio: time
    })

    const onChangeHoraFim = (
        event: React.FormEvent<IComboBox>, 
        time: Date): void => setJobItemData({
        ...jobItemData,
        HoraFim: time
    })

    const onSubmit = (): void => {
        if(jobItemData.HoraExtra === false && jobItemData.HomeOffice === false) {
            setErrorMessage('You must select at least one option')
            return
        }
        const {
            HoraInicio,
            HoraFim
        } = jobItemData

        
        onAddJobItem({
            ...jobItemData,
            QuantidadeHoras: Math.abs(HoraFim.getTime() - HoraInicio.getTime()) / 1000 / 3600
        })
        setJobItemData({...baseItem})
        setErrorMessage('')
    }

    return (
        <>
            <Stack>
                <Text variant='large'>New job description</Text>
                <Separator />
            </Stack>
            <Stack tokens={{childrenGap: 'm'}}>
                <TextField 
                    value={jobItemData.Title}
                    onChange={(event) => onDataChange('Title', (event.target as HTMLInputElement).value)}
                    label='Title' />
                <TextField 
                    value={jobItemData.Description}
                    onChange={(event) => onDataChange('Description', (event.target as HTMLInputElement).value)}
                    label='Description' 
                    multiline 
                    resizable={false}/>
                <Stack horizontal tokens={{
                    childrenGap: 'm'
                }}>
                    <Checkbox checked={jobItemData.HomeOffice} label='Home Office' onChange={onChangeHomeOffice}/>
                    <Checkbox checked={jobItemData.HoraExtra} label='Hora extra' onChange={onChangeHoraExtra}/>                    
                    {jobItemData.HoraExtra && (<>
                    <TimePicker label='Hora de início' onChange={onChangeHoraInicio}/>
                    <TimePicker label='Hora de fim' onChange={onChangeHoraFim}/>
                </>)}
                </Stack>
                <Stack 
                    tokens={{
                        maxWidth: 'fit-content'
                    }}
                    styles={{root: {alignSelf: 'end'}}}
                    >
                    <PrimaryButton 
                        text='Add job'
                        iconProps={{iconName: 'Add'}}
                        onClick={onSubmit}/>
                </Stack>
            </Stack>
            <Text style={{color: 'red'}}>{errorMessage}</Text>
        </>
    )
}