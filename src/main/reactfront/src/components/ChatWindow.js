import React, {useEffect, useState} from "react";
import axios from "axios";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import {useCookies} from "react-cookie";
import {useUserStore} from "../stores";
import Navigation from "../views/Navigation";
import ProjectMain from "../views/ProjectMain";
import Authentication from "../views/Authentication";

const ChatWindow = () => {
    const [messages, setMessages] = useState([]);
    const [projectResponse, setProjectResponse] = useState('');
    const [cookies] = useCookies();
    const {user} = useUserStore();

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
        </div>
    );
};

export default ChatWindow;