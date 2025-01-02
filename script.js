const profilePhoto = document.querySelector(".profile-photo");
profilePhoto.addEventListener("click", () => {
    /*
    if (document.body.className === "dark-mode") {
        document.body.className = "";
    } else {
        document.body.className = "dark-mode";
    }
    */

    // DOM 요소에 지정한 클래스 값이 없으면 추가, 있다면 제거
    document.body.classList.toggle("dark-mode");
});

/* 
1. for문 이용 
// rigth_container 내 모든 section을 불러옴
// sections는 위 작용을 통해 반환된 NodeList
const sections = document.querySelectorAll('.right_container section');

for (let index=0; index<sections.length; index++) {
    const section = sections[index];
    section.addEventListener('click', function(event) {
        const sectionWidth = section.offestWidth;
        // offsetWidth: 대상(section)의 padding까지의 width를 가져옴

        const clickX = event.clientX - section.getBoundingClientRect().left;
        // event.clientX: 클릭한 위치의 X 좌표
        // section.getBoundingClientRect().left: 섹션의 가장 왼쪽 가장자리 X 좌표
        // 두 좌표의 차를 통해 클릭한 위치의 X 좌표 계산

        if(clickX < sectionWidth/2 ) {
            // section의 왼쪽을 클릭한 경우
            if(index != 0) {
                // 왼쪽으로 이동할 section이 있는 상황
                
                section.style.display = 'none';
                sections[index-1].style.display = 'flex';
            }
        } else {
            // section의 오른쪽을 클릭한 경우
            if(index != (sections.length-1)) {
                // 오른쪽으로 이동할 section이 있는 상황
                section.style.display = 'none';
                sections[index+1].style.display = 'flex';
            }
        }
    })
};
*/

/* 
forEach 함수 이용
// rigth_container 내 모든 section을 불러옴
// sections는 위 작용을 통해 반환된 NodeList
const sections = document.querySelectorAll('.right_container section');

let currentIndex = 0;

sections.forEach((section, index) => {
    // 각 section 요소: 이 NodeList의 개별 항목
    // index는 forEach에서 현재 순회 중인 요소의 '위치'를 나타냄
    // index는 forEach가 자동으로 계산해서 콜백 함수의 두 번째 매개변수로 전달
    // => 별도로 초기화 필요X => for문 사용보다 훨씬 간편!

    section.addEventListener('click', function (event) {
        const sectionWidth = section.offsetWidth;  
        const clickX = event.clientX - section.getBoundingClientRect().left;

        if (clickX < sectionWidth / 2) {  
            // 만약 section의 왼쪽을 클릭했다면
            if (index != 0) {  
                // 더 왼쪽으로 갈 section이 있다면
                section.style.display = 'none';
                sections[index - 1].style.display = 'flex';
                currentIndex = index - 1;
            }
        } else {  
            // 만약 section의 오른쪽을 클릭했다면
            if (index != (sections.length - 1)) {  
                // 더 오른쪽으로 갈 section이 있다면
                section.style.display = 'none';
                sections[index + 1].style.display = 'flex';
                currentIndex = index + 1;
            }
        }
    })
})
*/

// 3초마다 자동으로 넘어가도록!
setInterval(() => {
    sections[currentIndex].style.display = 'none';
    if (currentIndex == (sections.length - 1)) {  
        // 더 오른쪽으로 갈 section이 없다면 (즉, 마지막 section)
        currentIndex = 0;  
        // 처음의 section으로 이동
    } else {
        currentIndex++;
    }

    // currentIndex = (currentIndex + 1) % sections.length;
    // section은 총 4개 currentIndex (0 ~ 3)
    // currentIndex가 3이라고 한다면, currentIndex = 4 % 4 = 0
    sections[currentIndex].style.display = 'flex';
}, 3000);

/* 오늘의 운세 */
fetch("https://m.search.naver.com/p/csearch/content/apirender.nhn?where=nexearch&pkid=387&u2=20040925&q=생년월일+운세&u1=f&u3=solar&u4=12&_=1719518803829")
    .then((response) => response.json())  // 응답을 JSON으로 파싱
    .then(data => {
        const htmlString = data.flick[0]; // 첫 번째 항목 선택
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const fortune = doc.querySelector('dd b').textContent;
        const fortuneText = doc.querySelector('dd p').textContent;
        console.log(fortune); // 추출한 텍스트 출력
        console.log(fortuneText); // 추출한 텍스트 출력

        const fortuneSection = document.createElement("section");
        // 오늘의 운세 section 생성
        const sectionTitle = document.createElement("h2");
        sectionTitle.textContent = "오늘의 운세";
        // 오늘의 운세 title 추가
        const fortuneE = document.createElement("h3");
        fortuneE.style.margin = 0;
        fortuneE.textContent = fortune;
        // 오늘의 운세명 추가
        const fortuneTextE = document.createElement("p");
        fortuneTextE.textContent = fortuneText;
        // 오늘의 운세 풀이 추가

        // append: 자식 중 가장 마지막에 삽입
        fortuneSection.append(sectionTitle);
        fortuneSection.append(fortuneE);
        fortuneSection.append(fortuneTextE);

        const contactSection = document.querySelector(".contact");
        // contactSection.before(fortuneSection); -> contact의 전에 fortune 추가
        contactSection.after(fortuneSection); // contact의 뒤에 fortune 추가

        // section 초기화 및 이벤트 리스너 추가
        initializeSections();
    });

// section 초기화 및 이벤트 리스너 '함수화'
function initializeSections() {
    // rigth_container 내 모든 section을 불러옴
    // sections는 위 작용을 통해 반환된 NodeList
    const sections = document.querySelectorAll('.right_container section');
    let currentIndex = 0;

    const showAfterSection = () => {
        sections.forEach((section) => { section.style.display = 'none'; })  
        // 현재 section 숨기기
        if (currentIndex == sections.length - 1) {
            // 맨 오른쪽(마지막) 섹션이라면
            currentIndex = 0;
            // 첫번재 섹션으로 이동
        } else {
            // 맨 오른쪽(마지막) 섹션이 아니라면
            currentIndex++;
            // 다음 섹션으로 이동 
        }
        sections[currentIndex].style.display = 'flex';  // currentIndex의 section 보여주기
    }
    const showBeforeSection = () => {
        sections.forEach((section) => { section.style.display = 'none'; })
        if (currentIndex == 0) {
            // 맨 왼쪽(첫번째) 섹션이라면
            currentIndex = sections.length - 1;
            // 맨 오른쪽(마지막) 섹션으로 이동
        } else {
            // 맨 왼쪽(첫번째) 섹션이 아니라면
            currentIndex--;
            // 이전 섹션으로 이동
        }
        sections[currentIndex].style.display = 'flex';
    }

    // 실행되는 인터벌의 고유 ID를 반환 -> intervalId로 저장
    // showAfterSection이라는 함수를 3초마다 반복 실행
    let intervalId = setInterval(showAfterSection, 3000);

    const resetInterval = () => {
        // 현재 실행 중인 인터벌(intervalId)을 중단
        // 지정된 ID와 연결된 setInterval 작업 중단
        // 현재 실행 중인 인터벌만 취소하는 역할을 수행하므로, 새로운 인터벌을 생성하거나 재시작하지 않음 -> 새로운 setInterval 필요
        clearInterval(intervalId);
        // 새롭게 intervalID를 저장함으로써 이전 인터벌은 중단되고, 새로운 3초 주기의 인터벌 시작
        intervalId = setInterval(showAfterSection, 3000);
    }

    sections.forEach((section, index) => {
        section.addEventListener("click", (event) => {
            const sectionWidth = section.offsetWidth;
            // offsetWidth: 대상(section)의 padding까지의 width를 가져옴
            const clickX = event.clientX - section.getBoundingClientRect().left;
            /*
            event.clientX => 왼쪽(0px)으로부터 클릭한 커서의 x좌표 
            section.getBoundingClientRect() => 왼쪽(0px)으로부터 section의 가장 왼쪽 가장자리의 x 좌표
            clickX => section의 왼쪽 가장자리로부터 커서의 x 좌표의 위치 => section의 너비(sectionWidth)와 비교하기 적합함!!
            */

            if (clickX < sectionWidth / 3) {  // 왼쪽 1/3 클릭 시 이전 section으로 이동
                showBeforeSection();
                resetInterval();
            } else if (clickX > sectionWidth * 2 / 3) {  // 오른쪽 1/3 클릭 시 다음 section으로 이동
                showAfterSection();
                resetInterval();
            } else {  // 중간 1/3 클릭 시 자동 넘김 토글
                if (intervalId) {
                    clearInterval(intervalId);  // 자동 넘김 중지
                    // intervalId 값은 여전히 남아있으므로 null 값을 넣어줌으로써 더 이상 유효하지 않게 함
                    intervalId = null;
                } else {
                    intervalId = setInterval(showAfterSection, 3000);  // 자동 넘김 재개
                }
            }
        });
    });
}