import React from "react";
import book from '../assets/images/walk.gif';
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
                페이지 로딩중입니다.
            </Typography>
        </Box>
    );
}

export default Loading;