import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import config from '../config';

const legend = props => {
    const items = {...config.legend}
    
    let keys = Object.keys(items)
    let itemList = keys.map(key => {
        return (<Grid item style={items[key].boxStyle}>
            <Box display="flex">
                <img src={items[key].img} alt={key}/>
                <Typography variant="body2" style={items[key].titleStyle}>{items[key].title}</Typography>
            </Box>
            <Typography variant="body2" style={items[key].bodyStyle}>{items[key].body}</Typography>
        </Grid>)
    })
    return (
        <Grid container pb={'40px'}
        direction="row"
        justify="center"
        alignItems="center">
        {itemList}
        </Grid>
    )
}


export default legend