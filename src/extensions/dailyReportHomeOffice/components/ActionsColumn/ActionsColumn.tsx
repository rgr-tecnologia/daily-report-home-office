import * as React from 'react';
import { FontIcon, Stack } from "office-ui-fabric-react"
import { ActionsColumnProps } from './ActionsColumn.props';

export function ActionsColumn(props: ActionsColumnProps): JSX.Element {
    const {
        isEmployee,
        isManager,
        status
    } = props
    const styles = {
        fontSize: '1rem'
    }
    return <Stack 
        horizontal
        tokens={{
            childrenGap: 'm'
        }}>
        {
            isEmployee && status === 'Draft' && (
                <>
                    <FontIcon iconName="Edit" style={styles}/>
                </>
            ) ||
            isManager && status === 'In review' && (
                <>
                    <FontIcon iconName="Accept" style={styles}/>
                    <FontIcon iconName="Cancel" style={styles}/>
                </>
            )
        }
    </Stack>
}