# Landscape Ontology

조경 설계 지식 구조화를 위한 실험 저장소.

## 목표
- 조경 개념 구조화
- 공간 경험 네트워크 구축
- 식재 및 재료 데이터 정리
- AI 검색 및 재사용 실험
- 온톨로지 기반 조경 설계 연구

## 주요 카테고리
- Concepts
- Planting
- Spatial Patterns
- Materials
- Precedents

## 폴더 구조
- `concepts/`: 조경 핵심 개념 및 용어 정리
- `planting/`: 식재 전략 및 식물 데이터 정리
- `spatial_patterns/`: 공간 구성 및 동선 패턴 정리
- `materials/`: 조경 재료 특성 및 활용 정보 정리
- `precedents/`: 국내외 조경 사례 및 분석 기록
- `docs/`: 프로젝트 문서 및 작업 가이드
- `data/`: 온톨로지 시드 및 정형 데이터

## 웹 프로토타입 실행 방법
이 저장소에는 온톨로지 데이터 테스트용 웹 기반 조경 설계 전략 추천기 프로토타입이 포함되어 있습니다.

1. 저장소 루트에서 정적 서버를 실행합니다.
   - 예: `python -m http.server 8080`
2. 브라우저에서 `http://localhost:8080` 접속 후 `index.html`을 엽니다.
3. 프로젝트 조건을 선택하고 **전략 추천 생성** 버튼을 누르면 결과를 확인할 수 있습니다.

> 참고: `app.js`는 `fetch`로 `data/*.json`을 읽습니다. 로딩 실패 시에도 fallback 예시 데이터로 결과가 표시됩니다.
