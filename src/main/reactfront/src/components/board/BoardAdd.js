import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Avatar, Container } from '@mui/material';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';

const BoardAdd = () => {
    const [cookies] = useCookies(['token']);
    const [user, setUser] = useState({});
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [postImagePreview, setPostImagePreview] = useState(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, [cookies.token]);

    const handlePostImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            let selectedFile = e.target.files[0];
            setPostImage(selectedFile);

            let reader = new FileReader();
            reader.onload = (event) => {
                setPostImagePreview(event.target.result);
            }
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleCreatePost = async () => {
        if (!postTitle || !postContent) {
            alert('제목과 내용을 모두 작성해주세요.');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('boardTitle', postTitle);
        formData.append('boardWriterEmail', user.userEmail);
        formData.append('boardWriterNickname', user.userNickname);
        formData.append('boardWriterProfile', user.userProfile);
        formData.append('boardContent', postContent);
        if (postImage) {
            formData.append('postImage', postImage);
        }

        try {
            const response = await axios.post('/board/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                alert('게시글 작성이 완료되었습니다.');
                navigate('/board');
            } else {
                setErrorMessage('게시글 작성 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error("Error creating post:", error);
            setErrorMessage('게시글 작성 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" gutterBottom>
                글 작성
            </Typography>

            <Avatar src={user.userProfile} style={{ width: 60, height: 60, marginBottom: 20 }} />

            <Typography variant="h6" gutterBottom>
                {user.userNickname}
            </Typography>

            <TextField  // 제목 입력 필드
                fullWidth
                label="제목"
                variant="outlined"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                style={{ marginBottom: '20px' }}
            />

            <TextField
                fullWidth
                label="내용"
                variant="outlined"
                multiline
                rows={4}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
            />

            <Box mt={2}>
                {postImagePreview && <img src={postImagePreview} alt="Post Preview" style={{ width: '100%', maxHeight: 300 }} />}
                <input accept="image/*" style={{ display: 'none' }} id="post-icon-button-file" type="file" onChange={handlePostImageChange} />
                <label htmlFor="post-icon-button-file">
                    <Button variant="contained" component="span">사진</Button>
                </label>
            </Box>

            {errorMessage && (
                <Box mt={2}>
                    <Typography color="error">{errorMessage}</Typography>
                </Box>
            )}

            <Box mt={3}>
                <Button fullWidth variant="contained" color="primary" onClick={handleCreatePost} disabled={isLoading}>
                    {isLoading ? '게시 중...' : '게시'}
                </Button>
            </Box>
        </Container>
    );
}

export default BoardAdd;
