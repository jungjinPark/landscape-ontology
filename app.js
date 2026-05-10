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

const layoutArchetypeCatalog = {
  "Axis Campus Layout": {
    description: "명확한 중심축과 상징적 진입 시퀀스를 기반으로 공공-준공공-사적 영역을 단계적으로 조직하는 배치 구조.",
    tags: ["axis", "symbolic-entry", "spine", "ceremonial-sequence"]
  },
  "Loop Garden Layout": {
    description: "순환형 보행 루프를 통해 회복·산책 경험을 반복적으로 제공하는 저속 순환형 조직 구조.",
    tags: ["loop", "healing-walk", "slow-circulation", "repetitive-recovery"]
  },
  "Clustered Courtyard Layout": {
    description: "다수의 중정/포켓 공간을 군집화하여 분산 체류와 미세한 프로그램 전이를 만드는 조직 구조.",
    tags: ["cluster", "courtyard", "distributed-rest", "micro-zoning"]
  },
  "Linear Forest Spine": {
    description: "선형 녹지 spine을 중심으로 이동성과 방향성을 극대화하는 고명료 보행 조직 구조.",
    tags: ["linear", "forest-spine", "wayfinding", "main-circulation"]
  },
  "Distributed Pocket Garden": {
    description: "작은 휴게 공간을 분산 배치해 자극을 낮추고 짧은 회복 접점을 자주 제공하는 조직 구조.",
    tags: ["distributed", "pocket-garden", "low-stimulus", "decentralized-rest"]
  },
  "Terrace Layered Layout": {
    description: "레벨 차를 활용해 테라스형 활동 레이어를 수평·수직으로 연결하는 다층 조직 구조.",
    tags: ["terrace", "layered", "multi-level", "sectional-experience"]
  },
  "Central Commons Layout": {
    description: "중앙 커먼즈를 중심 결절로 두고 주변 프로그램이 방사형/결절형으로 연계되는 조직 구조.",
    tags: ["central-node", "commons", "event-core", "public-interface"]
  }
};

const projectLayoutRules = {
  "Office Headquarters": {
    priorities: ["Axis Campus Layout", "Linear Forest Spine", "Central Commons Layout"],
    guidance: "축형 + 상징적 진입 구조를 강화하고 메인 보행 spine의 방향성과 대표성을 우선합니다."
  },
  "Hospital": {
    priorities: ["Loop Garden Layout", "Distributed Pocket Garden", "Clustered Courtyard Layout"],
    guidance: "순환형 healing walk를 강화하고 저자극 분산형 휴게 구조를 우선 구성합니다."
  },
  "Data Center": {
    priorities: ["Linear Forest Spine", "Clustered Courtyard Layout", "Axis Campus Layout"],
    guidance: "보안 buffer + controlled circulation을 강화하며 단순·명확한 circulation 체계를 우선합니다."
  },
  "Mixed-use Complex": {
    priorities: ["Central Commons Layout", "Terrace Layered Layout", "Clustered Courtyard Layout"],
    guidance: "다중 결절 + 이벤트 중심 구조를 강화하고 공개공지 연계를 적극적으로 확보합니다."
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

function deriveLayoutLogic(input, scenario = { steps: [] }) {
  const steps = safeArray(scenario?.steps);
  const names = steps.map((step) => asText(step?.name, ""));
  const sequence = names.join(" → ");
  const profile = projectLayoutRules[input.projectType] || { priorities: [], guidance: "" };

  const scoreMap = {};
  Object.keys(layoutArchetypeCatalog).forEach((name) => { scoreMap[name] = 0; });

  const addScore = (layout, score) => { if (scoreMap[layout] !== undefined) scoreMap[layout] += score; };

  profile.priorities.forEach((layout, index) => addScore(layout, 48 - (index * 8)));
  names.forEach((name) => {
    if (name.includes("Arrival") || name.includes("Signature")) addScore("Axis Campus Layout", 16);
    if (name.includes("Linear") || name.includes("Walk") || name.includes("Spine")) addScore("Linear Forest Spine", 14);
    if (name.includes("Healing") || name.includes("Slow")) addScore("Loop Garden Layout", 15);
    if (name.includes("Quiet") || name.includes("Recovery") || name.includes("Pocket")) addScore("Distributed Pocket Garden", 13);
    if (name.includes("Courtyard")) addScore("Clustered Courtyard Layout", 14);
    if (name.includes("Terrace") || name.includes("Roof")) addScore("Terrace Layered Layout", 13);
    if (name.includes("Event") || name.includes("Retail") || name.includes("Social") || name.includes("Node")) addScore("Central Commons Layout", 14);
  });

  if (input.projectType === "Data Center") {
    addScore("Linear Forest Spine", 10);
    addScore("Axis Campus Layout", 6);
  }

  const topLayouts = Object.entries(scoreMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([layout, score]) => ({ layout, score }));

  const cards = topLayouts.map(({ layout, score }) => {
    const meta = layoutArchetypeCatalog[layout];
    return {
      name: layout,
      description: meta.description,
      reason: `${profile.guidance} Spatial sequence "${sequence}"에서 파생된 동선/결절 패턴을 반영해 ${layout}의 적합도(${score})가 높게 계산되었습니다.`,
      sequence,
      tags: meta.tags
    };
  });

  return {
    cards,
    diagram: sequence || "Arrival → Transition Spine → Central Node → Quiet Garden"
  };
}

function buildBubbleDiagramEngine(scenario = { steps: [] }, allocation = [], layoutLogic = { cards: [] }) {
  const steps = safeArray(scenario?.steps);
  const allocationMap = new Map(safeArray(allocation).map((item) => [asText(item?.name, ""), item]));
  const primaryLayout = asText(layoutLogic?.cards?.[0]?.name, "Axis Campus Layout");

  const zoneRank = { "Public": 1, "Semi-public": 2, "Private": 3 };
  const grouped = { "Public": [], "Semi-public": [], "Private": [] };

  const bubbles = steps.map((step, index) => {
    const name = asText(step?.name, `Space ${index + 1}`);
    const linked = allocationMap.get(name) || {};
    const ratio = Number(linked?.ratio || 0);
    const level = ratio >= 24 ? "xl" : ratio >= 19 ? "lg" : ratio >= 14 ? "md" : "sm";
    const role = (
      (step?.phase === "Arrival" && "진입") ||
      (step?.phase === "Transition" && "이동") ||
      (name.includes("Node") && "결절") ||
      (step?.phase === "Rest" && "체류") ||
      (step?.phase === "View" && "조망") ||
      (name.includes("Buffer") && "완충") || "체류"
    );
    const bubble = { name, zone: asText(step?.zone, "Semi-public"), role, ratio, level, order: index + 1 };
    if (!grouped[bubble.zone]) grouped[bubble.zone] = [];
    grouped[bubble.zone].push(bubble);
    return bubble;
  });

  const byZone = Object.entries(grouped)
    .filter(([, list]) => list.length)
    .sort((a, b) => (zoneRank[a[0]] || 99) - (zoneRank[b[0]] || 99))
    .map(([zone, list]) => ({ zone, items: list.sort((x, y) => x.order - y.order) }));

  const flow = bubbles.map((b) => b.name).join(" → ");
  const layoutTone = {
    "Axis Campus Layout": "axis",
    "Loop Garden Layout": "loop",
    "Clustered Courtyard Layout": "cluster",
    "Linear Forest Spine": "linear"
  }[primaryLayout] || "axis";

  const hierarchy = [...bubbles].sort((a, b) => b.ratio - a.ratio).slice(0, 3);
  return { primaryLayout, layoutTone, byZone, bubbles, flow, hierarchy };
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


function applySiteInputAdjustments(weightedConcepts, input) {
  const adjusted = weightedConcepts.map((w) => ({ ...w, reasons: [...safeArray(w.reasons)] }));
  const add = (concept, delta, reason) => {
    const t = adjusted.find((x) => x.concept === concept);
    if (!t) return;
    t.score = clampScore(t.score + delta);
    t.reasons.push(reason);
  };

  const vf = safeArray(input.vehicleFlow);
  const pf = safeArray(input.pedestrianFlow);
  const bp = asText(input.buildingPlacement, "");

  if (vf.length >= 3) {
    add("Controlled Curve", 6, "site input: strong vehicle circulation");
    add("Spatial Relief", 5, "site input: strong vehicle circulation");
  }
  if (vf.includes("소방차 동선 중요")) {
    add("Controlled Edge", 7, "site input: fire truck route priority");
    add("Spatial Buffer", 7, "site input: fire truck route priority");
    add("Controlled Curve", 5, "site input: emergency turning radius");
  }
  if (bp === "중정형 배치") {
    add("Quiet Resort", 8, "site input: courtyard building type");
    add("Healing Flow", 6, "site input: courtyard building type");
  }
  if (bp === "분동형 배치") {
    add("Linear Forest", 7, "site input: fragmented masses");
    add("Urban Canopy", 5, "site input: fragmented masses");
  }
  if (vf.includes("전면 drop-off")) {
    add("Signature Plaza", 7, "site input: front drop-off arrival emphasis");
    add("Event Plaza", 4, "site input: front drop-off arrival emphasis");
  }
  if (vf.includes("보차분리 중요")) {
    add("Spatial Relief", 7, "site input: pedestrian-vehicle segregation");
    add("Linear Forest", 5, "site input: pedestrian spine reinforcement");
  }
  if (pf.includes("공개공지 연결 중요")) {
    add("Signature Plaza", 8, "site input: public plaza linkage");
    add("Urban Canopy", 6, "site input: public plaza linkage");
  }
  if (pf.includes("옥상/피로티 연결 필요")) {
    add("Layered Experience", 8, "site input: roof/piloti link");
    add("Framed Nature", 5, "site input: roof/piloti link");
  }

  return adjusted.sort((a, b) => b.score - a.score);
}

function buildSiteAnalysisSummary(input, topConcepts) {
  const area = Number(input.siteArea || 0);
  const sizeText = area >= 50000 ? "대규모" : area >= 15000 ? "중대규모" : area > 0 ? "중소규모" : "면적 미입력";
  const placement = asText(input.buildingPlacement, "배치 정보 미입력");
  const vehicle = safeArray(input.vehicleFlow);
  const walk = safeArray(input.pedestrianFlow);
  const vehicleIntensity = vehicle.length >= 4 ? "차량동선 제약이 강한 편" : vehicle.length >= 2 ? "차량동선 제약이 중간 수준" : "차량동선 제약이 비교적 약한 편";

  return {
    scale: `${sizeText} 대상지로 해석되며 ${area ? `${area.toLocaleString()}㎡` : "정량 면적 정보는 보완 필요"} 기준으로 외부공간 밀도 조정이 필요합니다.`,
    placement: `${placement} 조건에서 포켓/중정/축형 오픈스페이스 조합 가능성을 우선 검토합니다.`,
    constraint: `${vehicleIntensity}으로 보행 및 휴게공간은 보차 분리, 완충녹지, 감속 결절 중심으로 계획합니다.`,
    pedestrian: `${walk.join(", ") || "보행축 우선순위 미입력"}를 반영하여 주출입-공개공지-상부 연결축의 연속성을 강화합니다.`,
    strategy: `추천 전략 방향은 ${safeArray(topConcepts).slice(0, 4).join(" / ")} 중심으로 설정됩니다.`
  };
}

function recommend(input, db) {
  const rule = db.designDecisionRules.find((r) => r.project_type === input.projectType) || db.designDecisionRules[0];
  const weightedConcepts = applySiteInputAdjustments(computeWeights(input, db, rule), input);
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
  const layoutLogic = deriveLayoutLogic(input, scenario);
  const bubbleDiagram = buildBubbleDiagramEngine(scenario, spaceAllocation, layoutLogic);
  const safeConditions = Array.isArray(input?.conditions) ? input.conditions : []
  const reason = `${input.projectType} + ${input.urbanContext} 맥락 + ${safeConditions.join(" + ") || "기본 오픈스페이스"} + ${input.tone} 톤 + ${input.maintenance} 유지관리 조건으로 ${primaryCore.concept}의 weight(${primaryCore.score})가 가장 높게 산정되었습니다. ${secondaryPair.map((v) => `${v.concept}(${v.score})`).join(" / ") || "Secondary 전략"}는 결절부 감속, 공공성, 미기후 전환을 보완하는 보조 전략으로 적용됩니다. Site Input(배치:${asText(input.buildingPlacement,"-")}, 차량:${safeArray(input.vehicleFlow).length}개, 보행:${safeArray(input.pedestrianFlow).length}개)이 전략 가중치에 반영되었습니다. Spatial Scenario는 ${scenario?.flowLabel || "기본"} 흐름으로 구성되어 Arrival-Transition-Rest-View-Exit 리듬을 기본으로 설계되었습니다. 주 보행축은 Urban Canopy 기반의 연속 수관 흐름으로 구성되며, 결절부에서는 Controlled Curve 전략을 통해 체류와 감속 경험을 유도합니다. 존 전이는 ${scenario?.zoneFlow || "Public → Semi-public → Private"}로 설정되어 Public → Semi-public → Private 경험 레이어를 명확히 합니다. Compatibility refinement 결과 ${compatibilityHighlights || "주요 전략 간 중립 관계"}가 반영되어 충돌 전략은 우선순위에서 의도적으로 감점되어 과도한 병치가 억제됩니다.`;

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
    layoutLogic,
    bubbleDiagram,
    siteAnalysisSummary: buildSiteAnalysisSummary(input, compatibilityResult.refined.map((v) => v.concept)),
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


function renderBubbleSvg(bubbleSequence = [], layoutTone = "axis") {
  const items = safeArray(bubbleSequence);
  if (!items.length) return "<p>Bubble diagram 데이터가 없습니다.</p>";

  const width = 940;
  const height = 420;
  const zoneY = { "Public": 96, "Semi-public": 210, "Private": 324 };
  const zoneClass = { "Public": "public", "Semi-public": "semi", "Private": "private" };
  const layoutOffsets = {
    axis: [0, 0, 0, 0, 0, 0],
    linear: [0, 0, 0, 0, 0, 0],
    loop: [0, 34, -34, 30, -30, 0],
    cluster: [-44, 44, -32, 32, -20, 20]
  };
  const baseSpacing = items.length > 1 ? (width - 180) / (items.length - 1) : 0;
  const offsets = layoutOffsets[layoutTone] || layoutOffsets.axis;
  const points = items.map((item, i) => {
    const cx = 90 + (baseSpacing * i);
    const cy = (zoneY[item.zone] || 210) + (offsets[i] || 0);
    const ratio = Math.max(8, Math.round(item.ratio || 10));
    const radius = 25 + (ratio * 0.65);
    return { ...item, cx, cy, radius, zoneType: zoneClass[item.zone] || "semi" };
  });

  const links = points.slice(0, -1).map((p, i) => {
    const next = points[i + 1];
    return `<line x1="${p.cx + p.radius - 3}" y1="${p.cy}" x2="${next.cx - next.radius + 3}" y2="${next.cy}" class="bubble-link" marker-end="url(#flowArrow)" />`;
  }).join("");

  const bubbles = points.map((p, i) => {
    const dominant = p.level === "xl" || p.level === "lg" ? " dominant" : "";
    return `<g class="bubble-node ${p.zoneType}${dominant}" transform="translate(${p.cx},${p.cy})">
      <circle r="${p.radius}" />
      <text class="bubble-index" y="-${p.radius + 10}">${i + 1}</text>
      <text class="bubble-name" y="2">${asText(p.name)}</text>
      <text class="bubble-ratio-label" y="18">${Math.round(p.ratio || 0)}%</text>
    </g>`;
  }).join("");

  return `<svg class="bubble-diagram-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Bubble diagram rendering">
    <defs>
      <marker id="flowArrow" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
        <path d="M0,0 L10,4 L0,8 Z" fill="#486d5a"></path>
      </marker>
    </defs>
    <g class="zone-bands">
      <rect x="0" y="50" width="${width}" height="92" class="zone-band public" />
      <rect x="0" y="164" width="${width}" height="92" class="zone-band semi" />
      <rect x="0" y="278" width="${width}" height="92" class="zone-band private" />
    </g>
    <g class="zone-labels">
      <text x="16" y="72">PUBLIC</text>
      <text x="16" y="186">SEMI-PUBLIC</text>
      <text x="16" y="300">PRIVATE</text>
    </g>
    <g class="bubble-links">${links}</g>
    <g class="bubble-nodes">${bubbles}</g>
  </svg>`;
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
  const layoutLogicCards = safeArray(rec?.layoutLogic?.cards);
  const layoutDiagram = asText(rec?.layoutLogic?.diagram, "-");
  const bubbleDiagram = rec?.bubbleDiagram || {};
  const bubbleZones = safeArray(bubbleDiagram?.byZone);
  const bubbleSequence = safeArray(bubbleDiagram?.bubbles);

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

    scenarioMarkup = `<article class="result-card full-width"><h3>11. Spatial Experience Scenario</h3><div class="scenario-timeline">${stepMarkup}</div><p class="scenario-flow">Flow Sequence: ${asText(scenario?.flowLabel, "-")}</p><p class="scenario-flow">Zone Sequence: ${asText(scenario?.zoneFlow, "-")}</p></article>`;
  } catch (error) {
    console.error("Spatial Scenario render error:", error);
    scenarioMarkup = "<article class='result-card full-width'><h3>11. Spatial Experience Scenario</h3><p class='scenario-empty'>Spatial Scenario를 렌더링하는 중 오류가 발생했습니다. 다른 추천 결과는 계속 표시됩니다.</p></article>";
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
      <article class="result-card full-width"><h3>9. Site Analysis Summary</h3><div class="nested-grid"><div class="sub-card"><h4>대상지 규모 해석</h4><p>${asText(rec?.siteAnalysisSummary?.scale)}</p></div><div class="sub-card"><h4>건축물 배치 가능성</h4><p>${asText(rec?.siteAnalysisSummary?.placement)}</p></div><div class="sub-card"><h4>차량동선 제약</h4><p>${asText(rec?.siteAnalysisSummary?.constraint)}</p></div><div class="sub-card"><h4>보행축/공개공지 가능성</h4><p>${asText(rec?.siteAnalysisSummary?.pedestrian)}</p></div><div class="sub-card"><h4>추천 전략 방향</h4><p>${asText(rec?.siteAnalysisSummary?.strategy)}</p></div></div></article>
      <article class="result-card full-width"><h3>10. Recommended Planting Strategy</h3><div class="nested-grid">${Object.entries(plantingStrategies).map(([title, items]) => renderCategoryBlock(title, safeArray(items))).join("")}</div></article>
      ${scenarioMarkup}
      <article class="result-card full-width"><h3>12. Space Allocation Strategy</h3><p class="card-caption">Spatial Experience Scenario 기반 기본계획 수준 공간 비중 제안</p>
      <div class="allocation-grid">${spaceAllocation.map((item) => `
        <div class="allocation-card">
          <div class="allocation-head"><strong>${asText(item?.name)}</strong><span class="allocation-range">${asText(item?.rangeLabel)}</span></div>
          <div class="bar-track allocation-track"><span class="bar-fill allocation-fill" style="width:${Math.max(8, Math.round(item?.ratio || 0))}%;"></span></div>
          <p class="allocation-reason">${asText(item?.reason)}</p>
          <div class="scenario-tags">${safeArray(item?.tags).map((tag) => `<span class="scenario-tag">${asText(tag)}</span>`).join("")}</div>
        </div>`).join("") || "<p>할당 데이터가 없습니다.</p>"}</div></article>
      <article class="result-card full-width"><h3>13. Layout Logic Strategy</h3><p class="card-caption">Spatial Scenario + Space Allocation 결과를 기반으로 공간 조직 체계를 제안합니다.</p>
      <p class="layout-diagram">Flow Diagram: <strong>${layoutDiagram}</strong></p>
      <div class="layout-grid">${layoutLogicCards.map((item) => `
        <div class="layout-card">
          <h4>${asText(item?.name)}</h4>
          <p>${asText(item?.description)}</p>
          <p class="layout-reason"><strong>추천 이유:</strong> ${asText(item?.reason)}</p>
          <p class="layout-sequence"><strong>연결 Spatial Sequence:</strong> ${asText(item?.sequence)}</p>
          <div class="scenario-tags">${safeArray(item?.tags).map((tag) => `<span class="scenario-tag">${asText(tag)}</span>`).join("")}</div>
        </div>`).join("") || "<p>추천 가능한 layout logic 결과가 없습니다.</p>"}</div></article>
      <article class="result-card full-width bubble-board ${asText(bubbleDiagram?.layoutTone, "axis")}"><h3>14. Bubble Diagram Structure</h3>
      <p class="card-caption">SVG 기반 bubble node + connection line + circulation flow + hierarchy + public/private zoning 시각화.</p>
      <p class="bubble-flow"><strong>${asText(bubbleDiagram?.primaryLayout, "-")}</strong> · ${asText(bubbleDiagram?.flow, "-")}</p>
      <div class="bubble-svg-wrap">${renderBubbleSvg(bubbleSequence, asText(bubbleDiagram?.layoutTone, "axis"))}</div>
      <div class="bubble-spine">Spatial Flow: Arrival ↓ Walk Spine ↓ Central Node ↓ Quiet Garden</div>
      <div class="bubble-hierarchy">
        <h4>Hierarchy (Dominant Bubbles)</h4>
        <div class="hierarchy-row">${safeArray(bubbleDiagram?.hierarchy).map((item, idx) => `
          <div class="hierarchy-node">${idx + 1}. ${asText(item?.name)} <span>${Math.round(item?.ratio || 0)}%</span></div>
        `).join("") || "<span>-</span>"}</div>
      </div>
      <div class="bubble-zones">${bubbleZones.map((zone) => `<section class="bubble-zone"><h4>[ ${asText(zone?.zone).toUpperCase()} ]</h4><p>${safeArray(zone?.items).map((item) => `${asText(item?.name)} (${Math.round(item?.ratio || 0)}%)`).join(" · ")}</p></section>`).join("")}</div></article>
    </div>`;
}

(async function init() {
  const status = document.getElementById("status");
  const db = await loadData();
  status.textContent = "데이터 로딩 완료. Weight 기반 추론 시스템 활성화.";
  document.getElementById("strategy-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = {
      projectName: document.getElementById("projectName").value,
      siteAddress: document.getElementById("siteAddress").value,
      siteArea: document.getElementById("siteArea").value,
      projectType: document.getElementById("projectType").value,
      buildingPlacement: document.querySelector("input[name=\"buildingPlacement\"]:checked")?.value || "",
      vehicleFlow: [...document.querySelectorAll("#vehicleFlow input:checked")].map((i) => i.value),
      pedestrianFlow: [...document.querySelectorAll("#pedestrianFlow input:checked")].map((i) => i.value),
      urbanContext: document.getElementById("urbanContext").value,
      tone: document.getElementById("tone").value,
      maintenance: document.getElementById("maintenance").value,
      conditions: [...document.querySelectorAll("#conditions input:checked")].map((i) => i.value)
    };
    renderResult(recommend(input, db));
  });
  document.getElementById("sitePlanImage").addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    const preview = document.getElementById("sitePlanPreview");
    if (!preview) return;
    if (!file) { preview.textContent = "이미지를 업로드하면 이곳에 브라우저 미리보기가 표시됩니다."; return; }
    const ok = ["image/png", "image/jpeg", "image/jpg"].includes(file.type);
    if (!ok) { preview.textContent = "PNG/JPG/JPEG 파일만 지원됩니다."; return; }
    const reader = new FileReader();
    reader.onload = () => { preview.innerHTML = `<img src="${reader.result}" alt="평면도 미리보기" />`; };
    reader.readAsDataURL(file);
  });
  renderResult(recommend({ projectName: "샘플 프로젝트", siteAddress: "서울", siteArea: 24000, projectType: "Office Headquarters", buildingPlacement: "중앙배치", vehicleFlow:["전면 drop-off"], pedestrianFlow:["주출입구 연결 중요"], urbanContext: "도심형", tone: "Quiet Resort", maintenance: "중관리", conditions: ["보행 연결 중요", "공개공지 포함"] }, db));
})();
