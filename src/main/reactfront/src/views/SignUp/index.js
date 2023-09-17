import React, {useState} from "react";
import axios from "axios";

export default function SignUp(){

    const [requestResult, setRequestResult] = useState('')

    const signUpHandler = () => {
        const data = {
            userEmail: "jwoo3460@gmail.com",
            userPassword: "qwer1234!!",
            userPasswordCheck: "qwer1234!!",
            userNickname: "jiwoo",
            userName: "양지우",
            userPhoneNumber: "010-9175-3460",
            userAddress: "대한민국 경기도 오산시",
            userAddressDetail: "부산중앙로 11"
        }
        axios
            .post('http://localhost:8080/api/auth/signUp', data)
            .then((response) => {
                setRequestResult('success!!');
            })
            .catch((error) => {
                setRequestResult('failed!!');
            })
    }

    return (
        <div>
            <h3>{requestResult}</h3>
            <button onClick={() => signUpHandler()}>회원가입</button>
        </div>
    )
}