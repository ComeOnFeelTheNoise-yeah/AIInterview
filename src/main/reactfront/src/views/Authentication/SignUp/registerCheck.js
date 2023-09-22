function registerCheck() {

    // 아이디 검사
    const userId = document.getElementsByName("userid")[0];
    // 영문 대소문자와 숫자로 구성되며, 길이는 4~12자
    const userIdPattern = /^[a-zA-Z0-9]{4,12}$/;
    if (!userIdPattern.test(userId.value)) {
        alert("아이디는 4~12자의 영문 대소문자와 숫자로만 입력해야 합니다.");
        userId.value="";
        userId.focus();
        return false;
    }

    // 비밀번호 검사
    const password = document.getElementsByName("password")[0];
    // 영문 대소문자와 숫자가 적어도 하나씩 포함되며, 길이는 4~12자
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{4,12}$/;
    if (!passwordPattern.test(password.value)) {
        alert("비밀번호는 4~12자의 영문 대소문자, 숫자로만 입력해야 합니다.");
        password.value="";
        password.focus();
        return false;
    }

    if(userId.value === password.value){
        alert("아이디와 비밀번호를 다르게 해주세요. ");
        password.value="";
        password.focus();
        return false;
    }

    const passwordRe = document.getElementsByName("passwordRe")[0];
    if(password.value != passwordRe.value){
        alert("비밀번호를 확인해주세요. ");
        passwordRe.value="";
        passwordRe.focus();
        return false;
    }

    // 메일 주소 검사
    const mailAddress = document.getElementsByName("mailAddress")[0];
    // 올바른 이메일 형식
    const mailAddressPattern = /^[a-zA-Z0-9_]+[a-zA-Z0-9]*[@]{1}[a-zA-Z0-9]+[a-zA-Z0-9]*[.]{1}[A-Za-z]{1,3}$/;
    if (!mailAddressPattern.test(mailAddress.value)) {
        alert("올바른 메일 주소를 입력해주세요. 예) id@domain.com");
        mailAddress.value = "";
        mailAddress.focus();
        return false;
    }

    // 이름 검사
    const name = document.getElementsByName("name")[0];
    // 한글로 구성, 길이는 2~4자
    const namePattern = /^[가-힣]{2,4}$/;
    if (!namePattern.test(name.value)) {
        alert("이름이 올바르지 않습니다.");
        name.value = "";
        name.focus();
        return false;
    }

    // 주소 검사
    const address1 = document.getElementsByName("address1")[0];
    const address2 = document.getElementsByName("address2")[0];
    const address3 = document.getElementsByName("address3")[0];

    if (!address1.value || !address2.value || !address3.value) {
        alert("주소 정보를 모두 입력해주세요.");
        if (!address1.value) {
            address1.focus();
        } else if (!address2.value) {
            address2.focus();
        } else {
            address3.focus();
        }
        return false;
    }

    // 주민번호 검사
    const specificNum = document.getElementsByName("specificNum")[0];
    // 숫자로만 구성, 길이는 13자
    const specificNumPattern = /^[0-9]{13,13}$/;
    if (!specificNumPattern.test(specificNum.value)) {
        alert("올바른 주민번호를 입력해주세요. 예) 1234561234567");
        specificNum.value = "";
        specificNum.focus();
        return false;
    }

    // 관심 분야 검사
    const favorites = document.getElementsByName("favorite");
    let selectedFavorites = 0;
    for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].checked) {
            selectedFavorites++;
        }
    }
    if (selectedFavorites < 1) {
        alert("관심 분야를 하나 이상 선택해주세요.");
        return false;
    }

    // 자기 소개 검사
    const selfIntroduction = document.querySelector("textarea").value.trim();
    if (selfIntroduction.length < 50) {
        alert("자기 소개를 50자 이상 작성해주세요.");
        document.querySelector("textarea").focus();
        return false;
    }

    alert("회원가입이 완료되었습니다!");
    window.location.href = `mailto:${mailAddress.value}?subject=회원가입 완료&body=회원가입을 환영합니다.`;
    return true;
}
function searchAddress(){
    new daum.Postcode({
        oncomplete: function(data) {
            var addr = ''; // 주소 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementsByName('address1')[0].value = data.zonecode;
            document.getElementsByName("address2")[0].value = addr;
            // 커서를 상세주소 필드로 이동한다.
            document.getElementsByName("address3")[0].focus();
        }
    }).open();
}

function specificNumCheck(){
    // 주민번호 검사
    const specificNum = document.getElementsByName("specificNum")[0];

    const arrNum = specificNum.value.split('');
    const checkNum = [2,3,4,5,6,7,8,9,2,3,4,5];

    for(var i = 0; i < arrNum.length-1; i++){
        arrNum[i] = arrNum[i]*checkNum[i];
    }

    var sum = 0;

    for (var i=0; i<12; i++) {
        sum += arrNum[i];
    }

    const year = document.getElementsByName("year")[0];
    const month = document.getElementsByName("month")[0];
    const day = document.getElementsByName("day")[0];

    if((11-(sum%11))%10 != arrNum[12]) {
        alert("올바른 주민번호가 아닙니다.");
        specificNum.value = "";
        specificNum.focus();
        return false;
    }else{
        const birthYear = specificNum.value.substring(0, 2);
        const birthMonth = specificNum.value.substring(2, 4);
        const birthDay = specificNum.value.substring(4, 6);

        if(parseInt(birthYear) > 23){
            year.value = 19 + birthYear;
        }else{
            year.value = 20 + birthYear;
        }
        month.value = parseInt(birthMonth);
        day.value = parseInt(birthDay);
    }
}