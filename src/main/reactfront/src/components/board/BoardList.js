import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Avatar,
    Container,
    Typography,
    Box
} from '@mui/material';

const BoardList = () => {
    const [boards, setBoards] = useState([]);
    const [user, setUser] = useState({});
    const navigation = useNavigate();
    const [cookies] = useCookies(['token']);
    const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 상태 변수
    const postsPerPage = 10;

    useEffect(() => {
        axios.get('/board').then(response => {
            setBoards(response.data);
        });

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

    const handleTitleClick = async (board) => {
        try {
            if (user.userNickname !== board.boardWriterNickname) { // 작성자와 현재 사용자가 다른 경우에만
                await axios.post(`/board/${board.boardNumber}/incrementView`);
            }
            navigation(`/boardDetail/${board.boardNumber}`);
        } catch (error) {
            console.error("Error incrementing view count:", error);
        }
    }

    const indexOfLastPost = currentPage * postsPerPage;  // 현재 페이지의 마지막 게시물 인덱스
    const indexOfFirstPost = indexOfLastPost - postsPerPage;  // 현재 페이지의 첫 번째 게시물 인덱스
    const currentPosts = boards.slice(indexOfFirstPost, indexOfLastPost);  // 현재 페이지의 게시물들

    const totalPages = Math.ceil(boards.length / postsPerPage);  // 총 페이지 수

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                커뮤니티
            </Typography>
            <Box display="flex" justifyContent="flex-end" style={{ marginTop: '20px', marginRight: '50px' }}>
                <Button variant="contained" color="primary" onClick={() => navigation('/boardAdd')}>
                    글작성
                </Button>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>글번호</TableCell>
                        <TableCell>제목</TableCell>
                        <TableCell>작성자</TableCell>
                        <TableCell>프로필사진</TableCell>
                        <TableCell>작성 날짜</TableCell>
                        <TableCell>조회수</TableCell> {/* 조회수 헤더 추가 */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentPosts.map(board => ( // 주의: currentPosts로 변경해야 합니다.
                        <TableRow key={board.boardNumber}>
                            <TableCell>{board.boardNumber}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleTitleClick(board)}>{board.boardTitle}</Button>
                            </TableCell>
                            <TableCell>{board.boardWriterNickname}</TableCell>
                            <TableCell>
                                {board.boardWriterProfile ? (
                                    <Avatar src={board.boardWriterProfile} alt="Profile" />
                                ) : (
                                    <Typography>No Image</Typography>
                                )}
                            </TableCell>
                            <TableCell>{board.boardWriteDate}</TableCell>
                            <TableCell>{board.boardClickCount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button onClick={prevPage} disabled={currentPage === 1}>Previous</Button>
            <Button onClick={nextPage} disabled={currentPage === totalPages}>Next</Button>
        </Container>
    );
}

export default BoardList;
