// YesNo API Worker — Cloudflare Workers
// Claude API key stored as secret: ANTHROPIC_API_KEY

const STORIES = [
  {
    id: "water-glass",
    title: "물 한 잔의 감사",
    emoji: "🔮",
    difficulty: 1,
    situation: "한 남자가 식당에 들어가 물 한 잔을 주문했다. 웨이터가 갑자기 총을 꺼내 남자에게 겨눴다. 남자는 \"감사합니다\"라고 말하고 식당을 나갔다.",
    answer: "남자는 딸꾹질이 멈추지 않아 괴로웠다. 물을 마시려 했지만, 웨이터가 총으로 깜짝 놀라게 해줘서 딸꾹질이 멈췄다. 그래서 감사하다고 한 것이다.",
    keywords: ["딸꾹질", "놀라", "깜짝"]
  },
  {
    id: "funeral-woman",
    title: "장례식의 여자",
    emoji: "💀",
    difficulty: 2,
    situation: "어떤 여자가 남편의 장례식에서 한 남자를 보고 첫눈에 반했다. 그 남자의 연락처도, 이름도 모른다. 일주일 후 여자는 자기 언니를 죽였다.",
    answer: "여자는 그 남자를 다시 만나고 싶었다. 장례식에서 만났으니, 또 장례식이 열리면 그 남자가 올 것이라고 생각했다. 그래서 언니를 죽여 장례식을 만들었다.",
    keywords: ["다시 만나", "장례식", "또"]
  },
  {
    id: "elevator-man",
    title: "8층의 남자",
    emoji: "🏢",
    difficulty: 1,
    situation: "12층에 사는 한 남자는 매일 아침 엘리베이터를 타고 1층으로 내려간다. 하지만 퇴근 후 올라올 때는 8층에서 내려서 계단으로 올라간다. 비 오는 날만 12층까지 엘리베이터를 탄다.",
    answer: "남자는 키가 매우 작아서 엘리베이터 버튼 8층까지만 손이 닿는다. 비 오는 날에는 우산을 가지고 있어서 우산으로 12층 버튼을 누를 수 있다.",
    keywords: ["키", "작", "손이 닿", "우산", "버튼"]
  },
  {
    id: "betrayal-room",
    title: "배신의 방",
    emoji: "🩸",
    difficulty: 3,
    situation: "세 사람이 밀폐된 방에 갇혔다. 탈출하려면 누군가 희생해야 한다. 눈이 보이지 않는 한 남자가 양쪽 팔을 잘라 모두를 살렸다. 탈출 후, 그 남자는 나머지 두 사람을 죽였다.",
    answer: "실제로는 세 사람 모두 양쪽 팔을 잘라야 탈출할 수 있었다. 하지만 눈이 보이지 않는 남자만 팔을 잘랐고, 나머지 두 사람은 아픈 척만 했다. 눈먼 남자는 볼 수 없어서 속은 것이다. 탈출 후 진실을 알게 된 남자는 배신감에 두 사람을 죽였다.",
    keywords: ["속", "눈", "볼 수 없", "아픈 척", "거짓", "배신"]
  },
  {
    id: "desert-body",
    title: "사막의 시체",
    emoji: "🏜️",
    difficulty: 2,
    situation: "사막 한가운데서 알몸의 시체가 발견되었다. 손에는 부러진 성냥개비 하나를 꼭 쥐고 있었다.",
    answer: "여러 명이 열기구를 타고 가다 추락 위기에 처했다. 무게를 줄이기 위해 짐을 다 버리고, 옷도 벗었지만 부족했다. 결국 한 명이 뛰어내려야 했고, 성냥 뽑기로 결정했다. 짧은 성냥을 뽑은 이 남자가 뛰어내린 것이다.",
    keywords: ["열기구", "뽑기", "짧은", "뛰어내", "추락", "무게"]
  },
  {
    id: "music-death",
    title: "음악이 멈추자",
    emoji: "🎵",
    difficulty: 2,
    situation: "음악이 멈추자, 여자는 죽었다.",
    answer: "여자는 서커스 줄타기 곡예사였다. 눈을 가리고 줄 위를 걸으며, 음악이 끝나는 것이 줄 끝에 도착했다는 신호였다. 그런데 음악이 예정보다 일찍 멈추는 바람에, 아직 줄 위에 있는데 도착한 줄 알고 발을 내딛어 추락해 죽었다.",
    keywords: ["서커스", "줄타기", "곡예", "눈가리", "추락", "신호"]
  },
  {
    id: "call-and-death",
    title: "전화벨 소리",
    emoji: "📞",
    difficulty: 2,
    situation: "남자가 어떤 집에 전화를 걸었다. 벨이 몇 번 울리다 끊어졌다. 남자는 만족스러운 표정으로 잠자리에 들었다.",
    answer: "남자는 옆집 사람의 코골이 때문에 잠을 못 자고 있었다. 전화를 걸어 코골이를 하는 이웃을 깨운 것이다. 이웃이 전화를 받으러 일어나면 코골이가 멈추니까, 그 사이에 잠들려는 것이다.",
    keywords: ["코골이", "이웃", "옆집", "깨우", "잠"]
  },
  {
    id: "poison-ice",
    title: "같은 음료, 다른 운명",
    emoji: "🥤",
    difficulty: 1,
    situation: "두 사람이 같은 음료를 주문했다. 한 사람은 빨리 마시고 살았고, 다른 사람은 천천히 마시다 죽었다.",
    answer: "독은 얼음에 들어있었다. 빨리 마신 사람은 얼음이 녹기 전에 다 마셔서 독을 먹지 않았다. 천천히 마신 사람은 얼음이 녹으면서 독이 음료에 퍼져 죽었다.",
    keywords: ["얼음", "녹", "독"]
  },
  {
    id: "arm-surgeon",
    title: "수술을 거부한 의사",
    emoji: "🏥",
    difficulty: 1,
    situation: "한 아이가 교통사고를 당해 응급실에 실려왔다. 담당 외과의사가 아이를 보더니 \"이 아이는 내 아들이다! 수술할 수 없다!\"고 했다. 하지만 아이의 아버지는 사고 현장에서 이미 사망했다.",
    answer: "담당 외과의사는 아이의 어머니다.",
    keywords: ["어머니", "엄마", "여자", "여의사"]
  },
  {
    id: "cabin-bodies",
    title: "산장의 비극",
    emoji: "🏔️",
    difficulty: 2,
    situation: "깊은 산속 오두막에서 50명의 시체가 발견되었다. 외부 침입 흔적은 없었고, 문과 창문은 모두 잠겨 있었다.",
    answer: "비행기가 산에 추락한 것이다. 오두막이 아니라 비행기 동체(cabin)를 산장으로 착각한 것이다. 50명은 승객이었다.",
    keywords: ["비행기", "추락", "승객", "동체", "cabin"]
  },
  {
    id: "meat-restaurant",
    title: "바다거북 수프",
    emoji: "🐢",
    difficulty: 2,
    situation: "한 남자가 식당에서 바다거북 수프를 주문했다. 한 입 먹더니 밖으로 나가 권총으로 자살했다.",
    answer: "남자는 과거에 조난당해 무인도에 표류한 적이 있다. 당시 동료가 '바다거북 수프'라며 고기를 줬고 그걸 먹고 살아남았다. 하지만 식당에서 진짜 바다거북 수프를 먹어보니 맛이 전혀 달랐다. 그제야 당시 먹은 것이 바다거북이 아니라 먼저 죽은 동료의 인육이었다는 것을 깨달은 것이다.",
    keywords: ["조난", "무인도", "인육", "동료", "표류", "고기"]
  },
  {
    id: "window-death",
    title: "열린 창문",
    emoji: "🪟",
    difficulty: 2,
    situation: "바람이 불어 창문이 열렸다. 그로 인해 한 여자가 죽었다.",
    answer: "여자는 잠수함 안에 있었다. 창문(해치)이 열리면서 바닷물이 들어와 익사한 것이다.",
    keywords: ["잠수함", "바닷물", "해치", "익사", "바다"]
  },
  {
    id: "newspaper-death",
    title: "신문을 읽는 남자",
    emoji: "📰",
    difficulty: 3,
    situation: "한 남자가 아침에 신문을 읽다가 자신의 사진이 실린 것을 보고 자살했다.",
    answer: "남자는 원래 쌍둥이 형제와 함께 살인 누명을 쓴 사람이다. 둘 중 한 명만 사형이 집행되면 되는 상황이었는데, 신문에 자기 형제의 사형 집행 기사와 사진이 실렸다. 하지만 그 사진이 자기 사진(쌍둥이라 똑같이 생김)인 줄 알고, 자기가 사형당할 차례라고 착각해 자살한 것이다.",
    keywords: ["쌍둥이", "사형", "형제", "누명", "착각"]
  },
  {
    id: "bell-ring",
    title: "종소리",
    emoji: "🔔",
    difficulty: 1,
    situation: "한 남자가 매일 아침 알람 소리에 일어나 출근한다. 어느 날 알람이 울리지 않았고, 사람들이 죽었다.",
    answer: "남자는 등대지기였다. 알람에 일어나 등대 불을 켜야 했는데, 알람이 울리지 않아 잠들어 있었고 등대 불이 꺼진 사이 배가 암초에 부딪혀 사람들이 죽었다.",
    keywords: ["등대", "등대지기", "배", "암초", "불"]
  },
  {
    id: "hotel-jump",
    title: "호텔의 투숙객",
    emoji: "🏨",
    difficulty: 3,
    situation: "한 남자가 호텔에 체크인했다. 방에 들어가 잠들었다가 한밤중에 갑자기 일어나 창문을 열고 뛰어내렸다.",
    answer: "남자는 심한 몽유병 환자였다. 평소 집에서는 창문을 모두 잠가놓았지만, 호텔 방에서는 그러지 못했다. 몽유병 상태에서 창문을 열고 뛰어내린 것이다.",
    keywords: ["몽유병", "잠", "무의식", "자면서"]
  },
  {
    id: "twins-mirror",
    title: "거울 속의 쌍둥이",
    emoji: "🪞",
    difficulty: 3,
    situation: "쌍둥이 형제가 있었다. 어느 날 형이 죽었다. 며칠 후, 동생도 죽었다. 동생은 자살했다.",
    answer: "쌍둥이 형이 죽은 후, 동생은 거울을 볼 때마다 죽은 형의 얼굴이 보였다. 똑같이 생긴 자신의 얼굴이 형을 떠올리게 했고, 그 고통을 견딜 수 없어 자살한 것이다.",
    keywords: ["거울", "얼굴", "똑같", "닮", "떠올"]
  },
  {
    id: "last-meal",
    title: "마지막 식사",
    emoji: "🍽️",
    difficulty: 2,
    situation: "한 남자가 아내에게 저녁을 해달라고 했다. 아내가 만든 음식을 먹고 남자는 미소를 지었다. 다음 날 아침, 남자는 아내를 경찰에 신고했다.",
    answer: "남자는 아내가 자신을 독살하려 한다고 의심하고 있었다. 일부러 음식을 해달라고 한 뒤 먹는 척하고 음식을 보관해 경찰에 증거로 제출한 것이다. 분석 결과 음식에서 독이 검출되었다.",
    keywords: ["독", "독살", "증거", "의심", "검출"]
  },
  {
    id: "push-car",
    title: "자동차와 호텔",
    emoji: "🚗",
    difficulty: 2,
    situation: "한 남자가 자동차를 밀고 호텔 앞에 도착했다. 그 순간 자신이 파산했다는 것을 알았다.",
    answer: "남자는 모노폴리(보드게임)를 하고 있었다. 자동차 모양 말을 밀어 호텔이 있는 칸에 도착했고, 숙박비를 낼 수 없어 파산한 것이다.",
    keywords: ["모노폴리", "보드게임", "게임", "말"]
  },
  {
    id: "blind-pilot",
    title: "맹인 조종사",
    emoji: "✈️",
    difficulty: 3,
    situation: "비행기가 활주로에 착륙했다. 승객들이 창밖을 보니 바다가 빠르게 다가오고 있었다. 모두 비명을 질렀다. 그 순간 비행기가 멈췄다. 조종사가 말했다. \"매번 이래.\"",
    answer: "조종사는 앞이 보이지 않았다. 즉, 맹인이었다. 계기판과 관제탑 지시만으로 착륙했다. 활주로가 바닷가 끝에 있어서 승객들은 바다로 돌진하는 줄 알고 비명을 질렀지만, 실제로는 정상 착륙이었다. 조종사는 승객들이 매번 비명을 지르는 것에 익숙한 것이다.",
    keywords: ["맹인", "앞이 안 보", "계기판", "관제탑", "시각장애", "눈이"]
  },
  {
    id: "locked-car",
    title: "잠긴 차 안의 시체",
    emoji: "🚙",
    difficulty: 3,
    situation: "한적한 들판에 차 한 대가 있다. 문과 창문은 모두 잠겨 있고, 차 안에 죽은 남자가 있다. 차 안에는 피가 없고, 외부 충격 흔적도 없다. 남자 옆에는 빈 물통 하나가 있다.",
    answer: "남자는 스쿠버 다이버였다. 물이 가득 찬 차 안에 갇혔고, 산소통의 공기를 다 써버린 뒤 익사했다. 이후 물이 어떤 경로로 빠져나가 차 안에는 빈 물통만 남은 것이다.",
    keywords: ["스쿠버", "다이버", "물", "익사", "산소", "잠수"]
  }
];

function corsHeaders(origin, allowedOrigin) {
  const allowed = allowedOrigin === '*' || origin === allowedOrigin || origin === 'http://localhost:3400';
  return {
    'Access-Control-Allow-Origin': allowed ? origin : allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}

async function callClaude(apiKey, systemPrompt, messages, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: systemPrompt,
        messages: messages
      })
    });
    const data = await resp.json();
    if (data.content && data.content[0]) {
      return data.content[0].text;
    }
    // Retry on overloaded
    if (data.error && data.error.type === 'overloaded_error' && i < retries - 1) {
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      continue;
    }
    throw new Error('Claude API error: ' + JSON.stringify(data));
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN || '*');

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // GET /api/stories — 스토리 목록
    if (url.pathname === '/api/stories' && request.method === 'GET') {
      const list = STORIES.map(s => ({
        id: s.id,
        title: s.title,
        emoji: s.emoji,
        difficulty: s.difficulty,
        situation: s.situation
      }));
      return new Response(JSON.stringify({ stories: list }), { headers });
    }

    // POST /api/hint — 힌트 요청
    if (url.pathname === '/api/hint' && request.method === 'POST') {
      const body = await request.json();
      const { storyId, chatHistory } = body;
      const story = STORIES.find(s => s.id === storyId);
      if (!story) {
        return new Response(JSON.stringify({ error: 'Story not found' }), { status: 404, headers });
      }

      const systemPrompt = `너는 "바다거북 수프" 게임의 출제자야.

## 문제 상황
${story.situation}

## 정답 (비밀)
${story.answer}

## 역할
플레이어가 힌트를 요청했어. 정답을 직접 말하지 말고, **방향만 살짝** 알려줘.
- 1~2문장으로 짧게
- 정답의 핵심 키워드는 절대 포함하지 마
- "~에 대해 생각해보세요" 또는 "~가 중요한 단서예요" 같은 식으로
- 지금까지 대화 맥락을 보고, 플레이어가 놓치고 있는 방향을 알려줘
- 반드시 한국어로`;

      const messages = [
        ...(chatHistory || []).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: '힌트를 주세요' }
      ];

      try {
        const hint = await callClaude(env.ANTHROPIC_API_KEY, systemPrompt, messages);
        return new Response(JSON.stringify({ hint }), { headers });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
      }
    }

    // GET /share/yesno — 공유 OG 페이지
    if (url.pathname.startsWith('/share/yesno') && request.method === 'GET') {
      const title = url.searchParams.get('t') || '미스터리';
      const questions = url.searchParams.get('q') || '?';
      const time = url.searchParams.get('s') || '?';
      const grade = url.searchParams.get('g') || 'D';
      const hints = url.searchParams.get('h') || '0';

      const ogImageUrl = `${url.origin}/share/yesno/og?t=${encodeURIComponent(title)}&q=${questions}&s=${time}&g=${grade}&h=${hints}`;

      const html = `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<meta property="og:title" content="YesNo — ${title}">
<meta property="og:description" content="질문 ${questions}회 · ${time} · 등급 ${grade}${parseInt(hints) > 0 ? ' · 힌트 ' + hints + '회' : ''}">
<meta property="og:image" content="${ogImageUrl}">
<meta property="og:url" content="https://yesno.salmonholic.com">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0;url=https://yesno.salmonholic.com">
</head><body>Redirecting...</body></html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    }

    // GET /share/yesno/og — OG 이미지 생성 (SVG→PNG 대신 SVG 직접)
    if (url.pathname === '/share/yesno/og' && request.method === 'GET') {
      const title = url.searchParams.get('t') || '미스터리';
      const questions = url.searchParams.get('q') || '?';
      const time = url.searchParams.get('s') || '?';
      const grade = url.searchParams.get('g') || 'D';
      const hints = url.searchParams.get('h') || '0';
      
      const gradeColors = { S: '#00ff88', A: '#00ccff', B: '#ffaa00', C: '#ff6644', D: '#888' };
      const gradeColor = gradeColors[grade] || '#888';

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <text x="100" y="120" font-family="Arial,sans-serif" font-size="64" font-weight="bold" fill="#00ff88">YesNo</text>
  <text x="100" y="200" font-family="Arial,sans-serif" font-size="36" fill="#e0e0e0">🔮 ${title.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text>
  <text x="600" y="360" font-family="Arial,sans-serif" font-size="180" font-weight="bold" fill="${gradeColor}" text-anchor="middle">${grade}</text>
  <text x="100" y="520" font-family="Arial,sans-serif" font-size="28" fill="#888">질문 ${questions}회 · ${time}${parseInt(hints) > 0 ? ' · 힌트 ' + hints + '회' : ''}</text>
  <text x="100" y="570" font-family="Arial,sans-serif" font-size="24" fill="#555">yesno.salmonholic.com</text>
</svg>`;
      return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' } });
    }

    // POST /api/ask — 질문하기 (예/아니오 답변)
    if (url.pathname === '/api/ask' && request.method === 'POST') {
      const body = await request.json();
      const { storyId, chatHistory } = body;
      const story = STORIES.find(s => s.id === storyId);
      if (!story) {
        return new Response(JSON.stringify({ error: 'Story not found' }), { status: 404, headers });
      }

      const systemPrompt = `너는 "바다거북 수프" (래터럴 씽킹 퍼즐) 게임의 출제자야.

## 문제 상황
${story.situation}

## 정답 (비밀 — 절대 직접 알려주지 마)
${story.answer}

## 규칙
- 플레이어의 질문에 "예", "아니오", 또는 "상관없음" 중 하나로만 답해.
- 정답에 비추어 논리적으로 판단해.
- 절대로 정답을 직접 말하거나 힌트를 주지 마.
- 질문이 애매하면 "질문을 더 구체적으로 해주세요"라고 해.
- 반드시 한국어로 답해.
- 답변 형식: "예 ✅" 또는 "아니오 ❌" 또는 "상관없음 ➖" 뒤에 필요시 짧은 부연 (1줄 이내)`;

      const messages = (chatHistory || []).map(m => ({
        role: m.role,
        content: m.content
      }));

      try {
        const answer = await callClaude(env.ANTHROPIC_API_KEY, systemPrompt, messages);
        return new Response(JSON.stringify({ answer }), { headers });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
      }
    }

    // POST /api/solve — 정답 시도
    if (url.pathname === '/api/solve' && request.method === 'POST') {
      const body = await request.json();
      const { storyId, attempt, chatHistory } = body;
      const story = STORIES.find(s => s.id === storyId);
      if (!story) {
        return new Response(JSON.stringify({ error: 'Story not found' }), { status: 404, headers });
      }

      const systemPrompt = `너는 "바다거북 수프" 게임의 심판이야.

## 문제 상황
${story.situation}

## 정답
${story.answer}

## 핵심 키워드
${story.keywords.join(', ')}

## 역할
플레이어가 정답을 시도했어. 아래 기준으로 판정해:

1. **정답** — 핵심 요소를 맞춤 (키워드와 완전히 일치하지 않아도, 핵심 논리가 같으면 정답)
2. **거의 맞음** — 방향은 맞지만 핵심이 빠짐
3. **오답** — 전혀 다른 방향

반드시 아래 JSON 형식으로만 답해:
{"result": "correct" | "close" | "wrong", "message": "판정 이유 (1~2줄, 한국어)"}

정답일 경우 message에 축하 + 정답 해설을 포함해.
거의 맞음일 경우 "방향은 맞아요! 좀 더 구체적으로 생각해보세요" 같은 힌트.
오답일 경우 "아쉽지만 다른 방향이에요. 계속 질문해보세요!" 같은 격려.`;

      const messages = [
        ...(chatHistory || []).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: `[정답 시도] ${attempt}` }
      ];

      try {
        const raw = await callClaude(env.ANTHROPIC_API_KEY, systemPrompt, messages);
        // Parse JSON from response
        let parsed;
        try {
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
        } catch {
          parsed = { result: 'wrong', message: raw };
        }
        // Include full answer if correct
        if (parsed.result === 'correct') {
          parsed.fullAnswer = story.answer;
        }
        return new Response(JSON.stringify(parsed), { headers });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
  }
};
