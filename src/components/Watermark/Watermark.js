import React from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import watermarkImage from '../../images/tppr.png';

const useStyles = makeStyles((theme) => ({
    watermarkContainer: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        opacity: 0.2
    },
    watermarkImage: {
        maxWidth: '80%',
        maxHeight: '80%',
        objectFit: 'contain',
        opacity: 0.3
    },
    watermarkText: {
        marginTop: '20px',
        color: 'rgba(0, 0, 0, 0.3)',
        fontSize: '5rem',
        fontWeight: 'bold',
        letterSpacing: '5px',
        textAlign: 'center',
        textTransform: 'uppercase'
    }
}));

const Watermark = () => {
    const classes = useStyles();

    return (
        <Box className={classes.watermarkContainer}>
            <img 
                src={watermarkImage} 
                alt="Tisha Plastic Watermark" 
                className={classes.watermarkImage}
            />
            <Typography 
                variant="h2" 
                className={classes.watermarkText}
            >
                Tisha Plastic
            </Typography>
        </Box>
    );
};

export default Watermark; 