import React, { useEffect, useState, useRef } from "react";
import {
    Button,
    Container,
    Typography,
    Box,
    DialogTitle,
    ListItemText,
    List,
    DialogContent,
    ListItem, Dialog, DialogActions
} from '@mui/material';
import { useCookies } from "react-cookie";
import axios from "axios";
import ChatQuestion from "../../components/ChatQuestion";

const TextToSpeech = ({ textToRead }) => {
    const playTextToSpeech = () => {
        const utterance = new SpeechSynthesisUtterance(textToRead);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <button onClick={playTextToSpeech}>문제 목록 읽기</button>
    );
};

export default function Interview() {
    const [userEmail, setUserEmail] = useState('');
    const [cookies] = useCookies(['token']);
    const [loadedContent, setLoadedContent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [interviewInProgress, setInterviewInProgress] = useState(false);
    const [gptResponse, setGptResponse] = useState(''); // GPT 응답을 저장할 상태
    const [showImage, setShowImage] = useState(false);
    const [problems, setProblems] = useState([]); // 문제 목록 상태 추가
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [speechRecognition, setSpeechRecognition] = useState(null);
    const [recognizedText, setRecognizedText] = useState('');
    const [listening, setListening] = useState(false);
    const [recordedText, setRecordedText] = useState([]); // 음성 인식 결과를 저장할 배열 추가
    const [interviewCompleted, setInterviewCompleted] = useState(false); // 면접 완료 여부를 추적하는 상태 추가

    const videoRef = useRef(null);
    const [openSelectDialog, setOpenSelectDialog] = useState(false);
    const [titlesList, setTitlesList] = useState([]);
    const [selectedIntro, setSelectedIntro] = useState(null);
    const [step, setStep] = useState(1);
    const [gptResponsesReceived, setGptResponsesReceived] = useState(0);

    const openTitleDialog = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/get-titles?userEmail=${userEmail}`);
            setTitlesList(response.data);
            setOpenSelectDialog(true);
        } catch (error) {
            console.error("Error loading titles:", error);
        }
    };

    const selectIntroduceContent = async (selectedTitle) => {
        try {
            const response = await axios.get(`http://localhost:8080/get-content-by-title?userEmail=${userEmail}&title=${selectedTitle}`);
            const data = response.data;

            if (data && data.introContent) {
                setSelectedIntro(JSON.parse(data.introContent));
                setOpenSelectDialog(false);
            }
        } catch (error) {
            console.error("Error loading introduce content:", error);
        }
        setStep(2);
    };

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("웹캠을 시작하는 중에 오류가 발생했습니다: ", error);
        }
    };

    // GPT 응답을 처리하는 함수
    const handleGptResponse = (response) => {
        setGptResponse(response);
        setProblems(extractProblems(response));
        setGptResponsesReceived(prevCount => prevCount + 1); // GPT 응답 횟수 증가

        if (gptResponsesReceived === 1) { // 두 번째 응답을 받았을 때만 화면 전환
            setStep(3);
        }
    };

    const extractProblems = (text) => {
        const problemRegex = /\d+\.\s(.*?)(?=\d+\.\s|$)/gs;
        const matches = text.match(problemRegex);

        if (matches) {
            const problems = matches.map((match, index) => {
                return {
                    number: index + 1,
                    content: match.trim(),
                };
            });
            return problems;
        } else {
            return [];
        }
    };

    useEffect(() => {
        // SpeechRecognition 초기화
        const recognition = new window.webkitSpeechRecognition || new window.SpeechRecognition();
        recognition.lang = "ko-KR"; // 한국어로 설정
        recognition.continuous = true; // 연속 음성 인식 활성화
        recognition.interimResults = true; // 중간 결과 표시

        recognition.onstart = () => {
            setRecognizedText(''); // 초기화 인식 텍스트
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            setRecognizedText(finalTranscript);
        };

        setSpeechRecognition(recognition);
    }, []);

    const startListening = () => {
        if (speechRecognition) {
            speechRecognition.start();
            setListening(true);
        }
    };

    const stopListening = () => {
        if (speechRecognition) {
            speechRecognition.stop();
            setListening(false);
        }
    };

    const saveRecordedText = () => {
        if (recognizedText.trim() !== "") {
            setRecordedText([...recordedText, recognizedText]);
            setRecognizedText(""); // 음성 인식 텍스트 초기화
        }
    };

    const handleInterviewCompletion = () => {
        setInterviewCompleted(true);
        setInterviewInProgress(false);
        setCurrentProblemIndex(0);
    };

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
                } finally {
                    setIsLoading(false);
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

                    if (data && data.introContent) {
                        setLoadedContent(JSON.parse(data.introContent));
                    }
                } catch (error) {
                    console.error("Error loading introduce content:", error);
                }
            }
        };

        loadIntroduceContent();
    }, [userEmail]);

    const startInterview = () => {
        if (problems.length > 0) {
            setRecordedText([]); // 녹음된 텍스트 초기화
            setInterviewCompleted(false);
            setInterviewInProgress(true);
            setShowImage(true);
            setCurrentProblemIndex(0);
            startWebcam(); // 면접 시작 시 웹캠을 실행합니다.
        }
    };

    const nextProblem = () => {
        if (currentProblemIndex < problems.length - 1) {
            setCurrentProblemIndex(currentProblemIndex + 1);
        } else {
            // 모든 문제가 표시된 경우에 대한 처리를 추가
        }
    };

    return (
        <div>
            <h1>모의 면접</h1>

            {step === 1 && (
                <div>
                    <Button variant="contained" color="primary" onClick={openTitleDialog}>
                        자소서 선택하기
                    </Button>

                    <Dialog open={openSelectDialog} onClose={() => setOpenSelectDialog(false)}>
                        <DialogTitle>자소서 선택</DialogTitle>
                        <DialogContent>
                            <List>
                                {titlesList.map((title, index) => (
                                    <ListItem button key={index} onClick={() => selectIntroduceContent(title)}>
                                        <ListItemText primary={title} />
                                    </ListItem>
                                ))}
                            </List>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenSelectDialog(false)} color="primary">
                                취소
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}

            {step === 2 && (
                <>
                    <div style={{ display: 'none' }}>
                        <ChatQuestion introContent={selectedIntro} onGptResponse={handleGptResponse} />
                    </div>
                    {gptResponse ? (
                        <div>
                            <h2>GPT 응답</h2>
                            <p>{gptResponse}</p>
                            <TextToSpeech textToRead={problems.map(problem => problem.content).join('. ')} />
                            <Button variant="contained" color="primary" onClick={() => setStep(3)}>
                                면접 시작 화면으로 이동
                            </Button>
                        </div>
                    ) : (
                        <p>챗봇 불러오는중...</p>
                    )}
                </>
            )}

            {step === 3 && (
                <div>
                    <h2>자기 소개</h2>
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

                    <Button variant="contained" color="primary" onClick={startInterview}>
                        면접 시작
                    </Button>

                    {interviewInProgress ? (
                        <div>
                            <h2>면접 질문</h2>
                            <p>{problems[currentProblemIndex].content}</p>
                            <div>
                                <button onClick={startListening} disabled={listening}>
                                    음성 인식 시작
                                </button>
                                <button onClick={stopListening} disabled={!listening}>
                                    음성 인식 멈춤
                                </button>
                                <button onClick={saveRecordedText}>음성 인식 완료</button>
                                <div>
                                    <p>{recognizedText}</p>
                                </div>
                            </div>
                            <TextToSpeech textToRead={problems[currentProblemIndex].content} />
                            <Button variant="contained" color="primary" onClick={nextProblem}>
                                다음 문제
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleInterviewCompletion}>
                                면접 종료
                            </Button>
                            {showImage && <img alt="people" src="/img/img/people.jpg" height='500' style={{margin: '0px 10px 0px 0px'}}/>}
                            <video ref={videoRef} autoPlay playsInline height="500"></video>
                        </div>
                    ) : null}

                    {interviewCompleted && (
                        <div>
                            <h2>면접 완료</h2>
                            <p>면접에서 음성 인식된 텍스트:</p>
                            <ul>
                                {problems.map((problem, index) => (
                                    <li key={`problem-${index}`}>
                                        <strong>문제 내용:</strong> {problem.content}
                                    </li>
                                ))}
                                {recordedText.map((text, index) => (
                                    <li key={`recordedText-${index}`}>
                                        <strong>음성 인식 결과:</strong> {text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

}