import React, {useEffect, useState} from "react";
import ChatWindow from "../../components/ChatWindow";
import { Button, Container, Typography, Box } from '@mui/material';
import {useCookies} from "react-cookie";
import axios from "axios";
import {Link} from "react-router-dom";

export default function ChatBot() {
    const [showChat, setShowChat] = useState(false); // false: 자소서 선택 화면, true: ChatWindow 화면
    const [userEmail, setUserEmail] = useState('');
    const [cookies] = useCookies(['token']);
    const [loadedContent, setLoadedContent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserEmail = async () => {
            setIsLoading(true);
            const token = cookies.token;

            if (token) {
                try {
                    const userDetails = await axios.get('/api/auth/currentUser', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUserEmail(userDetails.data.userEmail);
                } catch (error) {
                    console.error("Error fetching user email:", error);
                }
            }
        };

        fetchUserEmail();
    }, [cookies.token]);

    useEffect(() => {
        const loadIntroduceContent = async () => {
            if (userEmail) {
                try {
                    const response = await axios.get(`http://localhost:8080/get-content?userEmail=${userEmail}`);
                    const data = response.data;

                    console.log(data);

                    if (data && data.introContent) {
                        setLoadedContent(JSON.parse(data.introContent));
                    }
                } catch (error) {
                    console.error("Error loading introduce content:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadIntroduceContent();
    }, [userEmail]);

    const loadIntroduceContent = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/get-content?userEmail=${userEmail}`);
            const data = response.data;

            console.log(data);

            if (data && data.introContent) {
                setLoadedContent(JSON.parse(data.introContent));
            }
        } catch (error) {
        }
    };

    return (
        <Container maxWidth={showChat ? "md" : "sm"} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '95vh' }}>
            {isLoading ? (
                <Typography variant="h6">자소서 불러오는 중...</Typography>
            ) : (
                <>
                    {!showChat ? (
                        <>
                            <Typography variant="h4" style={{ marginBottom: '20px', whiteSpace: 'pre-line' }}>
                                {"입력한 자소서를 통해 예상 질문의 \n답을 들을 수 있는 챗봇입니다. "}
                            </Typography>
                            {loadedContent ? (
                                <>
                                    <Typography variant="h6" style={{ marginBottom: '20px', whiteSpace: 'pre-line' }}>
                                        {"자소서를 확인하였습니다. \n이제 챗봇을 사용하실 수 있습니다. "}
                                    </Typography>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={() => setShowChat(true)}
                                    >
                                        챗봇 사용하기
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6" style={{ marginBottom: '20px' }}>불러올 자소서가 없습니다. 자소서를 먼저 작성해주세요.</Typography>
                                    <Link to="/infoWrite" style={{ textDecoration: 'none' }}>
                                        <Button fullWidth variant="contained" color="secondary">
                                            자소서 작성
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </>
                    ) : (
                        <Box display="flex" flexDirection="row" alignItems="center" width="100%" justifyContent="space-between">
                            <div style={{ flex: '1', minWidth: '80%' }}>
                                <ChatWindow introContent={loadedContent} />
                            </div>
                            <div style={{ flex: '1', minWidth: '60%' }}>
                                <Typography
                                    variant="subtitle1"
                                    style={{ marginBottom: '20px', whiteSpace: 'pre-line' }}
                                >
                                    {"입력한 자소서를 참고해 예상 면접 질문을 해보세요!"}
                                </Typography>
                                <Typography variant="h6" style={{ marginBottom: '20px' }}>
                                    입력한 자소서:
                                </Typography>
                                <div style={{ height: '60vh', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
                                    {loadedContent && loadedContent.map((item, index) => (
                                        <Box key={index} mt={2} width="100%">
                                            <Typography variant="subtitle1">{`문제 ${index + 1}: ${item.question}`}</Typography>
                                            <Typography variant="body1" style={{ marginTop: '10px', whiteSpace: 'pre-line' }}>
                                                {item.answer}
                                            </Typography>
                                        </Box>
                                    ))}
                                </div>
                            </div>
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
}
