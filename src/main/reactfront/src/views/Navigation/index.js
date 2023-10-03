import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {useUserStore} from "../../stores";
import { Link } from 'react-router-dom';
import {useCookies} from "react-cookie";
import {useRef, useState} from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';

export default function Navigation() {
    const [cookies, setCookies] = useCookies(['token']);
    const {user, removeUser} = useUserStore();
    const [userProfile, setUserProfile] = useState(user ? user.userProfile : "path-to-default-image.jpg");
    const [userNickname, setUserNickname] = useState(user ? user.userNickname : "");

    const [anchorEl, setAnchorEl] = useState(null);
    const profileBtnRef = useRef(null);

    const logOutHandler = () => {
        setCookies('token', '', {expires: new Date()});
        removeUser();
    }

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{ backgroundColor: '#ffffff', color: 'black' }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <img alt="4thLogo" src="/img/img/4thLogo.png" height='60' style={{margin: '0px 10px 0px 0px'}}/>
                        </Link>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Button variant="text" color="inherit" sx={{ marginRight: '20px' }}>
                            <Link to="/interview" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Typography variant="h6" fontWeight="bold">
                                    모의면접
                                </Typography>
                            </Link>
                        </Button>
                        <Button variant="text" color="inherit" sx={{ marginRight: '20px' }}>
                            <Link to="/analysis" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Typography variant="h6" fontWeight="bold">
                                    자소서 분석
                                </Typography>
                            </Link>
                        </Button>
                        <Button variant="text" color="inherit" sx={{ marginRight: '20px' }}>
                            <Link to="/board" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Typography variant="h6" fontWeight="bold">
                                    커뮤니티
                                </Typography>
                            </Link>
                        </Button>
                        <Button variant="text" color="inherit" sx={{ marginRight: '20px' }}>
                            <Typography variant="h6" fontWeight="bold">
                                기업별 자소서 항목
                            </Typography>
                        </Button>
                        <Button variant="text" color="inherit" sx={{ marginRight: '20px' }}>
                            <Link to="/chatbot" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Typography variant="h6" fontWeight="bold">
                                    예시 대답 챗봇
                                </Typography>
                            </Link>
                        </Button>
                        <Button variant="text" color="inherit" sx={{ marginRight: '20px' }}>
                            <Link to="/payment" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Typography variant="h6" fontWeight="bold">
                                    결제
                                </Typography>
                            </Link>
                        </Button>
                    </Typography>
                    {user ? (
                        <>
                            <Typography variant="h6" sx={{ marginRight: '10px' }}>
                                {userNickname}
                            </Typography>
                            <Avatar
                                ref={profileBtnRef}
                                src={userProfile}
                                onClick={handleProfileClick}
                                style={{ cursor: 'pointer', marginRight: '10px' }}
                            />
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={() => {
                                    handleMenuClose();
                                }}>
                                    <Link to="/memberInfo" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        정보 수정
                                    </Link>
                                </MenuItem>
                                <MenuItem >
                                    자소서 작성
                                </MenuItem>
                                <MenuItem onClick={() => {
                                    logOutHandler();
                                    handleMenuClose();
                                }}>
                                    로그아웃
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button color="inherit" onClick={() => logOutHandler()}>
                            <Typography variant="h6" fontWeight="bold">
                            로그인
                        </Typography>
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}