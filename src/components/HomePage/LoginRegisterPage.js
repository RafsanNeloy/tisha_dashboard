import React, { useState } from 'react'
import { Container, Box, Paper, Tabs, Tab } from '@mui/material'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

const LoginRegisterPage = () => {
    const [value, setValue] = useState(0)  // Use number instead of string

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
        <Container>
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
                    
                    {value === 0 && <LoginForm />}
                    {value === 1 && <RegisterForm />}
                </Paper>
            </Box>
        </Container>
    )
}

export default LoginRegisterPage