import React, { useEffect, useState } from "react";
import axios from 'axios';
import BootPay from "bootpay-js";

export default function Payment(){

    const onPayment = () => {
        console.log(BootPay);
        BootPay.request({
            price: '100',
            application_id: "651fdab0d25985001abb83d6",
            name: '프리미엄 30일 월정액',
            pg: 'inicis',
            method: 'card', //결제수단, 입력하지 않으면 결제수단 선택부터 화면이 시작합니다.
            show_agree_window: 0, // 부트페이 정보 동의 창 보이기 여부
            order_id: 'premium30', //고유 주문번호로, 생성하신 값을 보내주셔야 합니다.
        }).error(function (data) {
            //결제 진행시 에러가 발생하면 수행됩니다.
            console.log(data);
        }).cancel(function (data) {
            //결제가 취소되면 수행됩니다.
            console.log(data);
        }).ready(function (data) {
            // 가상계좌 입금 계좌번호가 발급되면 호출되는 함수입니다.
            console.log(data);
        }).confirm(function (data) {
            //결제가 실행되기 전에 수행되며, 주로 재고를 확인하는 로직이 들어갑니다.
            //주의 - 카드 수기결제일 경우 이 부분이 실행되지 않습니다.
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
            //결제가 정상적으로 완료되면 수행됩니다
            //비즈니스 로직을 수행하기 전에 결제 유효성 검증을 하시길 추천합니다.
            console.log(data);
        });
    };

    return (
        <button onClick={onPayment} >결제하기</button>
    );
}
