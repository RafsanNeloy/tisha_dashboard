import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Box, Drawer as MUIDrawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { makeStyles } from '@mui/styles'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import PeopleIcon from '@mui/icons-material/People'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ReceiptIcon from '@mui/icons-material/Receipt'
import BarChartIcon from '@mui/icons-material/BarChart'
import RecyclingIcon from '@mui/icons-material/Recycling';
import PercentIcon from '@mui/icons-material/Percent';
import { useDispatch } from 'react-redux'
import { setLogout } from '../../action/loginAction'
import { asyncGetBills } from '../../action/billsAction'
import { asyncGetCustomers } from '../../action/customerAction'
import { asyncGetProducts } from '../../action/productAction'
import { asyncGetUser } from '../../action/userAction'

const useStyle = makeStyles({
    menuItem: {
        paddingLeft: 0, 
        paddingRight: 0
    },
    menuIcon: {
        margin:0, 
        justifyContent: 'center'
    },
    menuText: {
        paddingRight: 25, 
        fontWeight: 600
    },
    menuLink: {
        textDecoration: 'none',
        color: 'black'
    },
    menuLogout:{
        position: 'absolote',
        top: '80%'
    }
})

const Drawer = (props) => {
    const classes = useStyle()
    const dispatch = useDispatch()
    const [ open, setOpen ] = useState(false)

    useEffect(() => {
        dispatch(asyncGetBills())
        dispatch(asyncGetCustomers())
        dispatch(asyncGetProducts())
        dispatch(asyncGetUser())
    }, [dispatch])

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        dispatch(setLogout())
    }

    const menuItems = [
        {
            name: 'User Profile',
            icon: <AccountCircleIcon fontSize='large' />,
            link: '/user'
        },
        {
            name: 'Dashboard',
            icon: <BarChartIcon fontSize='large' />,
            link: '/dashboard'
        },
        {
            name: 'Customers',
            icon: <PeopleIcon fontSize='large' />,
            link: '/customers'
        },
        {
            name:'Products',
            icon: <LocalOfferIcon fontSize='large' />,
            link: '/products'
        },
        {
            name: 'Bills',
            icon: <ReceiptIcon fontSize='large' />,
            link: '/bills'
        },
        {
            name: 'Westage',
            icon: <RecyclingIcon fontSize='large' />,
            link: '/westage'
        },
        {
            name: 'Less',
            icon: <PercentIcon fontSize='large' />,
            link: '/less'
        }
    ]

    return (
        <MUIDrawer 
            variant='permanent'
        >

            <List>
                <Box display='flex' flexDirection='column' justifyContent='space-between' minHeight='90vh'>
                    <Box>
                        <ListItem className={classes.menuItem} button onClick={open ? handleDrawerClose : handleDrawerOpen}>
                            <ListItemIcon className={classes.menuIcon}>
                                <MenuIcon fontSize='large'/>
                            </ListItemIcon>
                            {
                                open && <ListItemText > <span className={classes.menuText}>Menu</span> </ListItemText>
                            }
                        </ListItem>
                        <Link to='/profile' className={classes.menuLink}>
                            <ListItem className={classes.menuItem} button>
                                <ListItemIcon className={classes.menuIcon}>
                                    <AccountCircleIcon />
                                </ListItemIcon>
                                {
                                    open && <ListItemText> <span className={classes.menuText}>Profile</span> </ListItemText>
                                }
                            </ListItem>
                        </Link>
                        {
                            menuItems.map((menu, i) => {
                                const { name, icon, link } = menu
                                return (
                                    <Link key={i} to={link} className={classes.menuLink}>
                                        <ListItem onClick={open ? handleDrawerClose : null} className={classes.menuItem} button>
                                            <ListItemIcon className={classes.menuIcon}>
                                                {icon}
                                            </ListItemIcon>
                                            {
                                                open && <ListItemText> <span className={classes.menuText}>{name}</span> </ListItemText>
                                            }
                                        </ListItem>
                                    </Link>
                                )
                            })
                        }
                    </Box>
                    <Link to={'/login-or-register'} className={classes.menuLink}>
                        <ListItem className={`${classes.menuItem} ${classes.menuLogout}`} button onClick={handleLogout}>
                            <ListItemIcon className={classes.menuIcon}>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            {
                                open && <ListItemText> <span className={classes.menuText}>Logout</span> </ListItemText>
                            }
                        </ListItem>
                    </Link>
                </Box>
            </List>
        </MUIDrawer>
    )
}

export default Drawer