import React from "react";
import "./style.css";  // CSS 파일을 import 합니다.

export default function CompanyIntro(){
    return (
        <div className="company-intro-container">
            <Header />
            <SearchBar />
        </div>
    );
}

function Header() {
    return (
        <div className="header">
            <h1 align='CENTER'>합격을 만드는 기업별 자소서</h1>
            <h3>원하는 기업의 자소서를 미리 확인하고 합격의 기회를 잡으세요.</h3>
        </div>
    );
}

function SearchBar() {
    return (
        <div className="search-bar">
            <input type="text" placeholder="기업명 입력" />
            <button>검색</button>
        </div>
    );
}
