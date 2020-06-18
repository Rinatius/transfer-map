import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography'
import config from '../config';

const legend = props => {
    const items = {...config.legend}
    
    let keys = Object.keys(items)
    let itemList = keys.map(key => {
        return (<Box item style={items[key].boxStyle}>
            <Box display="flex">
                <img src={items[key].img} alt={key}/>
                <Typography variant="body2" style={items[key].titleStyle}>{items[key].title}</Typography>
            </Box>
            <Typography variant="body2" style={items[key].bodyStyle}>{items[key].body}</Typography>
        </Box>)
    })
    return (
        <Box display="flex" justifyContent="center" pb={'40px'}>
        {itemList}
        </Box>
    )
}


export default legend