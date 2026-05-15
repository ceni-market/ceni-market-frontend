# Ceni Market frontend structure

Figma 화면 묶음을 기준으로 만든 초기 디렉터리 구조입니다.

## Top level

- `app`: 앱 진입점 주변 설정, 라우터, 전역 provider, 전역 스타일
- `pages`: 라우트 단위 화면
- `widgets`: 여러 화면에서 재사용되는 큰 UI 블록
- `features`: 사용자 행동 단위 로직과 UI
- `entities`: 도메인 모델 단위 UI, 타입, 변환 로직
- `shared`: 공통 API, UI primitives, 훅, 유틸, 스타일, 에셋
- `mocks`: 화면 구현 초기 단계에서 사용할 샘플 데이터

## Figma screen mapping

- `pages/home`: 홈페이지, 로그아웃 상태 홈페이지
- `pages/auth/login`: 로그인
- `pages/auth/signup`: 회원가입 1~3단계
- `pages/auth/password-reset`: 비밀번호 찾기 1~4단계
- `pages/products/list`: 상품 리스트 전체
- `pages/products/popular`: 인기 상품
- `pages/products/detail`: 상품 상세 조회
- `pages/sharing/list`: 나눔 게시판
- `pages/posts/write`: 글쓰기
- `pages/chat`: 채팅 화면 진입점
- `pages/my-page/*`: 마이페이지, 등록 글, 거래 내역, 나눔 글, 계정 설정

## Reusable blocks from the design

- `widgets/app-header`: 상단 로고, 검색, 로그인/회원가입, 사용자 메뉴
- `widgets/app-footer`: 하단 푸터
- `widgets/chat-floating-button`: 우측 하단 채팅 버튼
- `widgets/chat-modal`: 채팅창 모달
- `widgets/category-tabs`: 카테고리/필터 탭
- `widgets/product-grid`: 상품 카드 목록
- `widgets/my-page-sidebar`: 마이페이지 좌측 메뉴
