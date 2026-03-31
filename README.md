# 출결이 📚✏️
학원 출결 관리 앱 — React Native Expo

## 디자인
- 파스텔 키즈 테마 (따뜻한 크림/피치 톤)
- SVG 일러스트 아바타 16종 (아이) + 16종 (학원)
- 탭바: SVG 라인 아이콘 / 콘텐츠: 컬러 일러스트 아이콘

## 기능
- 👶 아이 등록 (귀여운 SVG 아바타 선택)
- 🏫 학원 등록 (일러스트 아이콘 + 보강/이월 옵션)
- 🔗 아이-학원 연결 & 요일/기간 설정
- 📅 월별 캘린더 출결 관리
- 📊 월별 통계 (출석률, 보강 현황)
- ⚖️ 보강 정산
- 📅 임시공휴일 관리
- 💾 백업/복원

## 설치 & 실행

### 1. 의존성 설치
```bash
cd ChulGyulE
npm install
```

### 2. 개발 서버 실행
```bash
npx expo start
```
Expo Go 앱으로 QR 코드를 스캔R

하면 바로 실행됩니다.

### 3. APK 빌드 (Android)
```bash
# EAS CLI 설치 (최초 1회)
npm install -g eas-cli

# Expo 계정 로그인
eas login

# APK 빌드
eas build --platform android --profile preview
```
빌드 완료 후 다운로드 링크가 제공됩니다.

### 4. iOS 빌드
```bash
eas build --platform ios --profile preview
```
Apple Developer 계정이 필요합니다.

## 프로젝트 구조
```
ChulGyulE/
├── App.js                    # 루트 (탭 네비게이션, 데이터 상태)
├── app.json                  # Expo 설정
├── package.json
├── eas.json                  # EAS 빌드 설정
└── src/
    ├── assets/
    │   ├── avatars.js        # SVG 아이/학원 아바타/아이콘 (16+16종)
    │   └── icons.js          # SVG 라인 아이콘 (탭바, UI)
    ├── components/
    │   ├── UIComponents.js   # Card, Tag, Button, Toggle 등
    │   └── Calendar.js       # 월별 캘린더 그리드
    ├── screens/
    │   ├── MainScreen.js     # 출결 관리 (홈)
    │   ├── RegisterScreen.js # 등록
    │   ├── StatsScreen.js    # 통계
    │   └── SettingsScreen.js # 설정
    └── utils/
        ├── theme.js          # 파스텔 색상/폰트/사이즈
        └── data.js           # 데이터 로직, AsyncStorage
```

## 데이터 호환
기존 HTML 버전의 `hakwon_v4` localStorage 데이터와 동일한 구조를 사용합니다.
JSON 백업 파일로 데이터를 이전할 수 있습니다.

## 참고
- 가정정보(가정코드/가정이름) 기능은 제거되었습니다
- 최소 Android 8.0 (API 26) / iOS 13 지원
