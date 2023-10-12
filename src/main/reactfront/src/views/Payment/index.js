import React, { useEffect, useState } from "react";
import axios from 'axios';
import BootPay from "bootpay-js";
import {Button} from "@mui/material";

export default function Payment(){

    const onPayment = (duration) => {
        const productName = `프리미엄 ${duration}일 이용권`;

        // 가격 동적 할당
        let price;
        switch (duration) {
            case 30:
                price = '100';
                break;
            case 90:
                price = '200';
                break;
            case 180:
                price = '300';
                break;
            default:
                alert("선택한 이용 기간이 잘못되었습니다.");
                return;
        }

        BootPay.request({
            price: price,
            application_id: "651fdab0d25985001abb83d6",
            name: productName,
            pg: 'inicis',
            method: 'card', //결제수단, 입력하지 않으면 결제수단 선택부터 화면이 시작합니다.
            show_agree_window: 0, // 부트페이 정보 동의 창 보이기 여부
            order_id: `premium${duration}`, //고유 주문번호로, 생성하신 값을 보내주셔야 합니다.
        }).error(function (data) {
            alert("결제가 취소되었습니다")
            console.log(data);
        }).cancel(function (data) {
            alert("결제가 취소되었습니다")
            console.log(data);
        }).ready(function (data) {
            // 가상계좌 입금 계좌번호가 발급되면 호출되는 함수.
            console.log(data);
        }).confirm(function (data) {
            console.log(data);
            var enable = true; // 재고 수량 관리 로직 혹은 다른 처리
            if (enable) {
                BootPay.transactionConfirm(data); // 조건이 맞으면 승인 처리를 한다.
            } else {
                BootPay.removePaymentWindow(); // 조건이 맞지 않으면 결제 창을 닫고 결제를 승인하지 않는다.
            }
        }).close(function (data) {
            // 결제창이 닫힐때 수행됩니다. (성공,실패,취소에 상관없이 모두 수행됨)
            console.log(data);
        }).done(function (data) {
            alert("결제가 완료되었습니다")
            console.log(data);
        });
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={() => onPayment(30)}>30일 결제</Button>
            <Button variant="contained" color="primary" onClick={() => onPayment(90)}>90일 결제</Button>
            <Button variant="contained" color="primary" onClick={() => onPayment(180)}>180일 결제</Button>
        </div>
    );
}
