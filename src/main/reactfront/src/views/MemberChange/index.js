import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import {useCookies} from "react-cookie";

export default function MemberChange() {
    const [isVerified, setIsVerified] = useState(false);
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [cookies] = useCookies(['token']);  // 쿠키 hook 사용

    // State for user details once they're fetched
    const [user, setUser] = useState({
        userEmail: '',
        userName: '',
        userNickname: '',
        userPhoneNumber: '',
        userAddress: '',
        userAddressDetail: ''
    });

    const handlePasswordVerification = async () => {
        try {
            const token = cookies.token;  // 쿠키에서 토큰 가져오기

            if (!token) {
                setErrorMessage('Token not found. Please log in again.');
                return;
            }

            const response = await axios.post('/api/auth/verifyPassword', { password, token });

            if (response.data.isValid) {
                setIsVerified(true);

                const userDetails = await axios.get('/api/auth/currentUser', {
                    headers: {
                        Authorization: `Bearer ${token}` // 현재 사용자의 정보를 가져오기 위해 헤더에 토큰 추가
                    }
                });
                setUser(userDetails.data);
            } else {
                setErrorMessage('Incorrect password.');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }
    };


    const handleUpdate = () => {
        // Handle the user's details update here
    };

    if (!isVerified) {
        return (
            <div>
                <Typography variant="h6">Enter your password to continue</Typography>
                <TextField
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handlePasswordVerification}>Verify</Button>
                {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            </div>
        );
    }

    return (
        <div>
            <Box>
                <TextField
                    label="이메일 주소"
                    type="email"
                    variant="standard"
                    defaultValue={user.userEmail}
                />
                <TextField
                    label="이름"
                    variant="standard"
                    defaultValue={user.userName}
                />
                <TextField
                    label="닉네임"
                    variant="standard"
                    defaultValue={user.userNickname}
                />
                <TextField
                    label="휴대폰 번호"
                    variant="standard"
                    defaultValue={user.userPhoneNumber}
                />
                <TextField
                    label="주소"
                    variant="standard"
                    defaultValue={user.userAddress}
                />
                <TextField
                    label="상세 주소"
                    variant="standard"
                    defaultValue={user.userAddressDetail}
                />
                <Button onClick={handleUpdate}>
                    Update
                </Button>
            </Box>
        </div>
    );
}
