import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Avatar, Container } from '@mui/material';
import {useCookies} from "react-cookie";

export default function MemberChange() {
    const [isVerified, setIsVerified] = useState(false);
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [cookies] = useCookies(['token']);
    const [userProfile, setUserProfile] = useState(null); // 프로필 이미지 상태

    const [user, setUser] = useState({
        userEmail: '',
        userName: '',
        userNickname: '',
        userPhoneNumber: '',
        userAddress: ''
    });

    // 유효성 검사 상태 추가
    const [validationErrors, setValidationErrors] = useState({});
    const [isNicknameValid, setIsNicknameValid] = useState(null);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [initialNickname, setInitialNickname] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = cookies.token;

            if (token) {
                try {
                    const userDetails = await axios.get('/api/auth/currentUser', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUser(userDetails.data);
                    setInitialNickname(userDetails.data.userNickname);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();

        const script = document.createElement('script');
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, [cookies.token]);

    const validateForm = () => {
        let errors = {};

        // 이름 유효성 검사
        const namePattern = /^[가-힣]{2,4}$/;
        if (!namePattern.test(user.userName)) {
            errors.userName = "이름이 올바르지 않습니다.";
        }

        // 닉네임 유효성 검사
        if (!user.userNickname) {
            errors.userNickname = "닉네임을 입력해주세요.";
        }

        // 휴대폰 번호 유효성 검사
        const phonePattern = /^[0-9]{10,11}$/;
        if (!phonePattern.test(user.userPhoneNumber)) {
            errors.userPhoneNumber = "올바른 휴대폰 번호를 입력해주세요.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const checkNicknameDuplicate = async () => {
        const response = await axios.post('/api/auth/checkNickname', { userNickname: user.userNickname });
        setIsNicknameChecked(true);
        if (response.data.isDuplicate) {
            alert('닉네임이 이미 사용 중입니다.');
            setIsNicknameValid(false);
        } else {
            alert('사용 가능한 닉네임입니다.');
            setIsNicknameValid(true);
        }
    }

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
                setErrorMessage('비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (event) => {
                setUserProfile(event.target.result);
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const uploadProfileImage = async (image) => {
        const formData = new FormData();
        formData.append('image', image);
        console.log("Uploading image:", image);
        for (let pair of formData.entries()) {
            console.log("image:", image);
            console.log(pair[0]+ ', ' + pair[1]);
        }

        try {
            const response = await axios.post('/api/upload/uploadProfileImage', formData);
            console.log("Server response:", response.data);
            return response.data.imageUrl;
        } catch (error) {
            console.error("Error uploading the image:", error);
        }
    }


    const handleUpdate = async () => {
        if (!validateForm()) return;
        if (initialNickname !== user.userNickname && !isNicknameValid) {
            alert("닉네임을 변경하였습니다. 닉네임 중복 검사를 해주세요.");
            return;
        }

        let updatedUser = { ...user };

        if (userProfile) {
            const imageUrl = await uploadProfileImage(userProfile);
            console.log("profile image:", imageUrl);
            if (imageUrl) {
                updatedUser.userProfile = imageUrl;
                console.log("profile image:", updatedUser.userProfile);
            }
        }
        console.log("Sending profile image:", updatedUser.userProfile);

        try {
            // 토큰을 이용하여 인증
            const token = cookies.token;

            const response = await axios.post('/api/auth/updateUserInfo', user, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                alert("사용자 정보가 성공적으로 수정되었습니다.");
            } else {
                alert("사용자 정보가 성공적으로 수정되었습니다.");
            }
        } catch (error) {
            console.error("Error updating user info:", error);
            alert("사용자 정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    const searchAddress = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                let addr = '';
                if (data.userSelectedType === 'R') {
                    addr = data.roadAddress;
                } else {
                    addr = data.jibunAddress;
                }
                setUser(prevState => ({ ...prevState, userAddress: addr }));
            }
        }).open();
    };

    if (!isVerified) {
        return (
            <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <Typography variant="h6">비밀번호 확인</Typography>
                <TextField
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handlePasswordVerification}>확인</Button>
                {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            </Container>
        );
    }

    return (
        <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Avatar src={userProfile || user.userProfile} style={{ width: 100, height: 100, marginBottom: 20 }} />
            <input accept="image/*" style={{ display: 'none' }} id="icon-button-file" type="file" onChange={handleImageChange} />
            <label htmlFor="icon-button-file">
                <Button variant="contained" component="span">프로필 사진 변경</Button>
            </label>
            <Box mt={2} width="100%">
                <Box display="flex" alignItems="center" mt={2}>
                    <TextField
                        fullWidth
                        label="이메일 주소"
                        type="email"
                        variant="standard"
                        value={user.userEmail}
                        disabled
                    />
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                    <TextField
                        fullWidth
                        label="이름"
                        variant="standard"
                        value={user.userName}
                        error={!!validationErrors.userName}
                        helperText={validationErrors.userName}
                        onChange={(e) => setUser(prev => ({ ...prev, userName: e.target.value }))}
                    />
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                    <TextField
                        fullWidth
                        label="닉네임"
                        variant="standard"
                        value={user.userNickname}
                        error={!!validationErrors.userNickname}
                        helperText={validationErrors.userNickname}
                        style={{ flex: 1 }}
                        onChange={(e) => setUser(prev => ({ ...prev, userNickname: e.target.value }))}
                    />
                    <Button variant="contained" onClick={checkNicknameDuplicate} style={{ marginLeft: 10 }}>
                        중복 검사
                    </Button>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                    <TextField
                        fullWidth
                        label="휴대폰 번호"
                        variant="standard"
                        value={user.userPhoneNumber}
                        error={!!validationErrors.userPhoneNumber}
                        helperText={validationErrors.userPhoneNumber}
                        onChange={(e) => setUser(prev => ({ ...prev, userPhoneNumber: e.target.value }))}
                    />
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                    <TextField
                        fullWidth
                        label="주소"
                        variant="standard"
                        value={user.userAddress}  // value 설정
                        error={!!validationErrors.userAddress}
                        helperText={validationErrors.userAddress}
                        style={{ flex: 1 }}
                        onChange={(e) => setUser(prev => ({ ...prev, userAddress: e.target.value }))}  // onChange 설정
                    />
                    <Button variant="contained" onClick={searchAddress} style={{ marginLeft: 10 }}>
                        검색
                    </Button>
                </Box>
                <Box mt={2}>
                    <Button fullWidth onClick={handleUpdate}>
                        수정하기
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
