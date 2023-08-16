import * as React from 'react';
import { Stack, TextField } from "office-ui-fabric-react"
import { FormProps } from './Form.props';
import { NewForm } from '../NewForm/NewForm';


export function Form(props: FormProps): JSX.Element {
    const { 
        onAddJobItem, 
        employee,
        date, 
        manager,
        onSaveDraft,
        onSaveAndSend,
        isEmployee,
        isManager
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
                !isManager && (
                    <NewForm
                        date={date}
                        onSaveDraft={onSaveDraft}
                        onSaveAndSend={onSaveAndSend}
                        isEmployee={isEmployee}
                        onAddJobItem={onAddJobItem}
                    />
                )
            }
        </Stack>
    )
}