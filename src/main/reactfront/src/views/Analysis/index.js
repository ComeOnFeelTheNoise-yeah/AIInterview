import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Button,
    TextField,
    Container,
    Typography,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCookies } from "react-cookie";
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { BarController, BarElement, CategoryScale, LinearScale, Chart } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale);

function Analysis() {
    const [view, setView] = useState('start');
    const [questions, setQuestions] = useState(["", "", ""]);
    const [answers, setAnswers] = useState(["", "", ""]);
    const [result, setResult] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [titlesList, setTitlesList] = useState([]);
    const [cookies] = useCookies(['token']);
    const [loading, setLoading] = useState(false);
    const [spellingCheckResult, setSpellingCheckResult] = useState([]);
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);

    const initialChartData = {
        labels: [],
        datasets: []
    };

    const [chartData, setChartData] = useState(initialChartData);

    const analysisResults = {
        글로벌역량: 75,
        능동: 85,
        도전: 65,
        성실: 90,
        소통: 70,
        인내심: 60,
        정직: 80,
        주인의식: 85,
        창의: 70,
        팀워크: 90
    };

    useEffect(() => {
        const updatedChartData = {
            labels: Object.keys(analysisResults),
            datasets: [
                {
                    label: '성향 분석 결과',
                    data: Object.values(analysisResults),
                    backgroundColor: 'rgba(75,192,192,0.6)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(75,192,192,0.4)',
                    hoverBorderColor: 'rgba(75,192,192,1)'
                }
            ]
        };
        setChartData(updatedChartData);
    }, [analysisResults]);

    useEffect(() => {
        if (chartInstance) {
            chartInstance.destroy();
        }
    }, [chartData]);

    useEffect(() => {
        const fetchUserEmail = async () => {
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
        if (chartInstance) {
            chartInstance.destroy();
        }
    }, [chartData]);

    const handleStartAnalysis = () => {
        setView('write');
    };

    const handleCheck = async () => {
        setView('loading');
        let correctedTextAccumulator = [];

        try {
            const combinedText = questions.map((q, index) => `${q}\n${answers[index]}`).join('\n\n');
            const plagiarismResponse = await axios.post('/api/checkPlagiarism', { content: combinedText });
            setResult(plagiarismResponse.data);

            for (let i = 0; i < questions.length; i++) {
                const textPair = `${questions[i]}\n${answers[i]}`;
                const spellingCheckResponse = await axios.post('/api/checkSpellingWithGPT', { text: textPair });
                if (spellingCheckResponse.data && spellingCheckResponse.data.corrected_text) {
                    correctedTextAccumulator.push(spellingCheckResponse.data.corrected_text);
                } else {
                    console.error("API did not return the expected 'corrected_text' property for question-answer pair " + (i + 1));
                    correctedTextAccumulator.push("Error: Could not fetch corrected text");
                }
            }

            // 키워드 분석 API 호출
            const keywordAnalysisResponse = await axios.post('/api/analyzeKeywords', { content: combinedText });
            const keywordAnalysisResults = keywordAnalysisResponse.data;

            // API 응답을 그래프 데이터로 변환
            const labels = keywordAnalysisResults.map(result => Object.keys(result)[0]);
            const data = keywordAnalysisResults.map(result => Object.values(result)[0]);

            setChartData({
                labels: labels,
                datasets: [{
                    label: '키워드 분석 결과',
                    data: data,
                    backgroundColor: 'rgba(75,192,192,0.6)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(75,192,192,0.4)',
                    hoverBorderColor: 'rgba(75,192,192,1)'
                }]
            });


            setSpellingCheckResult(correctedTextAccumulator);
            setView('result');
        } catch (error) {
            console.error("Error checking plagiarism or spelling:", error);
            setView('write');
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

    const handleReset = () => {
        setQuestions(["", "", ""]);
        setAnswers(["", "", ""]);
    };

    const openTitleDialog = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/get-titles?userEmail=${userEmail}`);
            setTitlesList(response.data);
            setOpenDialog(true);
        } catch (error) {
            console.error("Error loading titles:", error);
        }
    };

    const loadSelectedIntroduceContent = async (selectedTitle) => {
        try {
            const response = await axios.get(`http://localhost:8080/get-content-by-title?userEmail=${userEmail}&title=${selectedTitle}`);
            const data = response.data;
            if (data && data.introContent) {
                const loadedContent = JSON.parse(data.introContent);
                const loadedQuestions = loadedContent.map(item => item.question);
                const loadedAnswers = loadedContent.map(item => item.answer);
                setQuestions(loadedQuestions);
                setAnswers(loadedAnswers);
                setOpenDialog(false);
            }
        } catch (error) {
            console.error("Error loading introduce content:", error);
        }
    };

    const chartOptions = {
        scales: {
            x: {
                type: 'category'
            },
            y: {
                type: 'linear',
                ticks: {
                    stepSize: 20
                }
            }
        },
        maintainAspectRatio: false
    };

    return (
        <Container maxWidth="md" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
            {view === 'start' && (
                <Button variant="contained" color="primary" onClick={handleStartAnalysis}>
                    자소서 분석 시작하기
                </Button>
            )}

            {view === 'loading' && <CircularProgress />}

            {view === 'write' && (
                <>
                    <Box display="flex" flexDirection="row" width="100%" justifyContent="center" position="relative">
                        <Typography variant="h4">자소서 작성</Typography>
                        <Button variant="contained" onClick={openTitleDialog} style={{ position: 'absolute', right: 0, top: 0 }}>
                            자소서 불러오기
                        </Button>
                    </Box>

                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        <DialogTitle>자소서 선택</DialogTitle>
                        <List>
                            {titlesList.map((title, index) => (
                                <ListItem key={index} button onClick={() => loadSelectedIntroduceContent(title)}>
                                    <ListItemText primary={title} />
                                </ListItem>
                            ))}
                        </List>
                    </Dialog>

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

                    <Box mt={2} display="flex" justifyContent="center">
                        <Button variant="contained" color="secondary" onClick={handleReset}>
                            초기화
                        </Button>
                    </Box>

                    <Box mt={3} mb={5} width="100%" display="flex" justifyContent="center">
                        <Button variant="contained" color="primary" onClick={handleCheck}>
                            결과 확인
                        </Button>
                    </Box>
                </>
            )}

            {view === 'result' && (
                <>
                    <Typography variant="h5">분석 결과</Typography>
                    <Typography variant="h6">Similarity: {result.similarity.toFixed(2)}%</Typography>
                    <Typography variant="h6">Plagiarism: {result.isPlagiarized ? "Yes" : "No"}</Typography>

                    <Box mt={3}>
                        <Typography variant="h6">맞춤법 검사 결과:</Typography>
                        {spellingCheckResult.map((result, index) => (
                            <Box mt={2} key={index}>
                                <Typography variant="h7">문제 {index + 1}:</Typography>
                                <Typography variant="body1">{result}</Typography>
                            </Box>
                        ))}
                    </Box>

                    <Box mt={3} width="100%">
                        <Bar
                            ref={chartRef}
                            data={chartData}  // 이 부분을 수정하여 chartData를 사용
                            options={chartOptions}
                            height={400}
                            onElementsClick={(elements) => {
                                if (elements.length > 0) {
                                    const chart = chartRef.current.chartInstance;
                                    setChartInstance(chart);
                                }
                            }}
                        />
                    </Box>
                </>
            )}
        </Container>
    );
}

export default Analysis;
