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
  strategyWeightBias: { projectTypeBias: {}, dominanceBoost: {}, urbanContextBias: {}, toneBias: {}, maintenanceBias: {}, conditionBias: {} },
  strategyCompatibility: {}
};

const baseConceptWeights = {
  "Urban Canopy": 46, "Controlled Curve": 43, "Quiet Resort": 42, "Spatial Relief": 37,
  "Healing Flow": 44, "Layered Nature": 40, "Controlled Edge": 41, "Linear Forest": 38,
  "Spatial Buffer": 39, "Signature Plaza": 38, "Layered Experience": 36, "Event Plaza": 35,
  "Dynamic Flow": 37, "Framed Nature": 34, "Curved Transition": 34, "Sculpted Ground": 32
};


const scenarioCatalog = {
  "Arrival Plaza": { phase: "Arrival", zone: "Public", description: "도시와 건축의 경계를 완화하는 개방형 진입공간", drivers: ["Signature Plaza", "Urban Canopy"] },
  "Canopy Walk": { phase: "Transition", zone: "Public", description: "연속 수관 아래 보행 흐름을 유도하는 주 동선", drivers: ["Urban Canopy", "Linear Forest"] },
  "Transition Curve Node": { phase: "Transition", zone: "Semi-public", description: "직선 동선에서 곡선 체류공간으로 감속 전환", drivers: ["Controlled Curve", "Spatial Relief"] },
  "Quiet Pocket Garden": { phase: "Rest", zone: "Semi-public", description: "짧은 휴식을 위한 저자극 포켓 정원", drivers: ["Quiet Resort", "Healing Flow"] },
  "Roof Outlook Lounge": { phase: "View", zone: "Private", description: "상부 레벨에서 조망과 체류를 결합한 라운지", drivers: ["Framed Nature", "Layered Experience"] },
  "Linear Canopy Walk": { phase: "Transition", zone: "Public", description: "명확한 축으로 이동성을 강화하는 선형 산책축", drivers: ["Linear Forest", "Urban Canopy"] },
  "Signature Node": { phase: "Rest", zone: "Semi-public", description: "브랜드 정체성을 담은 중심 결절 공간", drivers: ["Signature Plaza", "Controlled Curve"] },
  "Quiet Roof Lounge": { phase: "View", zone: "Private", description: "업무 사용자 중심의 고층 휴게·조망 공간", drivers: ["Layered Experience", "Framed Nature"] },
  "Healing Arrival": { phase: "Arrival", zone: "Public", description: "긴장을 완화하는 치유형 진입 전이 공간", drivers: ["Healing Flow", "Quiet Resort"] },
  "Slow Healing Walk": { phase: "Transition", zone: "Semi-public", description: "보행 속도를 낮추는 완만한 전이 산책로", drivers: ["Controlled Curve", "Healing Flow"] },
  "Recovery Courtyard": { phase: "Rest", zone: "Semi-public", description: "회복·정서 안정에 집중한 정원", drivers: ["Quiet Resort", "Layered Nature"] },
  "Therapy Terrace": { phase: "View", zone: "Private", description: "재활 활동과 외부 조망을 결합한 테라스", drivers: ["Healing Flow", "Framed Nature"] },
  "Security Buffer Walk": { phase: "Arrival", zone: "Public", description: "보안 레이어를 단계적으로 경험시키는 완충 동선", drivers: ["Spatial Buffer", "Controlled Edge"] },
  "Controlled Forest Edge": { phase: "Transition", zone: "Semi-public", description: "경계를 명확히 하되 녹지 가장자리로 압박감을 완화", drivers: ["Controlled Edge", "Linear Forest"] },
  "Quiet Deck": { phase: "Rest", zone: "Private", description: "소음·자극을 줄인 제한적 휴식 데크", drivers: ["Quiet Resort", "Spatial Relief"] },
  "Minimal Courtyard": { phase: "Exit", zone: "Private", description: "동선 마무리를 위한 절제된 중정", drivers: ["Spatial Relief", "Sculpted Ground"] },
  "Event Plaza": { phase: "Arrival", zone: "Public", description: "유입을 증폭하는 다목적 이벤트 광장", drivers: ["Event Plaza", "Dynamic Flow"] },
  "Retail Walk": { phase: "Transition", zone: "Public", description: "상업 프로그램과 연동되는 연속 보행축", drivers: ["Dynamic Flow", "Linear Forest"] },
  "Layered Terrace": { phase: "Rest", zone: "Semi-public", description: "수직 레벨 차를 활용한 다층 체류 테라스", drivers: ["Layered Experience", "Layered Nature"] },
  "Rooftop Social Garden": { phase: "View", zone: "Private", description: "커뮤니티 활동과 조망을 결합한 옥상 정원", drivers: ["Event Plaza", "Framed Nature"] }
};

const scenarioBiasByProjectType = {
  "Office Headquarters": ["Arrival Plaza", "Linear Canopy Walk", "Signature Node", "Quiet Roof Lounge"],
  "Hospital": ["Healing Arrival", "Slow Healing Walk", "Recovery Courtyard", "Therapy Terrace"],
  "Data Center": ["Security Buffer Walk", "Controlled Forest Edge", "Quiet Deck", "Minimal Courtyard"],
  "Mixed-use Complex": ["Event Plaza", "Retail Walk", "Layered Terrace", "Rooftop Social Garden"]
};

const spaceAllocationProfiles = {
  "Office Headquarters": {
    keywords: ["Arrival", "Plaza", "Canopy Walk", "Signature Node"],
    eventPenalty: ["Event Plaza"],
    reasons: "브랜드 아이덴티티와 대표 동선 경험 강화를 위해 진입 광장·캐노피 보행축·시그니처 결절의 비중을 높입니다."
  },
  "Hospital": {
    keywords: ["Healing", "Recovery", "Quiet", "Therapy", "Slow"],
    eventPenalty: ["Event Plaza", "Retail Walk"],
    reasons: "회복 중심 동선 구성을 위해 Healing Walk/Recovery Garden/Quiet Rest 계열을 강화하고 과도한 이벤트 성격은 축소합니다."
  },
  "Data Center": {
    keywords: ["Buffer", "Controlled", "Quiet", "Security", "Deck"],
    eventPenalty: ["Event Plaza", "Rooftop Social Garden"],
    reasons: "보안·완충 구조가 우선되는 시설 특성을 반영해 Buffer Planting, Controlled Walk, Quiet Deck 계열을 우선 배치합니다."
  },
  "Mixed-use Complex": {
    keywords: ["Event", "Retail", "Layered", "Social", "Terrace"],
    eventPenalty: [],
    reasons: "복합 프로그램의 체류와 커뮤니티 활성화를 위해 Event Plaza, Retail Walk, Layered Terrace 비중을 높입니다."
  }
};

const maintenanceAllocationBias = {
  "저관리": {
    reinforce: ["Canopy", "Buffer", "Controlled", "Linear", "Grass", "Quiet", "Deck"],
    reduce: ["Event", "Plaza", "Fountain", "Floral", "Therapy Terrace", "Social"],
    note: "저관리 기준으로 화려한 초화·이벤트 성격은 줄이고 구조적 식재·캐노피·그라스 성격을 강화했습니다."
  },
  "중관리": {
    reinforce: [],
    reduce: [],
    note: "중관리 기준의 균형형 배분으로 특정 프로그램 편중 없이 공간 경험 흐름을 유지했습니다."
  },
  "고관리": {
    reinforce: ["Signature", "Event", "Therapy Terrace", "Social", "Plaza"],
    reduce: ["Controlled Edge"],
    note: "고관리 기준으로 특화 식재·계절 초화·수경 연계 가능성이 높은 시퀀스의 비중을 일부 허용했습니다."
  }
};

function buildSpatialScenario(input, weightedConcepts) {
  const seeded = scenarioBiasByProjectType[input.projectType] || ["Arrival Plaza", "Canopy Walk", "Transition Curve Node", "Quiet Pocket Garden", "Roof Outlook Lounge"];
  const topConcepts = weightedConcepts.slice(0, 8).map((item) => item.concept);
  const fallbackSequence = ["Arrival Plaza", "Canopy Walk", "Transition Curve Node", "Quiet Pocket Garden", "Roof Outlook Lounge"];

  const pickScenario = (name, index) => {
    const meta = scenarioCatalog[name] || scenarioCatalog[fallbackSequence[index]];
    const linkedStrategies = (meta?.drivers || []).filter((driver) => topConcepts.includes(driver));
    return { name, order: index, ...meta, linkedStrategies };
  };

  let sequence = seeded.map(pickScenario);

  if (input.conditions.includes("옥상정원 포함") && sequence.length < 6) {
    sequence.push(pickScenario("Roof Outlook Lounge", sequence.length));
  }

  const uniqueSequence = [];
  const used = new Set();
  sequence.forEach((step) => {
    if (!used.has(step.name) && uniqueSequence.length < 6) {
      used.add(step.name);
      uniqueSequence.push(step);
    }
  });

  const steps = uniqueSequence.slice(0, 6);
  const flowLabel = steps.map((step) => step.phase).join(" → ");
  const zoneFlow = steps.map((step) => step.zone).join(" → ");
  return { steps, flowLabel, zoneFlow };
}

function deriveDesignTags(step = {}) {
  const base = safeArray(step?.linkedStrategies?.length ? step.linkedStrategies : step.drivers);
  const derived = [];
  const text = `${step?.name || ""} ${step?.description || ""}`.toLowerCase();
  if (text.includes("canopy") || text.includes("수관")) derived.push("canopy");
  if (text.includes("quiet") || text.includes("회복") || text.includes("healing")) derived.push("healing");
  if (text.includes("buffer") || text.includes("controlled") || text.includes("보안")) derived.push("buffer");
  if (text.includes("event") || text.includes("social") || text.includes("retail")) derived.push("community");
  return uniq(base.concat(derived));
}

function computeSpaceAllocation(input, scenario = { steps: [] }) {
  const steps = safeArray(scenario?.steps);
  if (!steps.length) return [];

  const profile = spaceAllocationProfiles[input.projectType] || { keywords: [], eventPenalty: [], reasons: "" };
  const maintenance = maintenanceAllocationBias[input.maintenance] || maintenanceAllocationBias["중관리"];

  const baseWeights = steps.map((step) => {
    const name = asText(step?.name, "");
    const text = `${name} ${asText(step?.description, "")}`;
    let score = 1;

    profile.keywords.forEach((keyword) => { if (text.includes(keyword)) score += 0.55; });
    maintenance.reinforce.forEach((keyword) => { if (text.includes(keyword)) score += 0.35; });
    maintenance.reduce.forEach((keyword) => { if (text.includes(keyword)) score -= 0.28; });
    profile.eventPenalty.forEach((keyword) => { if (text.includes(keyword)) score -= 0.22; });

    if ((step?.zone || "") === "Public") score += 0.15;
    if ((step?.phase || "") === "Transition") score += 0.12;

    const adjusted = Math.max(0.5, score);
    return { step, score: adjusted };
  });

  const total = baseWeights.reduce((sum, item) => sum + item.score, 0) || 1;

  return baseWeights.map(({ step, score }) => {
    const ratio = (score / total) * 100;
    const min = Math.max(5, Math.round(ratio - 3));
    const max = Math.min(45, Math.round(ratio + 4));
    const tags = deriveDesignTags(step);
    return {
      name: asText(step?.name, "Unnamed Space"),
      ratio,
      rangeLabel: `${min}~${max}%`,
      reason: `${profile.reasons} ${maintenance.note}`.trim(),
      tags
    };
  }).sort((a, b) => b.ratio - a.ratio);
}

async function loadJson(path, fallback) {
  try { const res = await fetch(path); if (!res.ok) throw new Error(path); return await res.json(); }
  catch { return fallback; }
}

async function loadData() {
  const [designRelationships, projectConceptMapping, plantingStrategyMapping, spatialArchetypes, designDecisionRules, strategyWeightBias, strategyCompatibility] = await Promise.all([
    loadJson("data/design_relationships.json", fallbackData.designRelationships),
    loadJson("data/project_concept_mapping.json", fallbackData.projectConceptMapping),
    loadJson("data/planting_strategy_mapping.json", fallbackData.plantingStrategyMapping),
    loadJson("data/spatial_archetypes.json", fallbackData.spatialArchetypes),
    loadJson("data/design_decision_rules.json", fallbackData.designDecisionRules),
    loadJson("data/strategy_weight_bias.json", fallbackData.strategyWeightBias),
    loadJson("data/strategy_compatibility.json", fallbackData.strategyCompatibility)
  ]);
  return { designRelationships, projectConceptMapping, plantingStrategyMapping, spatialArchetypes, designDecisionRules, strategyWeightBias, strategyCompatibility };
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
const getRelation = (matrix, source, target) => {
  const info = matrix[source] || {};
  if ((info.compatible || []).includes(target)) return "compatible";
  if ((info.conflict || []).includes(target)) return "conflict";
  return null;
};

function applyCompatibilityRefinement(weighted, matrix = {}) {
  const refinedMap = Object.fromEntries(weighted.map((item) => [item.concept, { ...item, score: item.score, reasons: [...item.reasons] }]));
  const topCandidates = weighted.slice(0, 8);
  const relationEvents = [];
  const HIGH_DOMINANCE_THRESHOLD = 85;

  const getConflictPenalty = (winner, loser) => {
    const winnerScore = refinedMap[winner].score;
    const loserScore = refinedMap[loser].score;
    let dominantPenalty = 15;
    let subordinatePenalty = 20;

    if (winnerScore >= HIGH_DOMINANCE_THRESHOLD) {
      dominantPenalty = 16;
      subordinatePenalty = 24;
    }

    if (winner === "Quiet Resort" && ["Event Plaza", "Dynamic Flow"].includes(loser)) {
      dominantPenalty = 18;
      subordinatePenalty = 30;
    }

    if (winner === "Controlled Edge" && loser === "Dynamic Flow") {
      dominantPenalty = 17;
      subordinatePenalty = 30;
    }

    if (winnerScore - loserScore >= 18) {
      dominantPenalty = Math.max(dominantPenalty, 18);
      subordinatePenalty = Math.max(subordinatePenalty, 27);
    }

    return { dominantPenalty, subordinatePenalty };
  };

  for (let i = 0; i < topCandidates.length; i += 1) {
    for (let j = i + 1; j < topCandidates.length; j += 1) {
      const a = topCandidates[i].concept;
      const b = topCandidates[j].concept;
      const relation = getRelation(matrix, a, b) || getRelation(matrix, b, a);
      if (!relation) continue;

      if (relation === "compatible") {
        const bonus = Math.max(5, Math.min(15, Math.round((refinedMap[a].score + refinedMap[b].score) / 20)));
        refinedMap[a].score += bonus;
        refinedMap[b].score += bonus;
        refinedMap[a].reasons.push(`compatibility +${bonus} (${b})`);
        refinedMap[b].reasons.push(`compatibility +${bonus} (${a})`);
        relationEvents.push({ a, b, relation, label: "High Compatibility", impact: `+${bonus}` });
      } else {
        const aWeight = refinedMap[a].score;
        const bWeight = refinedMap[b].score;
        const dominant = aWeight >= bWeight ? a : b;
        const subordinate = dominant === a ? b : a;
        const { dominantPenalty, subordinatePenalty } = getConflictPenalty(dominant, subordinate);

        refinedMap[dominant].score -= dominantPenalty;
        refinedMap[subordinate].score -= subordinatePenalty;
        refinedMap[dominant].reasons.push(`conflict -${dominantPenalty} (${subordinate})`);
        refinedMap[subordinate].reasons.push(`conflict -${subordinatePenalty} (${dominant})`);
        relationEvents.push({ a: dominant, b: subordinate, relation, label: "Conflict Detected", impact: `-${dominantPenalty}/-${subordinatePenalty}` });
      }
    }
  }

  const refined = Object.values(refinedMap)
    .map((item) => ({ ...item, score: clampScore(item.score) }))
    .sort((a, b) => b.score - a.score);
  return { refined, relationEvents };
}

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
  const eligible = weighted.filter((w) => w.score >= 45);
  let primary = eligible.filter((w) => w.score >= 85).slice(0, 2);

  if (!primary.length && eligible.length) primary = [eligible[0]];

  const primaryConcepts = new Set(primary.map((item) => item.concept));
  const secondary = eligible.filter((w) => w.score >= 65 && w.score <= 84 && !primaryConcepts.has(w.concept));
  const supporting = eligible.filter((w) => w.score >= 45 && w.score <= 64 && !primaryConcepts.has(w.concept));

  return { primary, secondary, supporting };
}

function recommend(input, db) {
  const rule = db.designDecisionRules.find((r) => r.project_type === input.projectType) || db.designDecisionRules[0];
  const weightedConcepts = computeWeights(input, db, rule);
  const compatibilityResult = applyCompatibilityRefinement(weightedConcepts, db.strategyCompatibility);
  const hierarchy = toHierarchy(compatibilityResult.refined);

  const primaryDesignLanguage = hierarchy.primary.map((v) => `${v.concept} ${v.score}`);
  const secondaryDesignLanguage = hierarchy.secondary.map((v) => `${v.concept} ${v.score}`).slice(0, 4);
  const emotionalLayer = hierarchy.supporting.map((v) => `${v.concept} ${v.score}`).slice(0, 6);

  const topConcepts = compatibilityResult.refined.filter((w) => w.score >= 50).slice(0, 8).map((w) => w.concept);
  const mappedPlanting = topConcepts.map((c) => db.plantingStrategyMapping.find((p) => p.concept === c)?.planting_strategies || []).flat();

  const archetypes = uniq((rule?.recommended_archetypes || []).concat(
    input.conditions.includes("선큰공간 포함") ? ["Layered Terrace Garden"] : [],
    input.conditions.includes("보행 연결 중요") ? ["Immersive Walk Garden"] : []
  )).slice(0, 4);

  const primaryCore = hierarchy.primary[0] || compatibilityResult.refined[0];
  const secondaryPair = hierarchy.secondary.slice(0, 2);
  const dominantSummary = `이 프로젝트는 ${primaryCore.concept} 중심 전략(${primaryCore.score})이 가장 강하게 도출되며, ${secondaryPair.map((v) => `${v.concept}(${v.score})`).join("와 ") || "보조 전략"}가 보행 흐름과 체류 경험을 보완합니다.`;
  const compatibilityHighlights = compatibilityResult.relationEvents.slice(0, 4)
    .map((event) => `${event.a} ↔ ${event.b} (${event.label})`).join(", ");
  const scenario = buildSpatialScenario(input, compatibilityResult.refined);
  const spaceAllocation = computeSpaceAllocation(input, scenario);
  const safeConditions = Array.isArray(input?.conditions) ? input.conditions : []
  const reason = `${input.projectType} + ${input.urbanContext} 맥락 + ${safeConditions.join(" + ") || "기본 오픈스페이스"} + ${input.tone} 톤 + ${input.maintenance} 유지관리 조건으로 ${primaryCore.concept}의 weight(${primaryCore.score})가 가장 높게 산정되었습니다. ${secondaryPair.map((v) => `${v.concept}(${v.score})`).join(" / ") || "Secondary 전략"}는 결절부 감속, 공공성, 미기후 전환을 보완하는 보조 전략으로 적용됩니다. Spatial Scenario는 ${scenario?.flowLabel || "기본"} 흐름으로 구성되어 Arrival-Transition-Rest-View-Exit 리듬을 기본으로 설계되었습니다. 주 보행축은 Urban Canopy 기반의 연속 수관 흐름으로 구성되며, 결절부에서는 Controlled Curve 전략을 통해 체류와 감속 경험을 유도합니다. 존 전이는 ${scenario?.zoneFlow || "Public → Semi-public → Private"}로 설정되어 Public → Semi-public → Private 경험 레이어를 명확히 합니다. Compatibility refinement 결과 ${compatibilityHighlights || "주요 전략 간 중립 관계"}가 반영되어 충돌 전략은 우선순위에서 의도적으로 감점되어 과도한 병치가 억제됩니다.`;

  return {
    primaryDesignLanguage,
    secondaryDesignLanguage,
    emotionalLayer,
    dominantSummary,
    recommendationReason: reason,
    weightedConcepts: compatibilityResult.refined,
    compatibilityAnalysis: compatibilityResult.relationEvents,
    archetypes,
    spatialScenario: scenario,
    spaceAllocation,
    plantingStrategies: {
      "캐노피 전략": uniq(mappedPlanting.filter((item) => item.includes("캐노피") || item.includes("교목"))).slice(0, 2),
      "하부 식재 전략": uniq(mappedPlanting.filter((item) => item.includes("하부") || item.includes("층위"))).slice(0, 2),
      "계절감 전략": input.maintenance === "고관리" ? ["계절 개화/단풍 연출형 초화·관목 레이어를 강화"] : ["상록·낙엽 수종 균형으로 사계절 리듬을 안정적으로 확보"],
      "유지관리 전략": input.maintenance === "저관리" ? ["내건성·저관리 수종 중심의 관수/전정 단순화"] : ["현장 관리 수준에 맞춘 단계별 관수·전정 계획을 적용"]
    }
  };
}

function renderNestedList(items) { const list = safeArray(items); return `<ul>${list.map((v) => `<li>${asText(v)}</li>`).join("")}</ul>`; }
function renderCategoryBlock(title, items) { return `<div class="sub-card"><h4>${title}</h4>${renderNestedList(items)}</div>`; }
const safeArray = (value) => Array.isArray(value) ? value.filter((v) => v !== null && v !== undefined) : [];
const asText = (value, fallback = "-") => (value === null || value === undefined || value === "") ? fallback : String(value);

function renderWeightRows(items) {
  return safeArray(items).map((item, i) => {
    const tier = item.score >= 85 ? "Primary" : item.score >= 65 ? "Secondary" : item.score >= 45 ? "Supporting" : "Low";
    return `<div class="weight-row ${tier.toLowerCase()}">
      <div class="weight-head"><strong>${i + 1}. ${item.concept}</strong><span class="score-chip">${item.score}</span></div>
      <div class="bar-track"><span class="bar-fill" style="width:${item.score}%;"></span></div>
      <p class="weight-meta">${tier} · ${safeArray(item?.reasons).slice(-2).join(" / ") || "No explicit weight rule"}</p>
    </div>`;
  }).join("");
}

function renderResult(rec) {
  const compatibilityAnalysis = safeArray(rec?.compatibilityAnalysis);
  const compatibilityRows = compatibilityAnalysis.length
    ? compatibilityAnalysis.map((item) => `<li class="compatibility-item ${asText(item?.relation, "neutral")}"><strong>${asText(item?.a)} ↔ ${asText(item?.b)}</strong> : ${asText(item?.label)} <span class="impact">${asText(item?.impact, "")}</span></li>`).join("")
    : "<li class='compatibility-item neutral'>상위 전략 간 명시적 compatibility/conflict 관계가 없습니다.</li>";

  const primaryDesignLanguage = safeArray(rec?.primaryDesignLanguage);
  const secondaryDesignLanguage = safeArray(rec?.secondaryDesignLanguage);
  const emotionalLayer = safeArray(rec?.emotionalLayer);
  const weightedConcepts = safeArray(rec?.weightedConcepts);
  const archetypes = safeArray(rec?.archetypes);
  const plantingStrategies = rec?.plantingStrategies && typeof rec.plantingStrategies === "object" ? rec.plantingStrategies : {};
  const spaceAllocation = safeArray(rec?.spaceAllocation);

  let scenarioMarkup = "";
  try {
    const scenario = rec?.spatialScenario || {};
    const steps = safeArray(scenario?.steps);
    const stepMarkup = steps.length
      ? steps.map((step, i) => {
        const linked = safeArray(step?.linkedStrategies);
        const drivers = safeArray(step?.drivers);
        const tags = (linked.length ? linked : drivers).map((strategy) => `<span class="scenario-tag">${asText(strategy)}</span>`).join("");
        return `<div class="scenario-step"><div class="scenario-index">${i + 1}</div><div><h4>${asText(step?.name, `Step ${i + 1}`)}</h4><p>${asText(step?.description, "설명이 제공되지 않았습니다.")}</p><p class="scenario-meta">Flow: ${asText(step?.phase)} · Zone: ${asText(step?.zone)}</p><div class="scenario-tags">${tags}</div></div></div>`;
      }).join("")
      : "<p class='scenario-empty'>Spatial Scenario 데이터가 없습니다.</p>";

    scenarioMarkup = `<article class="result-card full-width"><h3>10. Spatial Experience Scenario</h3><div class="scenario-timeline">${stepMarkup}</div><p class="scenario-flow">Flow Sequence: ${asText(scenario?.flowLabel, "-")}</p><p class="scenario-flow">Zone Sequence: ${asText(scenario?.zoneFlow, "-")}</p></article>`;
  } catch (error) {
    console.error("Spatial Scenario render error:", error);
    scenarioMarkup = "<article class='result-card full-width'><h3>10. Spatial Experience Scenario</h3><p class='scenario-empty'>Spatial Scenario를 렌더링하는 중 오류가 발생했습니다. 다른 추천 결과는 계속 표시됩니다.</p></article>";
  }

  const resultNode = document.getElementById("result");
  if (!resultNode) return;

  resultNode.innerHTML = `
    <div class="result-grid">
      <article class="result-card full-width summary-card"><h3>1. Dominant Strategy Summary</h3><p>${asText(rec?.dominantSummary, "요약 정보가 없습니다.")}</p></article>
      <article class="result-card primary-card"><h3>2. Primary Design Language</h3><div class="primary-items">${primaryDesignLanguage.map((item) => `<span class="primary-pill">${asText(item)}</span>`).join("") || "<span class='primary-pill'>No primary available</span>"}</div></article>
      <article class="result-card secondary-card"><h3>3. Secondary Design Language</h3><div class="secondary-items">${secondaryDesignLanguage.map((item) => `<span class="secondary-pill">${asText(item)}</span>`).join("") || "<span class='secondary-pill'>No secondary</span>"}</div></article>
      <article class="result-card emotion-card"><h3>4. Supporting Emotional Layer</h3><div class="emotion-tags">${emotionalLayer.map((item) => `<span class="emotion-tag">${asText(item)}</span>`).join("") || "<span class='emotion-tag'>No supporting layer</span>"}</div></article>
      <article class="result-card full-width"><h3>5. Strategy Weight Inference</h3>${renderWeightRows(weightedConcepts.filter((w) => (w?.score || 0) >= 45).slice(0, 12))}</article>
      <article class="result-card full-width"><h3>6. Strategy Compatibility Analysis</h3><ul class="compatibility-list">${compatibilityRows}</ul></article>
      <article class="result-card full-width"><h3>7. Recommendation Reason</h3><p>${asText(rec?.recommendationReason, "추천 이유 정보가 없습니다.")}</p></article>
      <article class="result-card full-width"><h3>8. Recommended Spatial Archetypes</h3>${renderNestedList(archetypes)}</article>
      <article class="result-card full-width"><h3>9. Recommended Planting Strategy</h3><div class="nested-grid">${Object.entries(plantingStrategies).map(([title, items]) => renderCategoryBlock(title, safeArray(items))).join("")}</div></article>
      ${scenarioMarkup}
      <article class="result-card full-width"><h3>11. Space Allocation Strategy</h3><p class="card-caption">Spatial Experience Scenario 기반 기본계획 수준 공간 비중 제안</p>
      <div class="allocation-grid">${spaceAllocation.map((item) => `
        <div class="allocation-card">
          <div class="allocation-head"><strong>${asText(item?.name)}</strong><span class="allocation-range">${asText(item?.rangeLabel)}</span></div>
          <div class="bar-track allocation-track"><span class="bar-fill allocation-fill" style="width:${Math.max(8, Math.round(item?.ratio || 0))}%;"></span></div>
          <p class="allocation-reason">${asText(item?.reason)}</p>
          <div class="scenario-tags">${safeArray(item?.tags).map((tag) => `<span class="scenario-tag">${asText(tag)}</span>`).join("")}</div>
        </div>`).join("") || "<p>할당 데이터가 없습니다.</p>"}</div></article>
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
