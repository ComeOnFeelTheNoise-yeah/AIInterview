import React from "react";
import NewsList from '../../components/NewsList';

export default function ProjectMain(){
    return (
        <>
            <div>
                <img alt="BeWithYouMain" src="/img/img/BeWithYouMain.png" width='100%' style={{margin: '10px 0px 0px 0px'}}/>
                <img alt="introMaythe4th" src="/img/img/introMaythe4th.png" width='100%'/>
                <img alt="introBeWithYou" src="/img/img/introBeWithYou.png" width='100%'/>
                <NewsList />
                <img alt="AboutUs" src="/img/img/AboutUs.png" width='100%'/>
            </div>
        </>
    )
}