import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {useUserStore} from "../../stores";
import {useCookies} from "react-cookie";

export default function Navigation() {
    const [cookies, setCookies] = useCookies(['token']);
    const {user, removeUser} = useUserStore();

    const logOutHandler = () => {
        setCookies('token', '', {expires: new Date()});
        removeUser();
    }

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
                        <img alt="4thLogo" src="/img/img/4thLogo.png" height='60' style={{margin: '0px 10px 0px 0px'}}/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Button variant="text" color="inherit"  sx={{ marginRight: '20px' }}>
                            <Typography variant="h6" fontWeight="bold">
                                모의면접
                            </Typography>
                        </Button>
                        <Button variant="text" color="inherit" sx={{ marginRight: '20px' }}>
                            <Typography variant="h6" fontWeight="bold">
                                자소서 분석
                            </Typography>
                        </Button>
                        <Button variant="text" color="inherit" sx={{ marginRight: '20px' }}>
                            <Typography variant="h6" fontWeight="bold">
                                커뮤니티
                            </Typography>
                        </Button>
                        <Button variant="text" color="inherit" sx={{ marginRight: '20px' }}>
                            <Typography variant="h6" fontWeight="bold">
                                기업별 자소서 항목
                            </Typography>
                        </Button>
                        <Button variant="text" color="inherit" sx={{ marginRight: '20px' }}>
                            <Typography variant="h6" fontWeight="bold">
                                예시 대답 챗봇
                            </Typography>
                        </Button>
                        <Button variant="text" color="inherit" sx={{ marginRight: '20px' }}>
                            <Typography variant="h6" fontWeight="bold">
                                결제
                            </Typography>
                        </Button>
                    </Typography>
                    {user ? (
                        <Button color="inherit" onClick={() => logOutHandler()}>
                            <Typography variant="h6" fontWeight="bold">
                                Logout
                            </Typography>
                        </Button>
                    ) : (
                        <Button color="inherit">
                            <Typography variant="h6" fontWeight="bold">
                            Login
                        </Typography>
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}