import React from "react";
import book from '../assets/images/walk.gif';
import {Box, Typography} from "@mui/material";

const LoadingInterview = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="60vh"
        >
            <img src={book} alt="Spinner" style={{ marginBottom: '20px', width: '200px', height: '200px' }} />
            <Typography variant="h6" style={{ marginBottom: '10px', color: '#333', fontWeight: 600, marginTop: '20px' }}>
                면접 순서를 기다리는 중입니다.
            </Typography>
            <Typography variant="h7" style={{ marginBottom: '20px', color: '#333', fontWeight: 500 }}>
                인터넷 상황에 따라 면접 시간이 밀릴 수 있습니다. ( 약 1분 ~ 3분 )
            </Typography>
        </Box>
    );
}

export default LoadingInterview;