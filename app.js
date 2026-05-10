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

function toKoreanProjectName(projectType) {
  const mapping = {
    "Office Headquarters": "도심형 오피스",
    "Data Center": "데이터센터",
    "Hospital": "의료시설",
    "Mixed-use Complex": "복합개발"
  };
  return mapping[projectType] || projectType;
}

function recommend(input, db) {
  const rule = db.designDecisionRules.find((r) => r.project_type === input.projectType) || db.designDecisionRules[0];
  const toneConcepts = toneConceptMap[input.tone] || [];
  const concepts = uniq([...(rule?.recommended_concepts || []), ...toneConcepts]).slice(0, 6);

  const primaryDesignLanguage = concepts.slice(0, 2);
  const secondaryDesignLanguage = concepts.slice(2, 5);
  const emotionalLayer = uniq([input.tone, ...toneConcepts.filter((concept) => !primaryDesignLanguage.includes(concept))]).slice(0, 3);

  const archetypes = uniq((rule?.recommended_archetypes || []).concat(
    input.conditions.includes("선큰공간 포함") ? ["Layered Terrace Garden"] : [],
    input.conditions.includes("보행 연결 중요") ? ["Immersive Walk Garden"] : []
  )).slice(0, 4);

  const mappedPlanting = concepts
    .map((c) => db.plantingStrategyMapping.find((p) => p.concept === c)?.planting_strategies || [])
    .flat();

  const plantingStrategies = {
    "캐노피 전략": uniq(mappedPlanting.filter((item) => item.includes("캐노피") || item.includes("교목"))).slice(0, 2),
    "하부 식재 전략": uniq(mappedPlanting.filter((item) => item.includes("하부") || item.includes("층위"))).slice(0, 2),
    "계절감 전략": input.maintenance === "고관리"
      ? ["계절 개화/단풍 연출형 초화·관목 레이어를 강화"]
      : ["상록·낙엽 수종 균형으로 사계절 리듬을 안정적으로 확보"],
    "유지관리 전략": input.maintenance === "저관리"
      ? ["내건성·저관리 수종 중심의 관수/전정 단순화"]
      : ["현장 관리 수준에 맞춘 단계별 관수·전정 계획을 적용"]
  };

  const spatialStrategies = {
    "주동선 전략": [
      input.conditions.includes("보행 연결 중요")
        ? "주 보행축에 연속 캐노피를 적용해 이동 동선을 명확히 연결"
        : "프로젝트 진입부와 핵심 시설을 연결하는 명료한 주동선을 설정"
    ],
    "체류 노드 전략": ["결절부에 포켓 라운지/그늘 쉼터를 배치해 체류 밀도를 조절"],
    "공개공지 전략": [
      input.conditions.includes("공개공지 포함")
        ? "개방형 광장과 이벤트 포켓을 결합해 공공성과 프로그램 수용성을 강화"
        : "오픈스페이스를 소규모 커뮤니티 포켓 중심으로 계획"
    ],
    "옥상 전략": [
      input.conditions.includes("옥상정원 포함")
        ? "경량 토심 대응형 식재와 데크 쉼터를 결합한 저속 순환형 옥상정원을 적용"
        : "옥상은 향후 확장 가능한 그린 인프라 예비 영역으로 계획"
    ]
  };

  const signatureElements = uniq([
    "시그니처 쉘터",
    "조형 벤치",
    input.conditions.includes("공개공지 포함") ? "수공간" : null,
    "조명 구조물"
  ]);

  const conditionSummary = input.conditions.length ? input.conditions.join(" + ") : "기본 오픈스페이스";
  const reason = `${toKoreanProjectName(input.projectType)} + ${conditionSummary} 조건이므로 ${primaryDesignLanguage[0]}를 핵심 전략으로 설정하고, ${secondaryDesignLanguage[0] || primaryDesignLanguage[1] || "Layered Experience"}를 통해 보행·체류 전환 경험을 보완합니다.`;

  const promptKeywords = uniq([
    ...primaryDesignLanguage,
    ...secondaryDesignLanguage,
    ...emotionalLayer,
    input.maintenance === "저관리" ? "Low Maintenance Planting" : "Layered Planting",
    "Low Saturation Material"
  ]);

  return {
    primaryDesignLanguage,
    secondaryDesignLanguage,
    emotionalLayer,
    recommendationReason: reason,
    archetypes,
    plantingStrategies,
    spatialStrategies,
    signatureElements,
    promptKeywords
  };
}

function renderNestedList(items) {
  return `<ul>${items.map((v) => `<li>${v}</li>`).join("")}</ul>`;
}

function renderCategoryBlock(title, items) {
  return `<div class="sub-card"><h4>${title}</h4>${renderNestedList(items)}</div>`;
}

function renderResult(rec) {
  const el = document.getElementById("result");
  el.innerHTML = `
    <div class="result-grid">
      <article class="result-card primary-card">
        <h3>1. Primary Design Language</h3>
        <p class="card-caption">프로젝트를 리드하는 핵심 설계 언어</p>
        <div class="primary-items">${rec.primaryDesignLanguage.map((item) => `<span class="primary-pill">${item}</span>`).join("")}</div>
      </article>

      <article class="result-card secondary-card">
        <h3>2. Secondary Design Language</h3>
        <p class="card-caption">핵심 설계 언어를 보완하는 보조 전략</p>
        <div class="secondary-items">${rec.secondaryDesignLanguage.map((item) => `<span class="secondary-pill">${item}</span>`).join("")}</div>
      </article>

      <article class="result-card emotion-card">
        <h3>3. Supporting Emotional Layer</h3>
        <div class="emotion-tags">${rec.emotionalLayer.map((item) => `<span class="emotion-tag">${item}</span>`).join("")}</div>
      </article>

      <article class="result-card full-width">
        <h3>4. Recommendation Reason</h3>
        <p>${rec.recommendationReason}</p>
      </article>

      <article class="result-card full-width">
        <h3>5. Recommended Spatial Archetypes</h3>
        ${renderNestedList(rec.archetypes)}
      </article>

      <article class="result-card full-width">
        <h3>6. Recommended Planting Strategy</h3>
        <div class="nested-grid">
          ${Object.entries(rec.plantingStrategies).map(([title, items]) => renderCategoryBlock(title, items)).join("")}
        </div>
      </article>

      <article class="result-card full-width">
        <h3>7. Recommended Spatial Strategy</h3>
        <div class="nested-grid">
          ${Object.entries(rec.spatialStrategies).map(([title, items]) => renderCategoryBlock(title, items)).join("")}
        </div>
      </article>

      <article class="result-card full-width">
        <h3>8. Signature Elements</h3>
        ${renderNestedList(rec.signatureElements)}
      </article>

      <article class="result-card full-width">
        <h3>9. Expandable AI Prompt Keywords</h3>
        <div class="keyword-tags">${rec.promptKeywords.map((item) => `<span>${item}</span>`).join("")}</div>
      </article>
    </div>
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
      conditions: [...document.querySelectorAll("#conditions input:checked")].map((i) => i.value)
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
