import React, {useState} from "react";
import axios from "axios";
import {Box, Button, Card, CardActions, CardContent, TextField} from "@mui/material";

export default function SignUp(){
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userPasswordCheck, setUserPasswordCheck] = useState('');
    const [userName, setUserName] = useState('');
    const [userNickname, setUserNickname] = useState('');
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [userAddressDetail, setUserAddressDetail] = useState('');

    const signUpHandler = () => {
        const data = {
            userEmail,
            userPassword,
            userPasswordCheck,
            userNickname,
            userName,
            userPhoneNumber,
            userAddress,
            userAddressDetail
        }
        axios
            .post('http://localhost:8080/api/auth/signUp', data)
            .then((response) => {})
            .catch((error) => {})
    }

    return (
        <Card sx={{ minWidth: 275, maxWidth: "50vw" }}>
            <CardContent>
                <Box>
                    <TextField fullWidth label="이메일 주소" type="email" variant="standard" onChange={(e) => setUserEmail(e.target.value)} />
                    <TextField fullWidth label="비밀번호" type="password" variant="standard" onChange={(e) => setUserPassword(e.target.value)}/>
                    <TextField fullWidth label="비밀번호 확인" type="password" variant="standard" onChange={(e) => setUserPasswordCheck(e.target.value)}/>
                    <TextField fullWidth label="이름" variant="standard" onChange={(e) => setUserName(e.target.value)}/>
                    <TextField fullWidth label="닉네임" variant="standard" onChange={(e) => setUserNickname(e.target.value)}/>
                    <TextField fullWidth label="휴대폰 번호" variant="standard" onChange={(e) => setUserPhoneNumber(e.target.value)}/>
                    <TextField fullWidth label="주소" variant="standard" onChange={(e) => setUserAddress(e.target.value)}/>
                    <TextField fullWidth label="상세 주소" variant="standard" onChange={(e) => setUserAddressDetail(e.target.value)}/>
                </Box>
            </CardContent>
            <CardActions>
                <Button fullWidth onClick={() => signUpHandler()} variant="contained">회원가입</Button>
            </CardActions>
        </Card>
    )
}