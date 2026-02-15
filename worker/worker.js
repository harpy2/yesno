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
    id: "hat-in-bar",
    title: "모자를 쓴 남자",
    emoji: "🎩",
    difficulty: 2,
    situation: "한 남자가 바에 들어와 바텐더에게 물 한 잔을 달라고 했다. 바텐더는 물 대신 남자의 머리에 총을 겨눴다. 남자는 '고맙습니다'라고 말하고 바를 나갔다.",
    answer: "이 문제는 '물 한 잔의 감사'와 같은 구조다. 남자는 딸꾹질을 하고 있었고, 바텐더가 총으로 놀라게 해서 딸꾹질이 멈췄다. 그래서 고맙다고 한 것이다.",
    keywords: ["딸꾹질", "놀라", "깜짝"]
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
    id: "photo-cry",
    title: "사진 속 남자",
    emoji: "🖼️",
    difficulty: 2,
    situation: "한 남자가 어떤 사진을 바라보며 말했다. \"형제도 없고 자매도 없지만, 이 사진 속 남자의 아버지는 나의 아버지의 아들이다.\" 사진 속 남자는 누구인가?",
    answer: "사진 속 남자는 그의 아들이다. '나의 아버지의 아들'은 자기 자신이므로, '이 사진 속 남자의 아버지는 나 자신이다'라는 뜻이다.",
    keywords: ["아들", "자기 자신", "본인"]
  },
  {
    id: "dark-room",
    title: "깜깜한 방",
    emoji: "🕯️",
    difficulty: 1,
    situation: "깜깜한 방에 성냥 한 개가 있다. 방에는 난로, 양초, 석유 램프가 있다. 무엇을 가장 먼저 켜야 하는가?",
    answer: "성냥을 가장 먼저 켜야 한다. 난로, 양초, 석유 램프 어느 것이든 켜려면 먼저 성냥에 불을 붙여야 한다.",
    keywords: ["성냥", "먼저", "불"]
  },
  {
    id: "rain-walk",
    title: "비 속의 남자",
    emoji: "🌧️",
    difficulty: 2,
    situation: "폭우가 쏟아지는 밤, 한 남자가 우산도 없이 모자도 없이 걸어가고 있다. 옷은 흠뻑 젖었지만, 머리카락은 하나도 젖지 않았다.",
    answer: "남자는 대머리다. 머리카락이 없으니 젖을 머리카락도 없다.",
    keywords: ["대머리", "머리카락이 없", "빡빡"]
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
    id: "apple-death",
    title: "사과와 죽음",
    emoji: "🍎",
    difficulty: 3,
    situation: "두 사람이 사막에서 죽은 채 발견되었다. 둘 다 손에 사과 조각을 들고 있었다.",
    answer: "두 사람은 비행기에서 기내식으로 사과를 먹고 있었다. 비행기가 사막에 추락했고, 사과를 손에 든 채 죽은 것이다.",
    keywords: ["비행기", "추락", "기내식", "기내"]
  },
  {
    id: "bridge-jump",
    title: "다리 위의 남자",
    emoji: "🌉",
    difficulty: 3,
    situation: "한 남자가 다리 위에서 뛰어내렸다. 주변에 아무도 없었고, 남자는 멀쩡히 살아서 집에 돌아갔다.",
    answer: "다리는 아주 낮은 보행자 다리(징검다리 또는 작은 개울 위 다리)였다. 높이가 1미터도 안 되어서 뛰어내려도 아무 문제 없었다.",
    keywords: ["낮은", "작은", "개울", "높이", "짧"]
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
