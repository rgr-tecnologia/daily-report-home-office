import * as React from 'react';
import { FontIcon, Stack } from "office-ui-fabric-react"
import { ActionsColumnProps } from './ActionsColumn.props';

export function ActionsColumn(props: ActionsColumnProps): JSX.Element {
    const {
        isManager
    } = props
    
    const styles = {
        fontSize: '1rem'
    }
    return <Stack 
        horizontal
        tokens={{
            childrenGap: 'm'
        }}>
        {isManager &&
            <>
                <FontIcon iconName="Accept" style={styles}/>
                <FontIcon iconName="Cancel" style={styles}/>
            </>}
    </Stack>
}