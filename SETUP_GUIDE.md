# 🚀 실제 구글 로그인 & 카드 결제 설정 가이드

## 1. Firebase 설정 (구글 로그인)

### 1.1 Firebase 프로젝트 생성
1. **Firebase Console** 접속: https://console.firebase.google.com
2. **프로젝트 추가** 클릭
3. 프로젝트 이름: `datalife-mall` 입력
4. **계속** → **Google Analytics 사용** (선택) → **프로젝트 만들기**

### 1.2 웹 앱 등록
1. **프로젝트 개요** → **웹 앱 추가** (</> 아이콘)
2. 앱 닉네임: `분석의진수` 입력
3. **Firebase Hosting 설정** 체크
4. **앱 등록** 클릭

### 1.3 Firebase 설정 코드 복사
생성된 config 객체를 복사해서 `index.html`의 다음 부분을 교체:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com", 
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### 1.4 Authentication 설정
1. **Authentication** → **Sign-in method** 탭
2. **Google** 제공업체 **사용 설정**
3. **프로젝트 공개용 이름**: `분석의진수` 입력
4. **프로젝트 지원 이메일** 선택
5. **저장** 클릭

### 1.5 Firestore 데이터베이스 설정
1. **Firestore Database** → **데이터베이스 만들기**
2. **테스트 모드로 시작** 선택
3. **위치**: `asia-northeast3 (Seoul)` 선택
4. **완료** 클릭

## 2. PortOne (결제) 설정

### 2.1 PortOne 계정 생성
1. **PortOne 콘솔** 접속: https://admin.portone.io
2. **회원가입** → **이메일 인증** 완료
3. **대시보드** 접속

### 2.2 가맹점 식별코드 발급
1. **결제연동** → **연동 관리** → **가맹점 식별코드**
2. **테스트용 가맹점 식별코드** 복사
3. `scripts/main.js`의 다음 부분 교체:
```javascript
window.IMP.init('imp_your_code'); // ← 실제 가맹점 식별코드로 교체
```

### 2.3 PG사 설정
1. **결제연동** → **PG 관리**
2. **테스트용 PG 추가**:
   - **이니시스(웹표준)**: 테스트 모드 활성화
   - **카카오페이**: 테스트 모드 활성화

### 2.4 도메인 등록
1. **결제연동** → **도메인 관리**
2. **도메인 추가**: `https://my-business-2025.github.io` 등록

## 3. GitHub 업로드 & 배포

### 3.1 파일 업로드
```bash
git add .
git commit -m "Add real Google login and card payment"
git push origin master
```

### 3.2 HTTPS 설정 확인
- GitHub Pages → **Enforce HTTPS** 체크 확인
- 실제 결제는 HTTPS에서만 작동

## 4. 테스트 계정 정보

### 4.1 테스트 카드 번호
- **신용카드**: 4092-0230-1234-5678
- **유효기간**: 아무 미래 날짜
- **CVC**: 123
- **비밀번호**: 00

### 4.2 테스트 결제 금액
- **100원 이상**: 정상 결제 테스트
- **실제 카드 청구 없음** (테스트 모드)

## 5. 실서비스 전환

### 5.1 Firebase 실서비스 전환
- **Firestore 보안 규칙** 설정
- **프로덕션 모드** 전환

### 5.2 PortOne 실서비스 전환
- **사업자등록번호** 제출
- **실제 PG 계약** 체결
- **실서비스 가맹점 코드** 발급

## 6. 주의사항

⚠️ **보안**
- Firebase config의 API 키는 공개되어도 괜찮습니다 (클라이언트용)
- 실제 결제 검증은 서버에서 해야 합니다

⚠️ **결제**
- 테스트 결제는 실제 청구되지 않습니다
- 실서비스 전환 전 충분한 테스트 필요

⚠️ **도메인**
- 결제 도메인은 사전 등록 필수
- localhost는 테스트만 가능

## 7. 현재 상태

✅ **구현 완료**
- Firebase Auth (구글 로그인) 연동 코드
- PortOne 실제 카드 결제 코드  
- Firestore 데이터베이스 연동
- 주문 관리 시스템

🔧 **설정 필요**
- Firebase 프로젝트 생성 및 config 업데이트
- PortOne 가맹점 코드 발급 및 업데이트
- 도메인 등록

설정 완료 후 **진짜 구글 로그인**과 **실제 카드 결제**가 가능합니다! 🚀
