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

    // 유효성 검사 상태 추가
    const [validationErrors, setValidationErrors] = useState({});

    // 주소 검색 버튼 핸들러
    const searchAddress = () => {
        // daum.Postcode API 또는 다른 주소 검색 방법 사용
        // 결과로 주소 상태 업데이트
    };

    const validateForm = () => {
        let errors = {};

        // 이메일 유효성 검사
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userEmail)) {
            errors.userEmail = "올바른 이메일 주소를 입력해주세요.";
        }

        // 비밀번호 유효성 검사
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{4,12}$/;
        if (!passwordPattern.test(userPassword)) {
            errors.userPassword = "비밀번호는 4~12자의 영문 대소문자, 숫자로만 입력해야 합니다.";
        }

        // 비밀번호 확인 검사
        if (userPassword !== userPasswordCheck) {
            errors.userPasswordCheck = "비밀번호가 일치하지 않습니다.";
        }

        // 이름 유효성 검사
        const namePattern = /^[가-힣]{2,4}$/;
        if (!namePattern.test(userName)) {
            errors.userName = "이름이 올바르지 않습니다.";
        }

        // 주소 유효성 검사
        if (!userAddress || !userAddressDetail) {
            errors.userAddress = "주소 정보를 모두 입력해주세요.";
        }

        // 닉네임 유효성 검사
        if (!userNickname) {
            errors.userNickname = "닉네임을 입력해주세요.";
        }

        // 휴대폰 번호 유효성 검사
        const phonePattern = /^[0-9]{10,11}$/;
        if (!phonePattern.test(userPhoneNumber)) {
            errors.userPhoneNumber = "올바른 휴대폰 번호를 입력해주세요.";
        }

        // 상세 주소 유효성 검사
        if (!userAddressDetail) {
            errors.userAddressDetail = "상세 주소를 입력해주세요.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const signUpHandler = async () => {

        if (!validateForm()) return;

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
                <Box height={'65vh'}>
                    <label>
                        <TextField fullWidth label="이메일 주소" type="email" variant="standard" onChange={(e) => setUserEmail(e.target.value)} />
                        {validationErrors.userEmail && <Typography color="error">{validationErrors.userEmail}</Typography>}
                    </label>
                    <label>
                        <TextField fullWidth label="비밀번호" type="password" variant="standard" onChange={(e) => setUserPassword(e.target.value)}/>
                        {validationErrors.userPassword && <Typography color="error">{validationErrors.userPassword}</Typography>}
                    </label>
                    <label>
                        <TextField fullWidth label="비밀번호 확인" type="password" variant="standard" onChange={(e) => setUserPasswordCheck(e.target.value)}/>
                        {validationErrors.userPasswordCheck && <Typography color="error">{validationErrors.userPasswordCheck}</Typography>}
                    </label>
                    <label>
                        <TextField fullWidth label="이름" variant="standard" onChange={(e) => setUserName(e.target.value)}/>
                        {validationErrors.userName && <Typography color="error">{validationErrors.userName}</Typography>}
                    </label>
                    <label>
                        <TextField fullWidth label="닉네임" variant="standard" onChange={(e) => setUserNickname(e.target.value)}/>
                        {validationErrors.userNickname && <Typography color="error">{validationErrors.userNickname}</Typography>}
                    </label>
                    <label>
                        <TextField fullWidth label="휴대폰 번호" variant="standard" onChange={(e) => setUserPhoneNumber(e.target.value)}/>
                        {validationErrors.userPhoneNumber && <Typography color="error">{validationErrors.userPhoneNumber}</Typography>}
                    </label>
                    <label>
                        <Box display='flex' alignItems='center' width='100%'>
                            <TextField
                                fullWidth
                                label="주소"
                                InputProps={{readOnly: true,}}
                                variant="standard"
                                onChange={(e) => setUserAddress(e.target.value)}
                                flexGrow={1}
                            />
                            <Button variant="contained" onClick={searchAddress} flexGrow={0} flexShrink={0}>
                                검색
                            </Button>
                        </Box>
                        {validationErrors.userAddress && <Typography color="error">{validationErrors.userAddress}</Typography>}
                    </label>
                    <label>
                        <TextField fullWidth label="상세 주소" variant="standard" onChange={(e) => setUserAddressDetail(e.target.value)}/>
                        {validationErrors.userAddressDetail && <Typography color="error">{validationErrors.userAddressDetail}</Typography>}
                    </label>
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