import React, {useEffect, useState} from "react";
import axios from "axios";
import {Box, Button, Card, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {signUpApi} from "../../../apis";

export default function SignUp({setAuthView}){
    const Purple4th = '#999aae';
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

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // 주소 검색 버튼 핸들러
    const searchAddress = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                let addr = ''; // 주소 변수
                // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                    addr = data.roadAddress;
                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                    addr = data.jibunAddress;
                }
                // React 상태 업데이트
                setUserAddress(addr); // state 업데이트 함수는 상황에 맞게 수정하세요.
            }
        }).open();
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
        <container style={{
            position: 'absolute', top: "0%",
            left: "0%", width: "100%", height: "100%", backgroundColor: Purple4th
        }}>
            <div style={{position: 'relative'}}>
                <div>
                    <img alt="loginBackground" src="/img/img/registerBackground.png" width="100%"/>
                </div>
                <div>
                    <label>
                        <Box display="flex" alignItems="center">
                            <TextField fullWidth sx={{ width: '20%' }} label="이메일 주소" type="email" variant="standard" onChange={(e) => setUserEmail(e.target.value)} style={{
                                fontSize: '1.9vw', position: 'absolute', top: "30%",
                                left: "60%", transform: "translate( -30%, -60%)"
                            }} />
                            {validationErrors.userEmail && <Typography color="error" style={{
                                fontSize: '0.65vw', position: 'absolute', top: "33%",
                                left: "57.3%", transform: "translate( -30%, -60%)"
                            }}>{validationErrors.userEmail}</Typography>}
                        </Box>
                    </label>
                    <label>
                        <Box display="flex" alignItems="center">
                            <TextField
                                fullWidth sx={{ width: '20%' }}
                                label="비밀번호"
                                type="password"
                                variant="standard"
                                onChange={(e) => setUserPassword(e.target.value)} style={{
                                fontSize: '1.9vw', position: 'absolute', top: "36%",
                                left: "60%", transform: "translate( -30%, -60%)"
                            }}/>
                            <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }} style={{
                                fontSize: '0.7vw', position: 'absolute', top: "37%",
                                left: "67%", transform: "translate( -30%, -60%)"
                            }}>
                                4~12자, 영문, 숫자 혼용
                            </Typography>
                        </Box>
                        {validationErrors.userPassword && <Typography color="error" style={{
                            fontSize: '0.65vw', position: 'absolute', top: "39%",
                            left: "59.8%", transform: "translate( -30%, -60%)"
                        }}>{validationErrors.userPassword}</Typography>}
                    </label>
                    <label>
                        <Box display="flex" alignItems="center">
                            <TextField fullWidth sx={{ width: '20%' }} label="비밀번호 확인" type="password" variant="standard" onChange={(e) => setUserPasswordCheck(e.target.value)} style={{
                                fontSize: '1.9vw', position: 'absolute', top: "42%",
                                left: "60%", transform: "translate( -30%, -60%)"
                            }} />
                            <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }} style={{
                                fontSize: '0.7vw', position: 'absolute', top: "43%",
                                left: "69%", transform: "translate( -30%, -60%)"
                            }}>
                                비밀번호 확인
                            </Typography>
                        </Box>
                        {validationErrors.userPasswordCheck && <Typography color="error" style={{
                            fontSize: '0.65vw', position: 'absolute', top: "45%",
                            left: "56.9%", transform: "translate( -30%, -60%)"
                        }}>{validationErrors.userPasswordCheck}</Typography>}
                    </label>
                    <label>
                        <Box display="flex" alignItems="center">
                            <TextField fullWidth sx={{ width: '20%' }} label="이름" variant="standard" onChange={(e) => setUserName(e.target.value)} style={{
                                fontSize: '1.9vw', position: 'absolute', top: "48%",
                                left: "60%", transform: "translate( -30%, -60%)"
                            }} />
                            <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }} style={{
                                fontSize: '0.7vw', position: 'absolute', top: "49%",
                                left: "68.5%", transform: "translate( -30%, -60%)"
                            }}>
                                한글 2~4자 이내
                            </Typography>
                        </Box>
                        {validationErrors.userName && <Typography color="error" style={{
                            fontSize: '0.65vw', position: 'absolute', top: "51%",
                            left: "56.4%", transform: "translate( -30%, -60%)"
                        }}>{validationErrors.userName}</Typography>}
                    </label>
                    <label>
                        <Box display="flex" alignItems="center">
                            <TextField fullWidth sx={{ width: '20%' }} label="닉네임" variant="standard" onChange={(e) => setUserNickname(e.target.value)} style={{
                                fontSize: '1.9vw', position: 'absolute', top: "54%",
                                left: "60%", transform: "translate( -30%, -60%)"
                            }} />
                        </Box>
                        {validationErrors.userNickname && <Typography color="error" style={{
                            fontSize: '0.65vw', position: 'absolute', top: "57%",
                            left: "56.1%", transform: "translate( -30%, -60%)"
                        }}>{validationErrors.userNickname}</Typography>}
                    </label>
                    <label>
                        <Box display="flex" alignItems="center">
                            <TextField fullWidth sx={{ width: '20%' }} label="휴대폰 번호" variant="standard" onChange={(e) => setUserPhoneNumber(e.target.value)} style={{
                                fontSize: '1.9vw', position: 'absolute', top: "60%",
                                left: "60%", transform: "translate( -30%, -60%)"
                            }} />
                            <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }} style={{
                                fontSize: '0.7vw', position: 'absolute', top: "61%",
                                left: "68%", transform: "translate( -30%, -60%)"
                            }}>
                                '-'없이 숫자만 입력
                            </Typography>
                        </Box>
                        {validationErrors.userPhoneNumber && <Typography color="error" style={{
                            fontSize: '0.65vw', position: 'absolute', top: "63%",
                            left: "57.2%", transform: "translate( -30%, -60%)"
                        }}>{validationErrors.userPhoneNumber}</Typography>}
                    </label>
                    <label>
                        <Box display='flex' alignItems='center' width='100%'>
                            <TextField
                                fullWidth sx={{ width: '20%' }}
                                label="주소"
                                InputProps={{readOnly: true,}}
                                InputLabelProps={{ shrink: userAddress ? true : undefined }}
                                variant="standard"
                                value={userAddress}
                                onChange={(e) => setUserAddress(e.target.value)}
                                style={{
                                    fontSize: '1.9vw', position: 'absolute', top: "66.5%",
                                    left: "60%", transform: "translate( -30%, -60%)"
                                }}
                                flexGrow={1}
                            />
                            <Button variant="contained" onClick={searchAddress} flexGrow={0} flexShrink={0} style={{
                                fontSize: '0.7vw', position: 'absolute', top: "67%",
                                left: "71%", transform: "translate( -30%, -60%)"
                            }}>
                                검색
                            </Button>
                        </Box>
                        {validationErrors.userAddress && <Typography color="error" style={{
                            fontSize: '0.65vw', position: 'absolute', top: "69.5%",
                            left: "56.9%", transform: "translate( -30%, -60%)"
                        }}>{validationErrors.userAddress}</Typography>}
                    </label>
                    <label>
                        <Box display="flex" alignItems="center">
                            <TextField fullWidth sx={{ width: '20%' }} label="상세 주소" variant="standard" onChange={(e) => setUserAddressDetail(e.target.value)} style={{
                                fontSize: '1.9vw', position: 'absolute', top: "72.5%",
                                left: "60%", transform: "translate( -30%, -60%)"
                            }} />
                            <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }} style={{
                                fontSize: '0.7vw', position: 'absolute', top: "73.5%",
                                left: "69%", transform: "translate( -30%, -60%)"
                            }}>
                                상세 주소 입력
                            </Typography>
                        </Box>
                        {validationErrors.userAddressDetail && <Typography color="error" style={{
                            fontSize: '0.65vw', position: 'absolute', top: "75.5%",
                            left: "56.5%", transform: "translate( -30%, -60%)"
                        }}>{validationErrors.userAddressDetail}</Typography>}
                    </label>

                </div>
                <img alt="loginBackground" src="/img/img/signINBtn.png" width="10%" onClick={() => setAuthView(false)} style={{
                    position: 'absolute', top: "81%",
                    left: "39.2%", transform: "translate( -81.4%, -39.2%)"
                }}/>
                <img alt="loginBackground" src="/img/img/signUPBtn.png" width="10%" onClick={() => signUpHandler()} style={{
                    position: 'absolute', top: "82%",
                    left: "66.88%", transform: "translate( -83.1%, -66.88%)"
                }}/>
            </div>
        </container>
    )
}