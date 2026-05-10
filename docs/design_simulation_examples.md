# Design Simulation Examples

본 문서는 프로젝트 입력 조건을 기반으로 설계 언어(Design Language), 공간 Archetype, 식재 전략, 감성 톤을 추론하는 **실무형 시뮬레이션 예시**이다.  
구성 로직은 `Project Type → Site Input → Design Language → Spatial Archetype → Spatial/Planting Strategy → Mood & Signature` 순서를 따르며, 각 판단은 `design_decision_rules`와 `project/concept/archetype 매핑`의 연결 원칙을 반영했다.

---

# Project Simulation

## 1. Project Input
- **프로젝트 유형**: Data Center
- **도시 맥락**: 산업단지형 외곽 입지, 대형 필지, 보행 활성도 낮고 차량/서비스 동선 비중 높음
- **건축 특징**: 수평적으로 긴 매스, 설비 파사드 비중 큼, 일부 구간은 보안 펜스와 인접
- **사용자 특성**: 교대 근무자 중심, 방문객 소수, 단시간 회복 휴게 수요 높음
- **유지관리 방향**: 저관리~중관리(운영 안정성 우선)
- **공개공지/옥상 여부**: 공개공지 제한적, 옥상 일부 활용 가능
- **원하는 분위기 및 감성 톤**: 통제된 안정감, 저자극 회복감, 절제된 프리미엄

---

## 2. Recommended Design Language
- **Spatial Relief (Primary)**  
  데이터센터의 경직된 운영·보안 환경에서 심리적 완충이 우선 과제이므로 1순위로 설정한다. 소음·설비 시각 자극을 완화하는 경계녹지와 저속 보행 노드가 핵심이다.
- **Urban Canopy (Secondary)**  
  대형 매스 스케일과 열환경 문제를 동시에 다루기 위해 캐노피 레이어를 결합한다. 출입·교대 동선 주변 그늘축을 통해 체류 품질을 높인다.
- **Controlled Curve (Tertiary)**  
  직선 위주의 기능 동선은 유지하되 결절부에만 곡선 전환을 적용해 과도한 조형 없이 긴장을 완화한다.
- **Quiet Resort (Mood Layer)**  
  Spatial Relief로 안정된 리듬을 만든 뒤, 저채도 재료·정제된 식재로 감성 톤을 정리해 장시간 근무자의 회복감을 강화한다.

---

## 3. Recommended Spatial Archetypes
- **Main: Resort-style Open Space**  
  대중 집객보다는 내부 사용자 회복을 우선하는 데이터센터 특성과 맞다. 여백 중심의 조용한 오픈스페이스가 운영 안정성과 정서 품질을 동시에 확보한다.
- **Supporting 1: Corporate Forest Campus**  
  장거리 이동 동선과 건축 외곽 경계를 연속 캐노피로 묶어, 기능적 캠퍼스 구조 안에서도 숲형 일상 동선을 만든다.
- **Supporting 2: Healing Courtyard (제한 적용)**  
  휴게실 인접 중정 또는 내부 접근 가능한 반중정 구간에 적용해 교대 사이 짧은 회복 체류를 지원한다.

---

## 4. Spatial Strategies
- **보행 흐름 전략**: 서비스/보안 동선과 직원 보행 동선을 명확히 분리하고, 교차 가능 구간은 감속형 포켓 공간으로 완충한다.
- **공간 시퀀스 전략**: 진입(가독성 높은 직선) → 완충(곡선 전환) → 체류(반음영 라운지) → 복귀(최단 연결) 구조로 단순화한다.
- **공개공지 전략**: 공개영역은 최소화하되, 전면부는 기업 신뢰감을 주는 정제된 오픈스페이스로 구성한다.
- **옥상 휴게 전략**: 옥상은 Quiet Roof Garden 성격으로 저토심·내풍 식재와 차양형 휴게를 결합한다.
- **건축과 외부공간 연결 전략**: 긴 수평 파사드 앞에 Linear Forest 성격의 식재 버퍼를 두어 설비성 인상을 완화한다.

---

## 5. Planting Strategies
- **캐노피 전략**: 교대 동선과 휴게 노드를 연결하는 연속 교목 캐노피를 구축해 그늘 네트워크를 형성한다.
- **하부식재 전략**: 저관리형 지피+중층 관목의 반복 모듈을 적용해 유지관리 리스크를 낮춘다.
- **색채 및 질감 전략**: 저채도 녹색 기반에 미세한 질감 차를 두어 차분하지만 단조롭지 않게 구성한다.
- **유지관리 전략**: 핵심 체류 노드(중관리)와 외곽 완충녹지(저관리)로 등급을 분리한다.
- **계절감 전략**: 극단적 연출보다 완만한 계절 변화를 우선해 연중 안정된 경관을 유지한다.

---

## 6. Spatial Mood & Emotional Tone
- 통제된 환경 속 **차분한 회복 공간**
- 기능 시설의 긴장을 완화하는 **도시 속 숲 완충 경험**
- 과장 없는 디테일의 **절제된 도시형 리조트 감성**

---

## 7. Signature Elements
- 보안 동선과 분리된 **시그니처 쉘터형 휴게노드**
- 야간 교대 이용자를 위한 **저조도 라인 조명 구조물**
- 파사드 전면의 **선형 조형 벤치 + 식재 포켓**
- 소규모 반사 수경 또는 미스트형 **미기후 장치**

---

## 8. Expandable AI Prompt Keywords
- Spatial Relief
- Urban Canopy
- Quiet Resort
- Controlled Curve Junction
- Linear Forest Edge
- Low-maintenance Layered Planting
- Shaded Staff Lounge Garden
- Restrained Premium Material Palette

---

# Project Simulation

## 1. Project Input
- **프로젝트 유형**: Hospital
- **도시 맥락**: 도심형 + 주거 인접, 보행 접근성 높음, 응급/외래/입원 동선이 중첩
- **건축 특징**: 중정형 블록 + 외래동 전면 광장, 내외부 이동이 잦은 복합 출입체계
- **사용자 특성**: 환자·보호자·의료진 혼재, 불안 저감과 직관적 방향 인지가 중요
- **유지관리 방향**: 중관리(핵심 치유정원은 상대적 고관리)
- **공개공지/옥상 여부**: 공개공지 있음, 옥상 치유정원 일부 계획
- **원하는 분위기 및 감성 톤**: 안온함, 보호감, 조용한 회복, 과자극 배제

---

## 2. Recommended Design Language
- **Spatial Relief (Primary)**  
  병원 프로그램 특성상 긴장 완화가 최우선이므로 기본 레이어로 적용한다.
- **Curved Transition / Controlled Curve (Secondary)**  
  응급하지 않은 일반 보행축에서 직선 동선의 압박을 줄이고 심리적 전이를 부드럽게 만든다.
- **Quiet Resort (Mood Layer)**  
  저자극 재료·반음영 체류·향기/질감 식재를 통해 회복 중심의 안정된 감성을 형성한다.
- **Urban Canopy (Supportive)**  
  외래 대기·보호자 체류가 많은 구간에 그늘과 미기후 완충을 제공한다.

---

## 3. Recommended Spatial Archetypes
- **Main: Healing Courtyard**  
  병원의 내향형 회복 구조와 가장 직접적으로 맞물린다. 짧은 산책만으로도 심리 안정이 가능한 중정형 구성이 핵심이다.
- **Supporting 1: Immersive Walk Garden**  
  외래-입원-편의시설을 연결하는 보행축에 단계적 풍경 전개를 제공해 이동 피로를 줄인다.
- **Supporting 2: Quiet Roof Garden**  
  재활·보호자 대기 등 저속 체류 프로그램을 위한 반사열 저감형 옥상 정원으로 적용한다.

---

## 4. Spatial Strategies
- **보행 흐름 전략**: 응급/물류 동선과 일반 보행을 분리하고, 환자 동선은 최소 회전·최소 혼란 원칙으로 계획한다.
- **공간 시퀀스 전략**: 도착(명확한 방향성) → 안정 전이(완만한 곡선) → 회복 체류(치유정원) → 재이동(직관적 복귀).
- **공개공지 전략**: 공개광장은 활동성보다 정온성을 우선하며, 휴게 밀도를 분산 배치해 혼잡을 피한다.
- **옥상 휴게 전략**: 의료 프로그램과 연동해 조용한 재활 산책 루프와 보호자 대기 라운지를 구성한다.
- **건축과 외부공간 연결 전략**: 대기실·복도 창면에서 자연이 프레임으로 보이도록 Framed Nature를 적용한다.

---

## 5. Planting Strategies
- **캐노피 전략**: 외래 대기축과 중정 경계에 반음영 캐노피를 배치해 눈부심과 열부하를 저감한다.
- **하부식재 전략**: 시야를 막지 않는 저·중층 식재를 중심으로 향기/촉감 식물을 선택해 정서적 안정감을 높인다.
- **색채 및 질감 전략**: 고채도 대비를 줄이고, 부드러운 녹색 그라데이션과 계절 소화 가능한 초화를 제한적으로 사용한다.
- **유지관리 전략**: 치유정원 핵심 구간은 집중 관리, 주변 연결녹지는 표준 관리로 이원화한다.
- **계절감 전략**: 봄·가을 중심의 완만한 변화가 읽히는 수종 배치로 회복 리듬을 지원한다.

---

## 6. Spatial Mood & Emotional Tone
- **차분한 회복 공간**과 보호감 있는 동선
- 병원 내외부를 잇는 **저속 몰입형 산책 경험**
- 의료 환경의 긴장을 낮추는 **절제된 리조트형 치유 감성**

---

## 7. Signature Elements
- 중정 중심의 **치유 수공간(저소음형)**
- 대기구간의 **포근한 곡선형 벤치/앉음벽**
- 병동 연계 **감성 조명 캐노피**
- 계절 변화를 담는 **포토 포인트형 프레임 정원**

---

## 8. Expandable AI Prompt Keywords
- Healing Courtyard
- Spatial Relief Garden
- Quiet Resort Hospital Landscape
- Curved Transition Walkway
- Framed Nature View from Corridor
- Layered Therapeutic Planting
- Low-stimulation Material Tone

---

# Project Simulation

## 1. Project Input
- **프로젝트 유형**: Office Headquarters
- **도시 맥락**: 도심 업무지구, 보행 및 대중교통 접근성 높음, 브랜드 노출 중요
- **건축 특징**: 직선형 타워 + 저층부 포디엄, 전면 공개공지와 다중 출입구
- **사용자 특성**: 임직원 상시 이용 + 방문객 응대 + 점심시간 고밀 체류
- **유지관리 방향**: 중관리~고관리(대표 공간 품질 유지 필요)
- **공개공지/옥상 여부**: 공개공지 적극 활용, 옥상 휴게공간 계획
- **원하는 분위기 및 감성 톤**: 신뢰감, 정제감, 도시 속 숲 기반 업무 일상

---

## 2. Recommended Design Language
- **Urban Canopy (Primary)**  
  열환경 완화와 업무 일상형 체류 품질 확보를 동시에 달성하기 위한 핵심 언어다.
- **Controlled Curve (Secondary)**  
  직선 위주의 기업 공간 질서를 유지하면서 결절부 전환을 부드럽게 만들어 동선 충돌을 줄인다.
- **Spatial Relief (Secondary)**  
  출퇴근·점심 피크의 밀도 스트레스를 완충하기 위해 포켓형 여백 공간을 삽입한다.
- **Quiet Resort (Refinement Layer)**  
  VIP/라운지성 구간에 절제된 프리미엄 감성을 더해 브랜드 공간의 완성도를 높인다.
- **Signature Pause (Node Layer)**  
  도착 광장과 핵심 결절부에 상징적 기억점을 계획해 기업 아이덴티티를 강화한다.

---

## 3. Recommended Spatial Archetypes
- **Main: Corporate Forest Campus**  
  업무시설 외부공간을 연속된 숲형 시퀀스로 구성해 출근-업무-휴식 흐름을 하나의 경험으로 통합한다.
- **Supporting 1: Urban Linear Plaza**  
  공개공지의 통과·체류 기능을 병렬화해 업무지구의 빠른 흐름과 체류 수요를 동시에 수용한다.
- **Supporting 2: Signature Arrival Plaza / Quiet Roof Garden**  
  전면 도착부는 브랜드 인지 중심, 옥상은 조용한 회복 중심으로 역할을 분리한다.

---

## 4. Spatial Strategies
- **보행 흐름 전략**: 출퇴근 주동선은 직관적으로, 점심·휴게 동선은 우회 가능한 루프로 이중화한다.
- **공간 시퀀스 전략**: Arrival Plaza → Canopy Walk → Pocket Lounge → Community Deck 순으로 리듬을 만든다.
- **공개공지 전략**: 통과축과 체류축을 분리하고, 결절부에 Signature Pause를 배치해 혼잡을 분산한다.
- **옥상 휴게 전략**: 조망·바람을 고려한 반음영 라운지와 소규모 미팅 포켓을 계획한다.
- **건축과 외부공간 연결 전략**: 파사드 모듈과 연동한 Framed Nature 구간을 설정해 내부 시선 품질을 높인다.

---

## 5. Planting Strategies
- **캐노피 전략**: 주출입-공개공지-포디엄을 잇는 연속 교목축으로 업무 일상의 그늘 인프라를 구축한다.
- **하부식재 전략**: 동선 가장자리에는 시야를 열어두고, 체류 포켓에는 밀도 있는 감성 식재를 집중 배치한다.
- **색채 및 질감 전략**: 기업 이미지와 조응하는 저채도 베이스에 계절 포인트를 절제해 삽입한다.
- **유지관리 전략**: 브랜드 노출이 큰 전면부는 고관리, 후면·경계부는 표준 관리로 차등 운영한다.
- **계절감 전략**: 봄 개화·여름 그늘·가을 수형·겨울 구조미가 읽히는 4계절 프레임을 설계한다.

---

## 6. Spatial Mood & Emotional Tone
- **도시 속 숲 경험** 기반의 업무 리듬 회복
- **정제된 도시형 리조트 감성**과 기업 신뢰감의 결합
- 빠른 업무 흐름 사이의 **몰입형 산책 경험**

---

## 7. Signature Elements
- 기업 아이덴티티와 연동한 **시그니처 쉘터/캐노피**
- 미팅과 휴게를 겸하는 **조형 벤치 시스템**
- 도착부 인지성을 높이는 **포컬 수공간 또는 미스트 게이트**
- 야간 브랜드 가독성을 높이는 **레이어드 조명 구조물**

---

## 8. Expandable AI Prompt Keywords
- Corporate Forest Campus
- Urban Canopy Boulevard
- Controlled Curve Plaza Junction
- Signature Arrival Node
- Quiet Resort Office Courtyard
- Low Saturation Stone and Wood
- Layered Planting for Business District

---

# Project Simulation

## 1. Project Input
- **프로젝트 유형**: Mixed-use Complex
- **도시 맥락**: 고밀 도심 복합개발, 상업가로·주거동·업무동이 접합된 복합 보행 네트워크
- **건축 특징**: 타워+포디엄+테라스형 저층부, 레벨 차와 다중 진입축 존재
- **사용자 특성**: 거주자·상업 방문객·업무 이용자가 시간대별로 급변
- **유지관리 방향**: 중관리(핵심 광장/테라스는 집중 관리)
- **공개공지/옥상 여부**: 공개공지 필수, 옥상 및 테라스 활성화 요구 높음
- **원하는 분위기 및 감성 톤**: 도시 활력과 주거 안정의 균형, 프리미엄이지만 과밀하지 않은 체류감

---

## 2. Recommended Design Language
- **Signature Pause (Primary for Public Nodes)**  
  다중 사용자 환경에서 장소 인지와 집합 거점을 명확히 하기 위해 결절 노드 중심으로 우선 적용한다.
- **Controlled Curve (Primary for Flow Control)**  
  직선 도시축의 효율은 유지하면서 혼잡 결절부에서 흐름을 부드럽게 분산한다.
- **Urban Canopy (Environmental Backbone)**  
  장거리 보행축과 공개공지 열환경 개선을 위한 기반 인프라로 작동한다.
- **Layered Experience + Sculpted Ground (Spatial Depth)**  
  레벨 차가 큰 복합개발 특성에 맞춰 입체 동선과 단계적 체류 경험을 만든다.
- **Quiet Resort (Residential Interface Tone)**  
  주거 접점 구간의 감성 톤을 저자극으로 조율해 상업 활력과 충돌을 줄인다.

---

## 3. Recommended Spatial Archetypes
- **Main: Urban Linear Plaza**  
  복합개발의 주 보행축에서 통과·체류·이벤트를 통합 관리하기에 적합하다.
- **Supporting 1: Layered Terrace Garden**  
  단차·테라스가 많은 구간에 입체 순환과 조망 체류를 제공한다.
- **Supporting 2: Immersive Walk Garden / Resort-style Open Space**  
  주거 연결축은 몰입형 산책 경험으로, 주거 인접 포켓은 조용한 리조트 톤으로 차별화한다.

---

## 4. Spatial Strategies
- **보행 흐름 전략**: 고속 통과축(상업)과 저속 체류축(주거·커뮤니티)을 평면/단면 모두에서 분리한다.
- **공간 시퀀스 전략**: 메인광장(활력) → 전이테라스(완충) → 주거연결정원(정온)으로 분위기 그라데이션을 설계한다.
- **공개공지 전략**: 이벤트 대응 가능한 가변 광장을 두되, 주변부는 조용한 체류 포켓으로 완충한다.
- **옥상 휴게 전략**: 옥상/테라스를 생활권별로 세분해 가족형·개인형·커뮤니티형 휴게를 분리 배치한다.
- **건축과 외부공간 연결 전략**: 저층 상업 파사드에는 개방형 프레임, 주거 파사드에는 시야 안정형 Framed Nature를 적용한다.

---

## 5. Planting Strategies
- **캐노피 전략**: 메인 보행축은 연속 캐노피, 테라스 구간은 수관 스케일을 낮춘 다층 캐노피로 단계화한다.
- **하부식재 전략**: 상업 구간은 시인성 높은 저밀도, 주거 구간은 완충 중심 중밀도로 차등 구성한다.
- **색채 및 질감 전략**: 공공부는 계절 포인트를 허용하고, 주거 접점은 저채도·부드러운 질감으로 안정화한다.
- **유지관리 전략**: 이벤트 광장 주변은 집중 관리, 외곽 연결녹지는 저관리형 모듈 식재를 적용한다.
- **계절감 전략**: 사용자 재방문을 유도할 수 있도록 구간별 계절 포인트를 분산 배치한다.

---

## 6. Spatial Mood & Emotional Tone
- **도시적 활력과 질서**가 공존하는 공공 오픈스페이스
- 단계적으로 깊어지는 **층위 있는 탐색 경험**
- 주거 접점에서 완성되는 **차분한 회복형 리조트 감성**

---

## 7. Signature Elements
- 이벤트와 휴게를 겸하는 **멀티 시그니처 플라자 구조물**
- 레벨 차를 활용한 **테라스형 조형 벤치/데크**
- 아이코닉한 야간 연출을 위한 **미디어-라이트 조명 프레임**
- 주요 결절부의 **포토 포인트형 수공간/아트 식재 노드**

---

## 8. Expandable AI Prompt Keywords
- Urban Linear Plaza
- Layered Terrace Garden
- Signature Pause Node
- Controlled Curve Transition
- Urban Canopy Spine
- Mixed-use Resort-style Open Space
- Layered Planting with Seasonal Rhythm
- Premium Low-saturation Material Palette
