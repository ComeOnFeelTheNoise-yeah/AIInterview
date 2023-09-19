import React, {useState} from "react";
import axios from "axios";
import {Box, Button, Card, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {signUpApi} from "../../../apis";

export default function SignUp({setAuthView}){
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userPasswordCheck, setUserPasswordCheck] = useState('');
    const [userName, setUserName] = useState('');
    const [userNickname, setUserNickname] = useState('');
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [userAddressDetail, setUserAddressDetail] = useState('');

    const signUpHandler = async () => {
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

        const signUpResponse = await signUpApi(data);
        if(!signUpResponse){
            alert("회원가입 실패");
            return;
        }

        if(!signUpResponse.result){
            alert("회원가입 실패");
            return;
        }
        alert("회원가입 성공");
        setAuthView(false);
    }

    return (
        <Card sx={{ minWidth: 275, maxWidth: "50vw", padding: 5 }}>
            <Box>
                <Typography variant='h5'>회원가입</Typography>
            </Box>
                <Box height={'50vh'}>
                    <TextField fullWidth label="이메일 주소" type="email" variant="standard" onChange={(e) => setUserEmail(e.target.value)} />
                    <TextField fullWidth label="비밀번호" type="password" variant="standard" onChange={(e) => setUserPassword(e.target.value)}/>
                    <TextField fullWidth label="비밀번호 확인" type="password" variant="standard" onChange={(e) => setUserPasswordCheck(e.target.value)}/>
                    <TextField fullWidth label="이름" variant="standard" onChange={(e) => setUserName(e.target.value)}/>
                    <TextField fullWidth label="닉네임" variant="standard" onChange={(e) => setUserNickname(e.target.value)}/>
                    <TextField fullWidth label="휴대폰 번호" variant="standard" onChange={(e) => setUserPhoneNumber(e.target.value)}/>
                    <TextField fullWidth label="주소" variant="standard" onChange={(e) => setUserAddress(e.target.value)}/>
                    <TextField fullWidth label="상세 주소" variant="standard" onChange={(e) => setUserAddressDetail(e.target.value)}/>
                </Box>
            <Box component='div'>
                <Button fullWidth onClick={() => signUpHandler()} variant="contained">
                    회원가입
                </Button>
            </Box>
            <Box component='div' display='flex' mt={2}>
                <Typography>이미 계정이 있으신가요?</Typography>
                <Typography fontWeight={800} ml={1} onClick={() => setAuthView(false)}>로그인</Typography>
            </Box>
        </Card>
    )
}