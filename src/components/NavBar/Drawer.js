import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Box, Drawer as MUIDrawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PeopleIcon from '@mui/icons-material/People'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ReceiptIcon from '@mui/icons-material/Receipt'
import BarChartIcon from '@mui/icons-material/BarChart'
import RecyclingIcon from '@mui/icons-material/Recycling'
import PercentIcon from '@mui/icons-material/Percent'
import PaymentsIcon from '@mui/icons-material/Payments'
import { useDispatch } from 'react-redux'
import { setLogout } from '../../action/loginAction'
import { asyncGetBills } from '../../action/billsAction'
import { asyncGetCustomers } from '../../action/customerAction'
import { asyncGetProducts } from '../../action/productAction'
import { asyncGetUser } from '../../action/userAction'

const useStyle = makeStyles({
    drawer: {
        width: 260,
        '& .MuiDrawer-paper': {
            width: 260,
            background: '#F8F3D9',
            color: '#030637',
            height: '100%',
            position: 'fixed',
            overflowY: 'auto'
        }
    },
    header: {
        padding: '20px 16px',
        background: '#B9B28A',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1
    },
    menuList: {
        padding: '10px 0',
        marginBottom: '60px' // Space for logout button
    },
    menuItem: {
        padding: '8px 16px',
        '&:hover': {
            backgroundColor: '#2d2d3f'
        }
    },
    activeMenuItem: {
        backgroundColor: '#2d2d3f'
    },
    menuIcon: {
        color: '#9292a1',
        minWidth: '35px'
    },
    activeIcon: {
        color: '#fff'
    },
    menuText: {
        color: '#1D1616',
        fontSize: '14px'
    },
    logoutText: {
        color: '#8E1616',
        fontSize: '14px'
    },
    activeText: {
        color: '#8E1616'
    },
    menuLink: {
        textDecoration: 'none'
    },
    logoutSection: {
        position: 'fixed',
        bottom: 20,
        width: '260px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: '#F8F3D9'
    }
});

const Drawer = (props) => {
    const classes = useStyle()
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        dispatch(asyncGetBills())
        dispatch(asyncGetCustomers())
        dispatch(asyncGetProducts())
        dispatch(asyncGetUser())
    }, [dispatch])

    const handleLogout = () => {
        localStorage.removeItem('token')
        dispatch(setLogout())
    }

    const menuItems = [
        {
            name: 'Dashboard',
            icon: <BarChartIcon />,
            link: '/dashboard'
        },
        {
            name: 'Customers',
            icon: <PeopleIcon />,
            link: '/customers'
        },
        {
            name: 'Products',
            icon: <LocalOfferIcon />,
            link: '/products'
        },
        {
            name: 'Bills',
            icon: <ReceiptIcon />,
            link: '/bills'
        },
        {
            name: 'Westage',
            icon: <RecyclingIcon />,
            link: '/westage'
        },
        {
            name: 'Less',
            icon: <PercentIcon />,
            link: '/less'
        },
        {
            name: 'Collections',
            icon: <PaymentsIcon />,
            link: '/collections'
        }
    ]

    return (
        <MUIDrawer 
            variant='permanent'
            className={classes.drawer}
        >
            <Box className={classes.header}>
                <Typography className={classes.companyName}>
                    TISHA PLASTIC
                </Typography>
            </Box>
            
            <List className={classes.menuList}>
                {menuItems.map((menu, i) => {
                    const { name, icon, link } = menu
                    const isActive = location.pathname === link
                    return (
                        <Link key={i} to={link} className={classes.menuLink}>
                            <ListItem 
                                button
                                className={`${classes.menuItem} ${isActive ? classes.activeMenuItem : ''}`}
                            >
                                <ListItemIcon className={`${classes.menuIcon} ${isActive ? classes.activeIcon : ''}`}>
                                    {icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={name} 
                                    classes={{ 
                                        primary: `${classes.menuText} ${isActive ? classes.activeText : ''}`
                                    }}
                                />
                            </ListItem>
                        </Link>
                    )
                })}
            </List>

            <Box className={classes.logoutSection}>
                <Link to='/login-or-register' className={classes.menuLink}>
                    <ListItem 
                        button 
                        className={classes.menuItem}
                        onClick={handleLogout}
                    >
                        <ListItemIcon className={classes.menuIcon}>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Logout" 
                            classes={{ primary: classes.logoutText }}
                        />
                    </ListItem>
                </Link>
            </Box>
        </MUIDrawer>
    )
}

export default Drawer