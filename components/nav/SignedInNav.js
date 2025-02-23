import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Image from 'next/image';
import { useState } from 'react';
import NavbarIcon from './NavbarIcon';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { signOut } from '@aws-amplify/auth';
import { Router, useRouter } from 'next/router';

const pages = ['Timeboxes'];

export default function SignedInNav({username}) {
    const router = useRouter();
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
        await signOut();
        router.push('/');
    }

    return (
        <AppBar position="static">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                <Box sx={{display: 'flex', mr: 1}}>
                    <NavbarIcon />
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
                        <MenuItem key={"Logout"} onClick={logout}>
                        <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </Container>
        </AppBar>
    );
}