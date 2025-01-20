import { Backdrop, Box, Button, Fade, Modal, Paper, makeStyles, Container, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import CustomerForm from '../../CustomerPage/CustomerForm'

const useStyle = makeStyles({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        padding: '20px 10px 20px 20px'
    },
    formTitle: {
        fontWeight: '600'
    }
})

const AddCustomerModal = (props) => {
    const classes = useStyle()
    const [ open, setOpen ] = useState(false)

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Box>
            <Button
                variant='contained'
                color='primary'
                onClick={handleOpen}
            >
                Add New Customer
            </Button>
            <Modal
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                  }}
            >
                <Fade in={open}>
                    <Paper>
                        <Container className={classes.formContainer}>
                            <Typography className={classes.formTitle} align='center' variant='h5'>Add Customer</Typography>
                            <CustomerForm handleClose={handleClose}/>
                        </Container>  
                    </Paper>
                </Fade>
            </Modal>
        </Box>
    )
}

export default AddCustomerModal