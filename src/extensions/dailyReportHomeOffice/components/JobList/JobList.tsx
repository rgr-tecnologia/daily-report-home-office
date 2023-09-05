import * as React from 'react';
import { DetailsList, IColumn, IStyle, Text, TooltipHost, TooltipOverflowMode } from "office-ui-fabric-react";
import { JobItemAsString, JobListProps } from './JobList.props';
import { SelectionMode } from '@fluentui/react';
import { ActionsColumn } from '../ActionsColumn/ActionsColumn';
import { JobItemDto } from '../../../../interfaces/JobItem';


export function JobList(props: JobListProps): JSX.Element {
    const { 
        items,
        isManager,
        isEmployee,
        status,
        onApprove,
        onReject,
        onEdit,
        onDelete
    } = props

    const [jobItems, setJobItems] = React.useState<JobItemDto[]>(items)

    React.useEffect(() => {
        setJobItems(items)
    }, [items])

    const formatJobItemsDateProperties = (items: JobItemDto[]): JobItemAsString[] => items.map(item => {
        return {
            ...item,
            HoraInicio: item.HoraExtra ? item.HoraInicio.toLocaleTimeString() : '',
            HoraFim: item.HoraExtra ? item.HoraFim.toLocaleTimeString() : ''
        }
    })    

    const columns: IColumn[] = [
        {
            key: `column10`,
            name: 'Actions',
            minWidth: 100,
            onRender: (item: JobItemAsString) => (
                <ActionsColumn 
                    isManager={isManager}
                    isEmployee={isEmployee}
                    onApprove={onApprove}
                    onReject={onReject}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    item={items.filter(i => i.Id === item.Id)[0]}
                    status={status}
                />)
        },
        {
            key: `column2`,
            name: 'Title',
            minWidth: 100,
            onRender: (item) => {
                return (
                    <TooltipHost 
                        content={item.Title}
                        overflowMode={TooltipOverflowMode.Parent}>
                        <Text>{item.Title}</Text>
                    </TooltipHost>
                )
            }
        },
        {
            key: `column3`,
            name: 'Description',
            minWidth: 100,
            onRender: (item) => {
                return (
                    <TooltipHost 
                        content={item.Description}
                        overflowMode={TooltipOverflowMode.Parent}>
                        <Text>{item.Description}</Text>
                    </TooltipHost>
                )
            }
        },
        {
            key: `column4`,
            name: 'Status',
            minWidth: 100,
            onRender: (item: JobItemAsString) => {
                let style: IStyle = {
                    borderRadius: '1rem',
                    padding: '0.25rem 0.5rem',
                    margin: '0.5rem',
                    height: '1.5rem',
                }

                if(item.Status === 'Approved') {
                    style = {
                        ...style,
                        color: '#437406',
                        backgroundColor: '#CFFFB8',                        
                    }
                }
                else if(item.Status === 'Rejected') {
                    style = {
                        ...style,
                        color: '#8F6200',
                        backgroundColor: '#FFEBC0',                        
                    }

                }
                else if(item.Status === 'In review') {
                    style = {
                        ...style,
                        color: '#0068B8',
                        backgroundColor: '#D4E7F6',                        
                    }

                }

            return <>
                <Text 
                    variant='small'
                    styles={{
                    root: style
                }}>{
                    item.Status
                }</Text>
            </>}
        },        
        {
            key: `column5`,
            name: 'Overtime hours',
            minWidth: 100,
            onRender: (item => <>{item.QuantidadeHoras.toFixed(2)}</>)
        },        
        {
            key: `column6`,
            name: 'Start time',
            fieldName: 'HoraInicio',
            minWidth: 100,
        },
        {
            key: `column7`,
            name: 'End time',
            fieldName: 'HoraFim',
            minWidth: 100,
        },
        {
            key: `column9`,
            name: 'Home office?',
            fieldName: 'HomeOffice',
            minWidth: 100,
            onRender: ({HomeOffice}) => <>{HomeOffice ? 'Yes' : 'No'}</>
        },
        {
            key: `column9`,
            name: 'Overtime?',
            minWidth: 100,
            onRender: ({HoraExtra}) => <>{HoraExtra ? 'Yes' : 'No'}</>
        },
        {
            key: `column10`,
            name: 'Manager\'s note',
            minWidth: 100,
            onRender: (item) => {
                return (
                    <TooltipHost 
                        content={item.ObservacaoGestor}
                        overflowMode={TooltipOverflowMode.Parent}>
                        <Text>{item.ObservacaoGestor}</Text>
                    </TooltipHost>
                )
            }
        },

        
    ]


    return (
        <>
            <DetailsList 
                items={formatJobItemsDateProperties(jobItems)} 
                columns={columns} 
                selectionMode={SelectionMode.none}/>
        </>)
}