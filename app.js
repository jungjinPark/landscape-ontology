const fallbackData = {
  designDecisionRules: [
    {
      project_type: "Office Headquarters",
      recommended_concepts: ["Urban Canopy", "Controlled Curve", "Quiet Resort"],
      recommended_archetypes: ["Corporate Forest Campus", "Urban Linear Plaza"],
      spatial_strategies: ["직선 동선 + 결절부 곡선 전환", "연속 캐노피 기반 보행축"],
      emotional_tones: ["도시적이고 정제된 신뢰감"]
    }
  ],
  plantingStrategyMapping: [
    {
      concept: "Urban Canopy",
      planting_strategies: ["대형 교목 캐노피 연속 식재", "층위형 하부식재로 미기후 안정화"]
    },
    {
      concept: "Quiet Resort",
      planting_strategies: ["향·질감 중심 식재", "저채도 재료와 조응하는 절제형 식재"]
    }
  ],
  spatialArchetypes: [
    { archetype: "Corporate Forest Campus", landscape_elements: ["그늘 산책로", "포켓 라운지"] }
  ],
  designRelationships: [],
  projectConceptMapping: []
};

const toneConceptMap = {
  "Quiet Resort": ["Quiet Resort", "Framed Nature", "Spatial Relief"],
  "Urban Forest": ["Urban Canopy", "Linear Forest"],
  "Minimal Modern": ["Controlled Curve", "Framed Nature"],
  "Immersive Healing": ["Spatial Relief", "Curved Transition", "Layered Experience"],
  "Signature Landmark": ["Signature Pause", "Sculpted Ground", "Framed Nature"]
};

const conditionHints = {
  "옥상정원 포함": "옥상은 저속 순환형 정원으로 계획하고 경량 토심 대응 식재를 우선 고려",
  "보행 연결 중요": "주 보행축의 연속 캐노피 + 결절부 감속 전략을 우선 적용",
  "선큰공간 포함": "채광·통풍·배수 조건을 반영한 층위형 테라스 공간 구성",
  "피로티 하부 포함": "반음영 대응 내음성 식재와 휴게 포켓 연계",
  "공개공지 포함": "도시 공공성 대응형 광장/포켓 공간을 병행 구성",
  "조망 중요": "시선축 프레이밍 + 차폐 높이 제어형 식재 전략 적용"
};

async function loadJson(path, fallback) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(path);
    return await res.json();
  } catch {
    return fallback;
  }
}

async function loadData() {
  const [designRelationships, projectConceptMapping, plantingStrategyMapping, spatialArchetypes, designDecisionRules] = await Promise.all([
    loadJson("data/design_relationships.json", fallbackData.designRelationships),
    loadJson("data/project_concept_mapping.json", fallbackData.projectConceptMapping),
    loadJson("data/planting_strategy_mapping.json", fallbackData.plantingStrategyMapping),
    loadJson("data/spatial_archetypes.json", fallbackData.spatialArchetypes),
    loadJson("data/design_decision_rules.json", fallbackData.designDecisionRules)
  ]);
  return { designRelationships, projectConceptMapping, plantingStrategyMapping, spatialArchetypes, designDecisionRules };
}

function uniq(arr) { return [...new Set(arr.filter(Boolean))]; }

function recommend(input, db) {
  const rule = db.designDecisionRules.find(r => r.project_type === input.projectType) || db.designDecisionRules[0];
  const toneConcepts = toneConceptMap[input.tone] || [];
  const concepts = uniq([...(rule?.recommended_concepts || []), ...toneConcepts]).slice(0, 6);

  const archetypes = uniq((rule?.recommended_archetypes || []).concat(
    input.conditions.includes("선큰공간 포함") ? ["Layered Terrace Garden"] : [],
    input.conditions.includes("보행 연결 중요") ? ["Immersive Walk Garden"] : []
  )).slice(0, 4);

  const planting = concepts
    .map(c => db.plantingStrategyMapping.find(p => p.concept === c)?.planting_strategies?.[0])
    .filter(Boolean)
    .slice(0, 4);

  const structural = [];
  if (input.conditions.includes("공개공지 포함")) structural.push("개방형 광장 + 모듈형 휴게가구로 공공성 강화");
  if (input.conditions.includes("옥상정원 포함")) structural.push("경량 플랜터/데크 기반의 옥상형 그늘 휴게시설 적용");
  if (input.conditions.includes("피로티 하부 포함")) structural.push("반사광 저감 마감 + 내음성 식재 + 소규모 라운지 계획");
  if (input.maintenance === "저관리") structural.push("내건성·저관리 수종 중심 및 관수/전정 단순화");
  if (input.maintenance === "고관리") structural.push("계절 연출형 초화·수경·정밀 관리형 디테일 적용");

  const extraSpatial = input.conditions.map(c => conditionHints[c]).filter(Boolean);
  const spatial = uniq([...(rule?.spatial_strategies || []), ...extraSpatial]).slice(0, 5);

  const keywords = uniq([
    input.projectType, input.urbanContext, input.tone,
    ...concepts.slice(0, 3), ...archetypes.slice(0, 2),
    input.maintenance === "저관리" ? "low maintenance planting" : "layered planting"
  ]).join(", ");

  return {
    designLanguage: concepts.join(" · "),
    archetype: archetypes.join(" / "),
    planting,
    spatial,
    structural: structural.length ? structural : ["보행·체류·조망 균형을 기준으로 시설물을 절제 배치"],
    tone: input.tone,
    promptKeywords: keywords
  };
}

function renderResult(rec) {
  const el = document.getElementById("result");
  el.innerHTML = `
    <div class="result-card"><h3>추천 설계 언어</h3><p>${rec.designLanguage}</p></div>
    <div class="result-card"><h3>추천 공간 archetype</h3><p>${rec.archetype}</p></div>
    <div class="result-card"><h3>추천 식재 전략</h3><ul>${rec.planting.map(v => `<li>${v}</li>`).join("")}</ul></div>
    <div class="result-card"><h3>추천 공간 전략</h3><ul>${rec.spatial.map(v => `<li>${v}</li>`).join("")}</ul></div>
    <div class="result-card"><h3>추천 구조물 및 시설물 방향</h3><ul>${rec.structural.map(v => `<li>${v}</li>`).join("")}</ul></div>
    <div class="result-card"><h3>감성 톤</h3><p>${rec.tone}</p></div>
    <div class="result-card"><h3>AI 이미지 생성 프롬프트 키워드</h3><div class="keyword-box">${rec.promptKeywords}</div></div>
  `;
}

(async function init() {
  const status = document.getElementById("status");
  const db = await loadData();
  status.textContent = "데이터 로딩 완료. 조건을 선택하고 추천을 생성하세요.";

  const form = document.getElementById("strategy-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = {
      projectType: document.getElementById("projectType").value,
      urbanContext: document.getElementById("urbanContext").value,
      tone: document.getElementById("tone").value,
      maintenance: document.getElementById("maintenance").value,
      conditions: [...document.querySelectorAll("#conditions input:checked")].map(i => i.value)
    };
    const rec = recommend(input, db);
    renderResult(rec);
  });

  renderResult(recommend({
    projectType: "Office Headquarters",
    urbanContext: "도심형",
    tone: "Quiet Resort",
    maintenance: "중관리",
    conditions: ["보행 연결 중요", "공개공지 포함"]
  }, db));
})();
