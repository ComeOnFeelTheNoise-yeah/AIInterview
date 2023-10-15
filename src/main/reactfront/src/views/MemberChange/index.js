import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Avatar, Container } from '@mui/material';
import { useCookies } from "react-cookie";
import {useNavigate} from "react-router-dom";

export default function MemberChange() {
    const [isVerified, setIsVerified] = useState(false);
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [cookies] = useCookies(['token']);
    const [userProfile, setUserProfile] = useState(null);
    const [userProfilePreview, setUserProfilePreview] = useState(null);
    const navigate = useNavigate();

    const [user, setUser] = useState({
        userEmail: '',
        userName: '',
        userNickname: '',
        userPhoneNumber: '',
        userAddress: ''
    });

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

        const namePattern = /^[가-힣]{2,4}$/;
        if (!namePattern.test(user.userName)) {
            errors.userName = "이름이 올바르지 않습니다.";
        }

        if (!user.userNickname) {
            errors.userNickname = "닉네임을 입력해주세요.";
        }

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
    };

    const handlePasswordVerification = async () => {
        try {
            const token = cookies.token;
            if (!token) {
                setErrorMessage('Token not found. Please log in again.');
                return;
            }
            const response = await axios.post('/api/auth/verifyPassword', { password, token });
            if (response.data.isValid) {
                setIsVerified(true);
                const userDetails = await axios.get('/api/auth/currentUser', {
                    headers: {
                        Authorization: `Bearer ${token}`
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
            let selectedFile = e.target.files[0];

            // 파일 객체를 userProfile 상태에 저장
            setUserProfile(selectedFile);

            // 이미지 프리뷰를 위해 FileReader를 사용
            let reader = new FileReader();
            reader.onload = (event) => {
                setUserProfilePreview(event.target.result);
            }
            reader.readAsDataURL(selectedFile);
        }
    };


    const uploadProfileImageToServer = async (imageFile) => {
        const formData = new FormData();
        formData.append('profileImage', imageFile);

        try {
            const response = await axios.post('/api/uploadProfileImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data && response.data.imageUrl) {
                return response.data.imageUrl;
            }
            console.error("Error from server:", response.data);
        } catch (error) {
            console.error("Error uploading the image:", error.response.data);
        }
    };



    const handleUpdate = async () => {
        if (!validateForm()) return;
        if (initialNickname !== user.userNickname && !isNicknameValid) {
            alert("닉네임을 변경하였습니다. 닉네임 중복 검사를 해주세요.");
            return;
        }

        let updatedUser = { ...user };

        if (userProfile) {
            console.error("userProfile:", userProfile);
            const imageUrl = await uploadProfileImageToServer(userProfile);
            console.error("imageUrl:", imageUrl);
            if (imageUrl) {
                updatedUser.userProfile = imageUrl;
            }
        }

        try {
            const token = cookies.token;
            const response = await axios.post('/api/auth/updateUserInfo', updatedUser, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);

            if (response.data.result) {
                alert("사용자 정보가 성공적으로 수정되었습니다.");
                navigate('/');
                window.location.reload();
            } else {
                alert("사용자 정보 수정 중 오류가 발생했습니다.");
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
            <Container
                maxWidth="xs"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    backgroundColor: '#f4f4f8',
                    padding: 3
                }}
            >
                <Typography
                    variant="h6"
                    sx={{ marginBottom: 2 }}
                >
                    비밀번호 확인
                </Typography>
                <TextField
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ marginBottom: 1 }}
                />
                {errorMessage && <Typography color="error" sx={{ marginBottom: 2 }}>{errorMessage}</Typography>}
                <Button
                    sx={{
                        backgroundColor: '#3f51b5',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#303f9f'
                        }
                    }}
                    onClick={handlePasswordVerification}
                >
                    확인
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Avatar className="user-avatar" src={userProfilePreview || user.userProfile} style={{ width: 100, height: 100, marginBottom: 20 }} />
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
                        value={user.userAddress}
                        error={!!validationErrors.userAddress}
                        helperText={validationErrors.userAddress}
                        style={{ flex: 1 }}
                        onChange={(e) => setUser(prev => ({ ...prev, userAddress: e.target.value }))}
                    />
                    <Button variant="contained" onClick={searchAddress} style={{ marginLeft: 10 }}>
                        검색
                    </Button>
                </Box>
                <Box mt={4}>
                    <Button fullWidth onClick={handleUpdate}>
                        수정하기
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
