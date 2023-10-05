import React, {useEffect, useState} from "react";
import {
    Button,
    Box,
    Container,
    Typography,
    TextField,
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {useCookies} from "react-cookie";
import axios from "axios";

export default function InfoWrite() {
    const [view, setView] = useState('new');
    const [openDialog, setOpenDialog] = useState(false);
    const [questions, setQuestions] = useState(["", "", ""]);
    const [answers, setAnswers] = useState(["", "", ""]);
    const [userEmail, setUserEmail] = useState(''); // 사용자 이메일 상태 추가
    const [cookies] = useCookies(['token']);
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    useEffect(() => {
        // 현재 사용자의 이메일을 가져오는 함수
        const fetchUserEmail = async () => {
            const token = cookies.token;

            if (token) {
                try {
                    const userDetails = await axios.get('/api/auth/currentUser', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUserEmail(userDetails.data.userEmail);  // 이메일 설정
                } catch (error) {
                    console.error("Error fetching user email:", error);
                }
            }
        };

        fetchUserEmail();
    }, [cookies.token]);

    function saveIntroduceContent() {

        const introContent = questions.map((q, index) => ({
            question: q,
            answer: answers[index]
        }));

        const data = {
            userEmail: userEmail,  // 상태에서 가져온 이메일 사용
            introContent: JSON.stringify(introContent)
        };

        // 백엔드 엔드포인트에 POST 요청을 보냅니다.
        fetch('http://localhost:8080/save-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data && !data.error) { // 확인: 응답 데이터에 'error' 프로퍼티가 없는지 확인
                    alert('저장이 성공적으로 완료되었습니다.');
                    // 상태 초기화
                    setView('new');
                    setQuestions(["", "", ""]);
                    setAnswers(["", "", ""]);
                } else {
                    console.error('Error:', data.error);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const loadIntroduceContent = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/get-content?userEmail=${userEmail}`);
            const data = response.data;

            if (data && data.introContent) {
                const loadedContent = JSON.parse(data.introContent);
                const loadedQuestions = loadedContent.map(item => item.question);
                const loadedAnswers = loadedContent.map(item => item.answer);

                setQuestions(loadedQuestions);
                setAnswers(loadedAnswers);
                setView('new');
            }
        } catch (error) {
            console.error("Error loading introduce content:", error);
        }
    };


    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const addField = () => {
        if (questions.length < 5) {
            setQuestions([...questions, ""]);
            setAnswers([...answers, ""]);
        }
    };

    const removeField = () => {
        if (questions.length > 3) {
            setQuestions(questions.slice(0, -1));
            setAnswers(answers.slice(0, -1));
        }
    };

    const resetContent = () => {
        setQuestions(["", "", ""]);
        setAnswers(["", "", ""]);
    };

    return (
        <Container maxWidth="md" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
            <Box display="flex" flexDirection="row" width="100%" justifyContent="center" position="relative">
                <Typography variant="h4">자소서 작성</Typography>
                <Button variant="contained" onClick={loadIntroduceContent} style={{ position: 'absolute', right: 0, top: 0 }}>
                    자소서 불러오기
                </Button>
            </Box>

            {view === 'default' && <Typography variant="h6">자소서 작성 메뉴를 선택해주세요.</Typography>}
            {view === 'load' && <Typography variant="h6">저장된 자소서를 보여주는 화면</Typography>}

            {view === 'new' && (
                <>
                    <Typography variant="h6">자소서를 완성해주세요!</Typography>
                    {questions.map((question, index) => (
                        <Box key={index} mt={2} width="100%">
                            <TextField
                                fullWidth
                                label={`문제 ${index + 1}`}
                                variant="outlined"
                                value={question}
                                onChange={(e) => handleQuestionChange(index, e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label={`내용 작성`}
                                variant="outlined"
                                multiline
                                rows={15}
                                value={answers[index]}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                style={{ marginTop: '10px' }}
                            />
                        </Box>
                    ))}
                    <Box mt={2} display="flex" justifyContent="center">
                        <IconButton onClick={addField} disabled={questions.length >= 5}>
                            <AddIcon />
                        </IconButton>
                        <IconButton onClick={removeField} disabled={questions.length <= 3}>
                            <RemoveIcon />
                        </IconButton>
                    </Box>
                    <Box mt={3} width="100%" display="flex" justifyContent="center">
                        <Button variant="contained" color="success" onClick={saveIntroduceContent}>
                            저장
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={resetContent}
                            style={{ marginLeft: '10px' }}>
                            초기화
                        </Button>
                    </Box>
                </>
            )}
        </Container>
    );
}
