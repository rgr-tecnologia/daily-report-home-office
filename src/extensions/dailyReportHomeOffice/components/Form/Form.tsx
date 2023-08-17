import * as React from 'react';
import { PrimaryButton, Stack, TextField } from "office-ui-fabric-react"
import { FormProps } from './Form.props';
import { NewForm } from '../NewForm/NewForm';
import { DefaultButton } from '@fluentui/react';


export function Form(props: FormProps): JSX.Element {
    const { 
        date,
        employee,
        manager,
        isEmployee,
        isManager,
        status,
        onAddJobItem,
        onSaveDraft,
        onSaveAndSend,
        onSaveAndFinish,
    } = props

    return (
        <Stack 
            tokens={{childrenGap: 'm'}}>
            <Stack 
                wrap
                horizontal
                tokens={{childrenGap: 'm'}}
                styles={{
                    root: {
                        '& > *:first-child': {
                            margin: 0
                        }
                    }
                }}
            >
                <TextField defaultValue={employee.NAME_EMPLOYEE} label='Employee name' readOnly={true} borderless={true}/>
                <TextField defaultValue={employee.GROUP} label='Position' readOnly={true} borderless={true}/>
                <TextField defaultValue={employee.AREA} label='Area' readOnly={true} borderless={true}/>
                <TextField defaultValue={date.toLocaleDateString()} label='Date' readOnly={true} borderless={true}/>
                <TextField defaultValue={manager.NAME_EMPLOYEE} label='Manager' readOnly={true} borderless={true}/>
            </Stack>
            {
                isEmployee && status === 'Draft' && (
                    <>
                        <NewForm onAddJobItem={onAddJobItem}/>
                        <Stack tokens={{childrenGap: 'm'}} horizontal>
                            <DefaultButton onClick={onSaveDraft} text='Save draft'/>
                            <PrimaryButton onClick={onSaveAndSend} text='Send to review'/>
                        </Stack>
                    </>

                ) ||
                isManager && status === 'In review' && (
                    <>
                        <PrimaryButton onClick={onSaveAndFinish} text='Finish review'/>
                    </>
                )
            }
        </Stack>
    )
}