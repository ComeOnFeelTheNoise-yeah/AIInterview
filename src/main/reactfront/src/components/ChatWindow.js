import React, {useEffect, useState} from "react";
import axios from "axios";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import {useCookies} from "react-cookie";
import {useUserStore} from "../stores";
import Navigation from "../views/Navigation";
import ProjectMain from "../views/ProjectMain";
import Authentication from "../views/Authentication";

const ChatWindow = ({ introContent }) => {
    const [messages, setMessages] = useState([]);
    const [projectResponse, setProjectResponse] = useState('');
    const [cookies] = useCookies();
    const {user} = useUserStore();
    const [isLoaded, setIsLoaded] = useState(false);

    const getProject = async (token) => {
        const requestOption = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        await axios.get('http://localhost:8080/api/project/', requestOption).then((response) => {
            setProjectResponse(response.data);
        }).catch((error) => '');
    }

    useEffect(() => {
        // 컴포넌트가 마운트될 때 GPT에 자소서를 보냄
        const sendIntroToGPT = async () => {
            if (introContent && introContent.length > 0) {
                // 자소서의 모든 항목을 하나의 문자열로 합칩니다.
                const combinedContent = introContent.map(item => item.answer).join('\n\n');

                try {
                    await axios.post("http://localhost:8080/ask", { prompt: combinedContent }, {
                        headers: {
                            'Authorization': 'Bearer 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',
                        }
                    });
                    setIsLoaded(true);
                } catch (error) {
                    console.error("Error fetching GPT response for intro: ", error);
                }
            }
        };

        sendIntroToGPT();
    }, [introContent]);

    useEffect(() => {
        const token = cookies.token;
        console.log("Token Value: ", token); // 콘솔에 token 값 출력
        if(token){
            getProject(token);
        }else{
            setProjectResponse('');
        }
    }, [cookies.token]);

    const addMessage = (message, isUser) => {
        setMessages((prevMessages) => [...prevMessages, {text: message, isUser}]);
    };

    const handleSubmit = async (message) => {
        addMessage(message, true);

        try{
            // 백엔드 서버와 통신하여 GPT의 응답을 받음
            const response = await axios.post("http://localhost:8080/ask", { prompt: message }, {
                headers: {
                    'Authorization': 'Bearer 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',
                }
            });

            // GPT로부터 받은 응답을 채팅창에 추가함
            if(response.data){
                addMessage(response.data, false);
            }
        }catch(error){
            console.error("Error fetching GPT response: ", error);
        }
    };

    return (
        <div className="chat-window">
            {isLoaded ? ( // 채팅 화면의 표시 여부를 결정
                <>
                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <ChatMessage
                                key={index}
                                message={message.text}
                                isUser={message.isUser}
                            />
                        ))}
                    </div>
                    <ChatInput onSubmit={handleSubmit}/>
                </>
            ) : (
                <p>챗봇 불러오는중...</p> // 로딩 중일 때의 메시지
            )}
        </div>
    );
};

export default ChatWindow;