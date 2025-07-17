import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import NavbarIcon from './NavbarIcon';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { signOut } from '@aws-amplify/auth';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';


export default function SignedInNav({username}) {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [userMenuShown, setUserMenuShown] = useState(false);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setUserMenuShown(true);
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setUserMenuShown(false);
        setAnchorElUser(null);
    };

    async function logout() {
        try {
            await signOut();
            window.location.reload();
        } catch (error) {
            Sentry.captureException(error);
        }
    }

    return (
        <AppBar position="static">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                <title>Boxoal</title>
                <Box>
                    <NavbarIcon />
                </Box>
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                    >
                    <MenuIcon />
                    </IconButton>
                    <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{ display: { xs: 'block', md: 'none' } }}
                    >
                        <MenuItem key={"Timeboxes"} onClick={handleCloseNavMenu}>
                            <Link style={{color: 'black', textDecoration: 'none'}} href="/myschedules"><Typography sx={{ textAlign: 'center' }}>Timeboxes</Typography></Link>
                        </MenuItem>
                    </Menu>
            
                </Box>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    <Button
                        key={"Timeboxes"}
                        onClick={handleCloseNavMenu}
                        sx={{ my: 2, color: 'black', display: 'block', '&:hover': {color: 'white'},}}
                        href="/myschedules"
                    >
                        Timeboxes
                    </Button>
                </Box>
                <Box sx={{ ml: 'auto', flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, color: 'black', '&:hover': {color: 'white'}, }}>
                                <AccountCircleIcon  fontSize='large'/>
                                <Typography sx={{ml: 1}}>{username}</Typography>
                                {!userMenuShown && <ArrowDropDownIcon fontSize='medium'/>}
                                {userMenuShown && <ArrowDropUpIcon  fontSize='medium'/>}
                        </IconButton>
                    </Tooltip>
                    <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    >
                        <MenuItem className="logoutButton" key={"Logout"} onClick={logout}>
                        <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </Container>
        </AppBar>
    );
}