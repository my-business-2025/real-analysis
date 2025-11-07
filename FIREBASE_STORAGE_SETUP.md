# 📦 Firebase Storage 설정 가이드

리포트 PDF 파일을 Firebase Storage에 저장하여 다운로드하는 방법입니다.

## 1. Firebase Storage 활성화

1. **Firebase Console** 접속: https://console.firebase.google.com
2. 프로젝트 선택: `datalife-mall`
3. 왼쪽 메뉴에서 **Storage** 클릭
4. **시작하기** 버튼 클릭
5. **테스트 모드로 시작** 선택
6. **위치**: `asia-northeast3 (Seoul)` 선택
7. **완료** 클릭

## 2. PDF 파일 업로드

1. **Storage** 페이지에서 **파일** 탭 클릭
2. **폴더 만들기** 클릭 → 폴더명: `reports`
3. `reports` 폴더 클릭
4. **파일 업로드** 클릭
5. `C:\Users\user\Downloads\real_analysis\files\1_음주운전.pdf` 파일 선택
6. 업로드 완료 대기

## 3. 보안 규칙 설정 (선택사항)

결제 완료한 사용자만 다운로드 가능하도록 설정:

1. **Storage** → **규칙** 탭
2. 다음 규칙으로 변경:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 리포트 파일은 인증된 사용자만 접근 가능
    match /reports/{fileName} {
      allow read: if request.auth != null;
      allow write: if false; // 업로드는 콘솔에서만
    }
  }
}
```

3. **게시** 클릭

## 4. 파일 경로 확인

업로드된 파일의 경로는:
- **경로**: `reports/1_음주운전.pdf`
- 코드에서 자동으로 이 경로를 사용합니다.

## 5. 작동 방식

- **Firebase Storage 설정됨**: Firebase Storage에서 다운로드
- **Firebase Storage 미설정**: 로컬 `files/` 폴더에서 다운로드 (fallback)

## 6. 대안: Google Drive 사용

Firebase Storage 대신 Google Drive를 사용하려면:

1. Google Drive에 PDF 파일 업로드
2. 파일 우클릭 → **공유** → **링크가 있는 모든 사용자** 선택
3. 링크 복사 (예: `https://drive.google.com/file/d/파일ID/view?usp=sharing`)
4. `report-download.html`의 `downloadReport()` 함수에서 링크 사용

```javascript
const pdfUrl = 'https://drive.google.com/uc?export=download&id=파일ID';
```

## 7. 주의사항

⚠️ **보안**
- Firebase Storage 보안 규칙을 설정하여 결제 완료한 사용자만 접근 가능하도록 권장
- Google Drive는 공개 링크이므로 누구나 접근 가능

⚠️ **용량**
- Firebase Storage 무료: 5GB
- Google Drive 무료: 15GB

⚠️ **비용**
- Firebase Storage: 5GB 초과 시 과금
- Google Drive: 15GB 초과 시 과금

