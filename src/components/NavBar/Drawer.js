import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Box, Drawer as MUIDrawer, List, ListItem, ListItemIcon, ListItemText, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PeopleIcon from '@mui/icons-material/People'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ReceiptIcon from '@mui/icons-material/Receipt'
import BarChartIcon from '@mui/icons-material/BarChart'
import RecyclingIcon from '@mui/icons-material/Recycling'
import PercentIcon from '@mui/icons-material/Percent'
import PaymentsIcon from '@mui/icons-material/Payments'
import HistoryIcon from '@mui/icons-material/History'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useDispatch } from 'react-redux'
import { setLogout } from '../../action/loginAction'
import { asyncGetBills } from '../../action/billsAction'
import { asyncGetCustomers } from '../../action/customerAction'
import { asyncGetProducts } from '../../action/productAction'
import { asyncGetUser } from '../../action/userAction'

const useStyle = makeStyles({
    drawer: {
        width: props => props.drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: props => props.drawerWidth,
            background: '#F8F3D9',
            color: '#030637',
            height: '100%',
            position: 'fixed',
            overflowY: 'auto',
            transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms'
        }
    },
    drawerMobile: {
        '& .MuiDrawer-paper': {
            background: '#F8F3D9',
            color: '#030637',
            height: '100%',
            overflowY: 'auto'
        }
    },
    header: {
        padding: '20px 16px',
        background: '#B9B28A',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
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
        minWidth: props => props.isDrawerOpen ? '35px' : '100%',
        display: 'flex',
        justifyContent: props => props.isDrawerOpen ? 'flex-start' : 'center'
    },
    activeIcon: {
        color: '#fff'
    },
    menuText: {
        color: '#1D1616',
        fontSize: '14px',
        opacity: props => props.isDrawerOpen ? 1 : 0
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
        width: props => props.isDrawerOpen ? '260px' : '64px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: '#F8F3D9'
    },
    toggleButton: {
        color: '#030637'
    },
    companyName: {
        fontWeight: 'bold',
        flex: 1
    }
});

const Drawer = (props) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile)
    const drawerWidth = isDrawerOpen ? 260 : 64
    
    const classes = useStyle({ isDrawerOpen, drawerWidth })
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        dispatch(asyncGetBills())
        dispatch(asyncGetCustomers())
        dispatch(asyncGetProducts())
        dispatch(asyncGetUser())
    }, [dispatch])

    useEffect(() => {
        const handleResize = () => {
            if (isMobile && isDrawerOpen) {
                setIsDrawerOpen(false)
            }
        }
        
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [isMobile, isDrawerOpen])

    const handleLogout = () => {
        localStorage.removeItem('token')
        dispatch(setLogout())
    }

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen)
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
            name: 'History',
            icon: <HistoryIcon />,
            link: '/history'
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

    if (isMobile) {
        return (
            <>
                <IconButton 
                    color="inherit" 
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    edge="start"
                    sx={{ 
                        position: 'fixed', 
                        top: '10px', 
                        left: '10px', 
                        zIndex: 1200,
                        bgcolor: '#B9B28A',
                        '&:hover': { bgcolor: '#a09c7c' }
                    }}
                >
                    <MenuIcon />
                </IconButton>
                
                <MUIDrawer
                    variant="temporary"
                    open={isDrawerOpen}
                    onClose={toggleDrawer}
                    className={classes.drawerMobile}
                    ModalProps={{ keepMounted: true }}
                >
                    <Box className={classes.header}>
                        <Typography variant="h6" className={classes.companyName}>
                            TISHA PLASTIC
                        </Typography>
                        <IconButton onClick={toggleDrawer} className={classes.toggleButton}>
                            <ChevronLeftIcon />
                        </IconButton>
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
                                        onClick={isMobile ? toggleDrawer : null}
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
            </>
        )
    }

    return (
        <MUIDrawer 
            variant='permanent'
            className={classes.drawer}
        >
            <Box className={classes.header}>
                {isDrawerOpen && (
                    <Typography className={classes.companyName}>
                        TISHA PLASTIC
                    </Typography>
                )}
                <IconButton onClick={toggleDrawer} className={classes.toggleButton}>
                    {isDrawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
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
                                {isDrawerOpen && (
                                    <ListItemText 
                                        primary={name} 
                                        classes={{ 
                                            primary: `${classes.menuText} ${isActive ? classes.activeText : ''}`
                                        }}
                                    />
                                )}
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
                        {isDrawerOpen && (
                            <ListItemText 
                                primary="Logout" 
                                classes={{ primary: classes.logoutText }}
                            />
                        )}
                    </ListItem>
                </Link>
            </Box>
        </MUIDrawer>
    )
}

export default Drawer