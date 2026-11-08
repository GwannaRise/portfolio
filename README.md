# 이관우 포트폴리오 사이트

한국어/영문 전환이 되는 정적 포트폴리오 사이트입니다. 서버가 필요 없고 GitHub Pages에서 무료로 동작합니다.

## 파일 구성

```
index.html          페이지 뼈대 (건드릴 일 거의 없음)
content.json        모든 글 내용 — 수정은 대부분 여기서
assets/style.css    디자인
assets/app.js       content.json을 읽어 화면을 그리는 코드
assets/img/         사진·로고·스크린샷을 넣는 폴더
```

## 글 고치기

`content.json`을 열어 고칩니다. `"ko"`가 한국어, `"en"`이 영문입니다. 같은 항목이 두 언어에 각각 있으니 둘 다 고쳐야 합니다.

- 따옴표(`"`)와 쉼표(`,`)를 지우지 않도록 주의하세요. 저장 후 사이트가 비어 보이면 대부분 쉼표 하나가 빠진 것입니다.
- 글 안에 따옴표를 쓰려면 `\"` 로 씁니다.

## 수상 추가하기

`awards.items` 배열에 한 줄 추가합니다. `tier`는 `grand`(대상) / `award`(입상) / `selected`(선발·지원) / `program`(교육·활동) 중 하나입니다.

```json
{ "tier": "grand", "title": "대회 이름 대상", "host": "주최", "date": "2027.03", "project": "스냅링크", "image": null, "desc": "한 줄 설명." }
```

## 사진·로고 넣기

1. 파일을 `assets/img/` 폴더에 넣습니다. (파일명은 영문·숫자만, 예: `aura-logo.png`, `snaplink-ui-1.jpg`)
2. `content.json`에서 해당 항목의 값을 경로로 바꿉니다.
   - 증명사진: 맨 위 `"photo"` 값이 없으면 `assets/img/profile.jpg`를 씁니다. 바꾸려면 그 파일을 교체하면 됩니다.
   - 로고: `"logo": null` → `"logo": "assets/img/aura-logo.png"`
   - 앱 스크린샷·행사 사진 여러 장: `"images": []` → `"images": [{ "src": "assets/img/snaplink-ui-1.jpg", "caption": "작가 검색 화면" }, { "src": "assets/img/snaplink-ui-2.jpg" }]`
   - 수상 행사 사진 한 장: `"image": null` → `"image": "assets/img/award-pick.jpg"`
   - 수상 행사 사진 여러 장: `"images": [{ "src": "assets/img/award-1.jpg", "caption": "시상식" }, { "src": "assets/img/award-2.jpg" }]` (SYNC 항목 참고)
3. 사진은 가로 1600px 이하로 줄여서 올리면 페이지가 가볍습니다.

비어 있는(`null`) 항목은 화면에 아무것도 표시되지 않으므로, 사진이 없어도 어색하게 보이지 않습니다.

## 배포 (GitHub Pages)

1. 이 폴더의 파일들을 GitHub 저장소 `GwannaRise/portfolio`에 올립니다.
2. 저장소의 Settings → Pages → Build and deployment에서 Source를 `Deploy from a branch`, Branch를 `main` / `/ (root)`로 저장합니다.
3. 1~2분 뒤 `https://gwannarise.github.io/portfolio/` 에서 열립니다. 이후 파일을 고쳐 올리면 자동으로 반영됩니다.

영문 버전을 바로 열고 싶으면 주소 뒤에 `?lang=en`을 붙입니다.

## AI에게 수정을 맡길 때

이 폴더를 열고 이렇게 요청하면 됩니다.

> content.json의 awards.items에 "○○ 대회 대상"을 추가해 줘. 주최는 ○○, 날짜는 2027.03, 한국어와 영문 둘 다.
