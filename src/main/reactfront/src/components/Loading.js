import React from "react";
import book from '../assets/images/loading.gif';
import {Box, Typography} from "@mui/material";

const Loading = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
            <img src={book} alt="Spinner" style={{ marginBottom: '20px', width: '200px', height: '200px' }} />
            <Typography variant="h6" style={{ marginBottom: '10px', color: '#333', fontWeight: 600, marginTop: '20px' }}>
                자기소개서를 분석하는 중입니다.
            </Typography>
            <Typography variant="h7" style={{ marginBottom: '20px', color: '#333', fontWeight: 500 }}>
                인터넷 상황에 따라 분석 시간이 달라질 수 있습니다. ( 약 2분 ~ 5분 )
            </Typography>
        </Box>
    );
}

export default Loading;