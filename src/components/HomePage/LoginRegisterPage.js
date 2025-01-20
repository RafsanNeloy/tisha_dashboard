import React, { useState } from 'react'
import { Container, Box, Paper, Tabs, Tab } from '@mui/material'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

const LoginRegisterPage = () => {
    const [value, setValue] = useState(0)
    const [errorNotify, setErrorNotify] = useState({ error: false, errorMessage: '' })

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleChangeTabValue = () => {
        setValue(0)  // Switch to login tab (index 0)
    }

    const handleErrorNotify = (value) => {
        setErrorNotify(value)
    }

    return (
        <Container>
            {errorNotify.error === true && (
                <div className='errorMessage'> 
                    <p>{errorNotify.errorMessage}</p> 
                    <button onClick={() => handleErrorNotify({error:false, errorMessage:''})}>X</button> 
                </div>
            )}
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Paper elevation={3}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="Login" value={0} />
                        <Tab label="Register" value={1} />
                    </Tabs>
                    
                    {value === 0 && <LoginForm handleErrorNotify={handleErrorNotify} />}
                    {value === 1 && <RegisterForm handleChangeTabValue={handleChangeTabValue} />}
                </Paper>
            </Box>
        </Container>
    )
}

export default LoginRegisterPage