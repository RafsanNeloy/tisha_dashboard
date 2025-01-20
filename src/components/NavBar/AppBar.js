import React from 'react'
import { Link } from 'react-router-dom'

const AppBar = (props) => {

    return (
        <div className='header'>
            <div className='homepage-appbar'>
                <h1>Ant-POS</h1>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/faq'>FAQ's</Link></li>
                    <li><Link to='/login-or-register'>Login/Register</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default AppBar