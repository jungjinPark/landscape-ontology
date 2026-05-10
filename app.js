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
    { concept: "Urban Canopy", planting_strategies: ["대형 교목 캐노피 연속 식재", "층위형 하부식재로 미기후 안정화"] },
    { concept: "Quiet Resort", planting_strategies: ["향·질감 중심 식재", "저채도 재료와 조응하는 절제형 식재"] }
  ],
  spatialArchetypes: [{ archetype: "Corporate Forest Campus", landscape_elements: ["그늘 산책로", "포켓 라운지"] }],
  designRelationships: [],
  projectConceptMapping: [],
  strategyWeightBias: { projectTypeBias: {}, dominanceBoost: {}, urbanContextBias: {}, toneBias: {}, maintenanceBias: {}, conditionBias: {} }
};

const baseConceptWeights = {
  "Urban Canopy": 46, "Controlled Curve": 43, "Quiet Resort": 42, "Spatial Relief": 37,
  "Healing Flow": 44, "Layered Nature": 40, "Controlled Edge": 41, "Linear Forest": 38,
  "Spatial Buffer": 39, "Signature Plaza": 38, "Layered Experience": 36, "Event Plaza": 35,
  "Dynamic Flow": 37, "Framed Nature": 34, "Curved Transition": 34, "Sculpted Ground": 32
};

async function loadJson(path, fallback) {
  try { const res = await fetch(path); if (!res.ok) throw new Error(path); return await res.json(); }
  catch { return fallback; }
}

async function loadData() {
  const [designRelationships, projectConceptMapping, plantingStrategyMapping, spatialArchetypes, designDecisionRules, strategyWeightBias] = await Promise.all([
    loadJson("data/design_relationships.json", fallbackData.designRelationships),
    loadJson("data/project_concept_mapping.json", fallbackData.projectConceptMapping),
    loadJson("data/planting_strategy_mapping.json", fallbackData.plantingStrategyMapping),
    loadJson("data/spatial_archetypes.json", fallbackData.spatialArchetypes),
    loadJson("data/design_decision_rules.json", fallbackData.designDecisionRules),
    loadJson("data/strategy_weight_bias.json", fallbackData.strategyWeightBias)
  ]);
  return { designRelationships, projectConceptMapping, plantingStrategyMapping, spatialArchetypes, designDecisionRules, strategyWeightBias };
}

const uniq = (arr) => [...new Set(arr.filter(Boolean))];

function accumulateBias(target, biasSet = {}, sourceLabel) {
  Object.entries(biasSet || {}).forEach(([concept, score]) => {
    if (!target[concept]) target[concept] = { score: baseConceptWeights[concept] || 30, reasons: [] };
    target[concept].score += score;
    target[concept].reasons.push(`${sourceLabel} +${score}`);
  });
}

function clampScore(score) { return Math.max(0, Math.min(100, score)); }

function computeWeights(input, db, rule) {
  const weights = {};
  Object.entries(baseConceptWeights).forEach(([concept, score]) => {
    weights[concept] = { score, reasons: ["base model"] };
  });

  (rule?.recommended_concepts || []).forEach((concept, i) => {
    const bias = i === 0 ? 12 : i === 1 ? 8 : 5;
    if (!weights[concept]) weights[concept] = { score: 30, reasons: [] };
    weights[concept].score += bias;
    weights[concept].reasons.push(`rule seed +${bias}`);
  });

  const wb = db.strategyWeightBias || {};
  accumulateBias(weights, wb.projectTypeBias?.[input.projectType], `${input.projectType} bias`);
  accumulateBias(weights, wb.urbanContextBias?.[input.urbanContext], `${input.urbanContext} context`);
  accumulateBias(weights, wb.toneBias?.[input.tone], `${input.tone} tone`);
  accumulateBias(weights, wb.maintenanceBias?.[input.maintenance], `${input.maintenance} maintenance`);
  input.conditions.forEach((condition) => accumulateBias(weights, wb.conditionBias?.[condition], `${condition} condition`));
  accumulateBias(weights, wb.dominanceBoost?.[input.projectType], `${input.projectType} dominance`);

  return Object.entries(weights)
    .map(([concept, data]) => ({ concept, score: clampScore(data.score), reasons: data.reasons }))
    .sort((a, b) => b.score - a.score);
}

function toHierarchy(weighted) {
  return {
    primary: weighted.filter((w) => w.score >= 90),
    secondary: weighted.filter((w) => w.score >= 70 && w.score <= 89),
    supporting: weighted.filter((w) => w.score >= 50 && w.score <= 69)
  };
}

function recommend(input, db) {
  const rule = db.designDecisionRules.find((r) => r.project_type === input.projectType) || db.designDecisionRules[0];
  const weightedConcepts = computeWeights(input, db, rule);
  const hierarchy = toHierarchy(weightedConcepts);

  const primaryDesignLanguage = hierarchy.primary.map((v) => v.concept);
  const secondaryDesignLanguage = hierarchy.secondary.map((v) => v.concept).slice(0, 4);
  const emotionalLayer = hierarchy.supporting.map((v) => v.concept).slice(0, 4);

  const topConcepts = weightedConcepts.filter((w) => w.score >= 50).slice(0, 8).map((w) => w.concept);
  const mappedPlanting = topConcepts.map((c) => db.plantingStrategyMapping.find((p) => p.concept === c)?.planting_strategies || []).flat();

  const archetypes = uniq((rule?.recommended_archetypes || []).concat(
    input.conditions.includes("선큰공간 포함") ? ["Layered Terrace Garden"] : [],
    input.conditions.includes("보행 연결 중요") ? ["Immersive Walk Garden"] : []
  )).slice(0, 4);

  const reasonPrimary = weightedConcepts.slice(0, 2).map((x) => `${x.concept}(${x.score})`).join(" / ");
  const reason = `${input.projectType} + ${input.urbanContext} 맥락 + ${input.conditions.join(" + ") || "기본 오픈스페이스"} + ${input.tone} 톤 조건으로 ${reasonPrimary}의 weight가 우세해 Primary로 결정되었습니다. Secondary는 결절부 전환·공공성 보완을 위해 병행되며, Supporting layer는 감성/미기후 완충 역할로 배치됩니다.`;

  return {
    primaryDesignLanguage,
    secondaryDesignLanguage,
    emotionalLayer,
    recommendationReason: reason,
    weightedConcepts,
    archetypes,
    plantingStrategies: {
      "캐노피 전략": uniq(mappedPlanting.filter((item) => item.includes("캐노피") || item.includes("교목"))).slice(0, 2),
      "하부 식재 전략": uniq(mappedPlanting.filter((item) => item.includes("하부") || item.includes("층위"))).slice(0, 2),
      "계절감 전략": input.maintenance === "고관리" ? ["계절 개화/단풍 연출형 초화·관목 레이어를 강화"] : ["상록·낙엽 수종 균형으로 사계절 리듬을 안정적으로 확보"],
      "유지관리 전략": input.maintenance === "저관리" ? ["내건성·저관리 수종 중심의 관수/전정 단순화"] : ["현장 관리 수준에 맞춘 단계별 관수·전정 계획을 적용"]
    }
  };
}

function renderNestedList(items) { return `<ul>${items.map((v) => `<li>${v}</li>`).join("")}</ul>`; }
function renderCategoryBlock(title, items) { return `<div class="sub-card"><h4>${title}</h4>${renderNestedList(items)}</div>`; }

function renderWeightRows(items) {
  return items.map((item, i) => {
    const tier = item.score >= 90 ? "Primary" : item.score >= 70 ? "Secondary" : "Supporting";
    return `<div class="weight-row ${tier.toLowerCase()}">
      <div class="weight-head"><strong>${i + 1}. ${item.concept}</strong><span class="score-chip">${item.score}</span></div>
      <div class="bar-track"><span class="bar-fill" style="width:${item.score}%;"></span></div>
      <p class="weight-meta">${tier} · ${item.reasons.slice(-2).join(" / ")}</p>
    </div>`;
  }).join("");
}

function renderResult(rec) {
  document.getElementById("result").innerHTML = `
    <div class="result-grid">
      <article class="result-card primary-card"><h3>1. Primary Design Language</h3><div class="primary-items">${rec.primaryDesignLanguage.map((item) => `<span class="primary-pill">${item}</span>`).join("") || "<span class='primary-pill'>No primary above 90</span>"}</div></article>
      <article class="result-card secondary-card"><h3>2. Secondary Design Language</h3><div class="secondary-items">${rec.secondaryDesignLanguage.map((item) => `<span class="secondary-pill">${item}</span>`).join("") || "<span class='secondary-pill'>No secondary</span>"}</div></article>
      <article class="result-card emotion-card"><h3>3. Supporting Emotional Layer</h3><div class="emotion-tags">${rec.emotionalLayer.map((item) => `<span class="emotion-tag">${item}</span>`).join("") || "<span class='emotion-tag'>No supporting layer</span>"}</div></article>
      <article class="result-card full-width"><h3>4. Strategy Weight Inference</h3>${renderWeightRows(rec.weightedConcepts.filter((w) => w.score >= 50).slice(0, 10))}</article>
      <article class="result-card full-width"><h3>5. Recommendation Reason</h3><p>${rec.recommendationReason}</p></article>
      <article class="result-card full-width"><h3>6. Recommended Spatial Archetypes</h3>${renderNestedList(rec.archetypes)}</article>
      <article class="result-card full-width"><h3>7. Recommended Planting Strategy</h3><div class="nested-grid">${Object.entries(rec.plantingStrategies).map(([title, items]) => renderCategoryBlock(title, items)).join("")}</div></article>
    </div>`;
}

(async function init() {
  const status = document.getElementById("status");
  const db = await loadData();
  status.textContent = "데이터 로딩 완료. Weight 기반 추론 시스템 활성화.";
  document.getElementById("strategy-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = {
      projectType: document.getElementById("projectType").value,
      urbanContext: document.getElementById("urbanContext").value,
      tone: document.getElementById("tone").value,
      maintenance: document.getElementById("maintenance").value,
      conditions: [...document.querySelectorAll("#conditions input:checked")].map((i) => i.value)
    };
    renderResult(recommend(input, db));
  });
  renderResult(recommend({ projectType: "Office Headquarters", urbanContext: "도심형", tone: "Quiet Resort", maintenance: "중관리", conditions: ["보행 연결 중요", "공개공지 포함"] }, db));
})();
