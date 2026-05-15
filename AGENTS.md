# AGENTS.md instructions for C:\Users\sp287\WebstormProjects\ceni-market

## Notion 문서 갱신 지침

Notion 플러그인을 사용해서 노션 프로젝트 페이지에 내용을 추가/수정/삭제할 때는 다음 순서로 진행한다.

1. https://www.notion.so/38ee76ea11c982b4ad0281818173f238?source=copy_link 세니마켓 프로젝트 관리 페이지에서 수정해야 할 부분이 있는지 확인하고, 있다면 수정한다.
2. https://www.notion.so/740e76ea11c9833399a701a6c8c13396?source=copy_link 기능명세서 페이지에서 수정해야 할 부분이 있는지 확인하고, 있다면 수정한다.
3. https://www.notion.so/ERD-34be76ea11c98181ba9fe33a27286efe?source=copy_link ERD & 테이블 명세서 페이지에서 수정해야 할 부분이 있는지 확인하고, 있다면 수정한다.
4. https://www.notion.so/JPA-34be76ea11c981888157fd4fe8bbdaf0?source=copy_link JPA 엔티티 명세서 페이지에서 수정해야 할 부분이 있는지 확인하고, 있다면 수정한다.
5. https://www.notion.so/API-34be76ea11c981bb9e8bfe6c28c18303?source=copy_link API 설계서 페이지에서 수정해야 할 부분이 있는지 확인하고, 있다면 수정한다.

## Figma 디자인 구현 지침

Figma MCP 서버를 사용해 피그마에 디자인한 작업물을 프로젝트 코드로 옮길 때는 항상 다음 순서로 진행한다.

1. Figma MCP 서버로 대상 디자인의 구조, 레이아웃, 스타일, 에셋을 먼저 확인한다.
2. 프로젝트의 기존 컴포넌트, 폴더 구조, 스타일 방식, 라우팅 구조를 확인한다.
3. 피그마에서 생성된 코드를 그대로 붙여넣기보다, 기존 프로젝트 패턴에 맞춰 React 컴포넌트와 스타일로 구현한다.
4. 색상, 간격, 폰트 크기, 반응형 동작은 피그마 디자인 의도를 최대한 유지하되, 프로젝트의 기존 디자인 규칙과 충돌하면 기존 규칙을 우선한다.
5. 반복 UI는 재사용 가능한 컴포넌트로 분리하되, 불필요한 추상화는 만들지 않는다.
6. 이미지와 아이콘 에셋은 프로젝트의 `public` 또는 기존 에셋 관리 방식에 맞춰 배치한다.
7. 반응형으로 만들지 말아줘. 화면이 줄어들면 그냥 화면이 잘리게 냅둬.
8. CSS 는 SCSS로 작성해주고 가능하면 클래스 이름으로 작성해줘.
9. 코드 작성 이후 따로 검증작업 같은건 안해도 되. 내가 직접 할게.
10. 폰트는 전역으로 설정한 프리텐다드 폰트를 사용할 것 index.css
11. 아직 백엔드 API 개발을 안한 상태라 실제 데이터가 필요한 부분들은 더미 데이터로 채워줄 것.
12. 부트스트랩 아이콘은 public/assets/images 여기 폴더 icon.txt에 넣어둘게.
13. css요소에 패딩을 설정할 때 무조건 좌 우 패딩 동일하게 해줘. 피그마 디자인보다 이걸 우선해.
14. header,nav,features,footer 컴포넌트는 widgets 폴더 아래에 있어.
15. 페이지를 이동해야 하는 코드를 작성해야 할 때는 a태그 대신 리액트의 navlink를 사용한다.
16. aria-label data-node-id 는 작성하지 말아줘.

