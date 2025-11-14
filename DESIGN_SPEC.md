# SENSEMAKERS 디자인 스펙 문서

## 🎨 컬러 팔레트

### Primary Colors
- **Primary Blue**: `#3498db`
- **Primary Blue Dark**: `#2980b9`
- **Primary Blue Light**: `#E3F2FD`
- **Primary Blue Text**: `#1976D2`

### Header Gradient
- **Start**: `#1a252f` (0%)
- **Mid 1**: `#2c3e50` (40%)
- **Mid 2**: `#3b4d61` (70%)
- **End**: `#4a5f7a` (100%)
- **Direction**: Left to Right

### Text Colors
- **Dark Gray**: `#333`
- **Medium Gray**: `#555`
- **Light Gray**: `#666`
- **White**: `#ffffff`

### Background Colors
- **Page Background**: `#f8f9fa`
- **Card Background**: `#ffffff`
- **Card Border**: `#e0e0e0`

## 📝 타이포그래피

### 폰트 패밀리
- **Primary**: 'Noto Sans KR', sans-serif
- **Logo**: 'Poppins', sans-serif
- **Serif**: 'Noto Serif KR', serif

### 헤더 타이포그래피
- **Logo Text**: 
  - Font: Poppins
  - Size: 2.5rem (40px)
  - Weight: 600
  - Letter Spacing: 3px
  - Color: White

### Hero 섹션 타이포그래피
- **Hero Tag**:
  - Font: Noto Sans KR
  - Size: 0.9rem (14.4px)
  - Weight: 500
  - Background: #E3F2FD
  - Color: #1976D2
  - Padding: 8px 16px
  - Border Radius: 20px

- **Hero Title**:
  - Font: Noto Sans KR
  - Size: 3.5rem (56px)
  - Weight: 700
  - Line Height: 1.4
  - Gray Text: #333
  - Blue Text: #3498db

- **Brand Story Card Text**:
  - Font: Noto Sans KR
  - Size: 1.1rem (17.6px)
  - Weight: 400
  - Line Height: 1.8
  - Color: #555

- **Brand Story End**:
  - Font: Noto Sans KR
  - Size: 1.1rem (17.6px)
  - Weight: 600
  - Color: #3498db

## 📐 레이아웃 & 간격

### Container
- **Max Width**: 1200px
- **Padding**: 0 20px

### Hero Section
- **Layout**: Flex (2 columns)
- **Gap**: 60px
- **Margin**: 60px 0
- **Min Height**: 500px

### Hero Content (Left)
- **Flex**: 1
- **Tag Margin Bottom**: 30px
- **Title Margin Bottom**: 40px

### Hero Image (Right)
- **Flex**: 1
- **Max Width**: 500px

### Brand Story Card
- **Background**: White
- **Border**: 1px solid #e0e0e0
- **Border Radius**: 15px
- **Padding**: 40px
- **Box Shadow**: 0 2px 10px rgba(0,0,0,0.08)
- **Width**: 100%
- **Max Width**: 500px

## 🔘 버튼 스타일

### Primary Button (분석 리포트 보기)
- **Background**: Linear gradient (135deg, #3498db 0%, #2980b9 100%)
- **Color**: White
- **Padding**: 15px 30px
- **Border Radius**: 50px
- **Font Size**: 1.1rem
- **Font Weight**: 600
- **Hover**: 
  - Transform: translateY(-2px)
  - Box Shadow: 0 10px 30px rgba(52, 152, 219, 0.3)

### Secondary Button (문의하기)
- **Background**: White
- **Color**: #3498db
- **Border**: 2px solid #3498db
- **Padding**: 15px 30px
- **Border Radius**: 50px
- **Font Size**: 1.1rem
- **Font Weight**: 600
- **Icon**: Font Awesome comment icon (0.9rem)
- **Hover**:
  - Background: #3498db
  - Color: White

## 🎯 컴포넌트 스펙

### Hero Tag
```
- Display: inline-flex
- Align Items: center
- Background: #E3F2FD
- Color: #1976D2
- Padding: 8px 16px
- Border Radius: 20px
- Font Size: 0.9rem
- Font Weight: 500
- Margin Bottom: 30px
```

### Hero Title Lines
```
- Display: block
- Font Size: 3.5rem
- Font Weight: 700
- Line Height: 1.4
- Gap: 8px (between lines)
- Gray Lines: #333
- Blue Lines: #3498db
```

### Brand Story Card
```
- Background: #ffffff
- Border: 1px solid #e0e0e0
- Border Radius: 15px
- Padding: 40px
- Box Shadow: 0 2px 10px rgba(0,0,0,0.08)
- Max Width: 500px
```

### Brand Story Text
```
- Font: Noto Sans KR
- Size: 1.1rem
- Weight: 400
- Line Height: 1.8
- Color: #555
- Margin Bottom: 8px (between paragraphs)
```

### Brand Story End
```
- Font: Noto Sans KR
- Size: 1.1rem
- Weight: 600
- Color: #3498db
- Margin Top: 20px
- Line Height: 1.6
```

## 📱 반응형 브레이크포인트

### Mobile (max-width: 768px)
- **Hero Layout**: Column (flex-direction: column)
- **Hero Title**: 2.2rem
- **Hero Tag**: 0.85rem, padding: 6px 14px
- **Brand Story Card**: padding: 30px 20px
- **Brand Story Text**: 1rem
- **Brand Story End**: 1rem

## 🎨 그라데이션

### Header Gradient
```css
background: linear-gradient(to right, #1a252f 0%, #2c3e50 40%, #3b4d61 70%, #4a5f7a 100%);
```

### Primary Button Gradient
```css
background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
```

## 📋 Hero Section 구조

```
Hero Section
├── Hero Content (Left)
│   ├── Hero Tag
│   │   └── "데이터 기반 인사이트"
│   ├── Hero Title
│   │   ├── "감각적인" (Gray)
│   │   ├── "데이터 분석으로" (Blue)
│   │   ├── "세상이" (Gray)
│   │   └── "다르게 보입니다" (Blue)
│   └── Hero Actions
│       ├── Primary Button: "분석 리포트 보기"
│       └── Secondary Button: "문의하기" (with icon)
└── Hero Image (Right)
    └── Brand Story Card
        ├── Brand Story (6 paragraphs)
        └── Brand Story End (blue text)
```

## 🔍 상세 스펙

### Hero Tag
- **Text**: "데이터 기반 인사이트"
- **No Icon** (별표 제거됨)

### Hero Title Lines
1. "감각적인" - #333 (Gray)
2. "데이터 분석으로" - #3498db (Blue)
3. "세상이" - #333 (Gray)
4. "다르게 보입니다" - #3498db (Blue)

### Brand Story Content
1. "데이터를 분석해서"
2. "새로운 정보를 만들고,"
3. "그 정보가 인식을 바꾸고,"
4. "인식이 태도를 바꾸고,"
5. "태도가 행동을 바꾸면,"
6. "결국 세상이 달라집니다."

### Brand Story End
"우리는 데이터로 출발해 세상의 변화를 새롭게 그려갑니다."

---

이 문서는 현재 웹사이트의 디자인 스펙을 정리한 것입니다. 피그마에서 이 스펙을 참고하여 디자인을 재현하실 수 있습니다.

