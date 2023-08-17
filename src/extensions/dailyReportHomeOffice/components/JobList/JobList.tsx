import * as React from 'react';
import { DetailsList, IColumn } from "office-ui-fabric-react";
import { JobItemAsString, JobListProps } from './JobList.props';
import { SelectionMode } from '@fluentui/react';
import { ActionsColumn } from '../ActionsColumn/ActionsColumn';


export function JobList(props: JobListProps): JSX.Element {
    const { 
        items,
        isManager,
        isEmployee,
        status,
        onApprove,
        onReject
    } = props

    const columns: IColumn[] = [
        {
            key: `column2`,
            name: 'Title',
            fieldName: 'Title',
            minWidth: 100
        },
        {
            key: `column3`,
            name: 'Description',
            fieldName: 'Description',
            minWidth: 100
        },
        {
            key: `column4`,
            name: 'Status',
            fieldName: 'Status',
            minWidth: 100
        },
        {
            key: `column5`,
            name: 'Hora extra',
            fieldName: 'HoraExtra',
            minWidth: 100,
            onRender: ({HoraExtra}) => <>{HoraExtra ? 'Yes' : 'No'}</>
        },
        {
            key: `column6`,
            name: 'Hora início',
            fieldName: 'HoraInicio',
            minWidth: 100
        },
        {
            key: `column7`,
            name: 'Hora fim',
            fieldName: 'HoraFim',
            minWidth: 100
        },
        {
            key: `column8`,
            name: 'Qtd horas',
            fieldName: 'QuantidadeHoras',
            minWidth: 100
        },
        {
            key: `column9`,
            name: 'Actions',
            minWidth: 100,
            onRender: (item: JobItemAsString) => (
                <ActionsColumn 
                    isManager={isManager}
                    isEmployee={isEmployee}
                    onApprove={onApprove}
                    onReject={onReject}
                    item={item}
                    status={status}/>)
        }
    ]

    return (
        <>
            <DetailsList 
                items={items} 
                columns={columns} 
                selectionMode={SelectionMode.none}/>
        </>)
}