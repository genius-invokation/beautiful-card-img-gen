import { BunRequest } from "bun";
import { parse } from "node:path";
import indexHtml from "./index.html";
import puppeteer from "puppeteer";
import { CharacterRawData, EntityRawData, keywords } from "@gi-tcg/static-data";

console.log(!!import.meta.env?.GITHUB_TOKEN);

const browser = await puppeteer.launch({
  executablePath: import.meta.env?.CHROME_EXECUTABLE_PATH,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();

const prodDataUrl =
  "https://raw.githubusercontent.com/genius-invokation/genius-invokation/refs/heads/main/packages/static-data/";
const betaDataUrl =
  "https://raw.githubusercontent.com/genius-invokation/genius-invokation-beta/refs/heads/beta/packages/static-data/";

const CUSTOM_CHS: CharacterRawData[] = [
  {
    id: 9501,
    name: "雨酱",
    obtainable: true,
    storyTitle: "",
    storyText: "你查这个干什么？",
    cardFace: "UI_Gcg_CardFace_Char_Avatar_Guyutongxue",
    icon: "",
    englishName: "",
    hp: 10,
    maxEnergy: 3,
    skills: [
      {
        id: 95011,
        name: "不会用神之眼",
        englishName: "",
        type: "GCG_SKILL_TAG_A",
        rawDescription: "造成$[D__KEY__DAMAGE]点$[D__KEY__ELEMENT]。",
        description: "",
        playCost: [
          {
            type: "GCG_COST_DICE_ANEMO",
            count: 1,
          },
          {
            type: "GCG_COST_DICE_VOID",
            count: 2,
          },
        ],
        targetList: [],
        hidden: false,
        keyMap: {
          D__KEY__ELEMENT: "GCG_ELEMENT_PHYSIC",
          D__KEY__DAMAGE: 2,
        },
        icon: "Skill_A_02",
      },
      {
        id: 95012,
        name: "哎呀",
        englishName: "",
        type: "GCG_SKILL_TAG_E",
        rawDescription:
          "造成$[D__KEY__DAMAGE]点$[D__KEY__ELEMENT]，生成<color=#FFFFFFFF>$[C195011]</color>。",
        description: "",
        playCost: [
          {
            type: "GCG_COST_DICE_ANEMO",
            count: 3,
          },
        ],
        targetList: [],
        hidden: false,
        keyMap: {
          D__KEY__ELEMENT: "GCG_ELEMENT_ANEMO",
          D__KEY__DAMAGE: 2,
        },
        icon: "Skill_E_Diona_01_HD",
      },
      {
        id: 95013,
        name: "看看你的",
        englishName: "",
        type: "GCG_SKILL_TAG_Q",
        rawDescription:
          "造成$[D__KEY__DAMAGE]点$[D__KEY__ELEMENT]，召唤<color=#FFFFFFFF>$[C195012]</color>。",
        description: "",
        playCost: [
          {
            type: "GCG_COST_DICE_ANEMO",
            count: 3,
          },
          {
            type: "GCG_COST_ENERGY",
            count: 3,
          },
        ],
        targetList: [],
        hidden: false,
        keyMap: {
          D__KEY__ELEMENT: "GCG_ELEMENT_ANEMO",
          D__KEY__DAMAGE: 2,
        },
        icon: "MonsterSkill_S_EffigyElectric_04",
      },
    ],
    tags: [
      "GCG_TAG_ELEMENT_ANEMO",
      "GCG_TAG_WEAPON_BOW",
      "GCG_TAG_NATION_LIYUE",
    ],
  },
];

const CUSTOM_ENS: EntityRawData[] = [
  {
    id: 195011,
    type: "GCG_CARD_ONSTAGE",
    name: "结算bug",
    englishName: "",
    tags: [],
    skills: [],
    rawDescription:
      "本回合中，我方角色造成的伤害随机+1~3。\\n<color=#FFFFFFFF>$[K3]：2</color>",
    description: "",
    shownToken: "GCG_TOKEN_LIFE",
    hidden: false,
    buffIcon: "UI_Gcg_Buff_Common_Special",
    buffIconHash: "13225239691945994096",
  },
  {
    id: 195012,
    type: "GCG_CARD_SUMMON",
    name: "雨酱的白丝",
    englishName: "",
    tags: [],
    skills: [],
    rawDescription:
      "<color=#FFFFFFFF>结束阶段：</color>造成2点$[K105]，随机交换1张双方原本元素骰费用最多的手牌。\\n<color=#FFFFFFFF>$[K3]：2</color>\\n\\n<color=#FFFFFFFF>我方角色或召唤物引发扩散反应后：</color>转换此牌的元素类型，改为造成被扩散的元素类型的伤害。（离场前仅限一次）",
    description: "",
    hintType: "GCG_HINT_ANEMO",
    shownToken: "GCG_TOKEN_LIFE",
    hidden: false,
    cardFace: "UI_Gcg_CardFace_Summon_Guyutongxue",
  },
];

const CUSTOM_DATA = {
  characters: CUSTOM_CHS,
  entities: CUSTOM_ENS,
  action_cards: [],
  keywords: [],
};

const loadData = (baseUrl: string) =>
  new Map(
    (["characters", "action_cards", "entities", "keywords"] as const).map(
      (name) =>
        [
          name,
          fetch(`${baseUrl}/src/data/${name}.json`, {
            headers: {
              Authorization: import.meta.env?.GITHUB_TOKEN
                ? `Bearer ${import.meta.env?.GITHUB_TOKEN}`
                : (void 0 as any),
            },
          })
            .then(async (res) => [...(await res.json()), ...CUSTOM_DATA[name]])
            .catch(() => []),
        ] as const,
    ),
  );

// 预加载生产和测试环境数据
const [prodData, data] = [loadData(prodDataUrl), loadData(betaDataUrl)];

const server = Bun.serve({
  routes: {
    "/": indexHtml,
    "/assets/*": (req) => {
      const path = decodeURIComponent(new URL(req.url).pathname).slice(1);
      const file = Bun.file(path);
      return new Response(file);
    },
    "/data/*": async (req: BunRequest) => {
      const url = new URL(req.url);
      const remote = url.searchParams.get("remote");
      if (remote) {
        const { name } = parse(url.pathname);
        const beta = !!url.searchParams.get("beta");
        const useData = beta ? data : prodData;
        return new Response(
          JSON.stringify((await useData.get(name as any)) ?? []),
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }
      const path = decodeURIComponent(url.pathname).slice(1);
      const file = Bun.file(path);
      return new Response(file);
    },
    "/images/*": async (req: BunRequest) => {
      const path = decodeURIComponent(new URL(req.url).pathname).slice(1);
      const file = Bun.file(path);
      if (!(await file.exists())) {
        const { name } = parse(path);
        const blob = await fetch(
          `https://assets.gi-tcg.guyutongxue.site/assets/${name}.webp`,
        ).then((r) => r.blob());
        return new Response(blob, {
          headers: {
            "Content-Type": "image/webp",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
      return new Response(file);
    },
    "/render": async (req: BunRequest) => {
      const search = new URL(req.url).searchParams;
      const query = search.get("q");
      const beta = !!search.get("beta");
      return renderCard(query ?? "", beta);
    },
  },
  port: import.meta.env?.PORT || 8013,
});

const homepage = `http://${server.hostname}:${server.port}`;
await page.goto(homepage, { waitUntil: "networkidle0" });
console.log(`Server running at ${homepage}`);

const renderCard = async (nameOrId: string, beta: boolean) => {
  if (!nameOrId) {
    throw new Error("nameOrId is required");
  }
  const useData = beta ? data : prodData;
  const namedThings = (
    await Promise.all([useData.get("action_cards"), useData.get("characters")])
  )
    .flat()
    .filter((item) => item.obtainable !== false);
  let id = Number(nameOrId);
  if (isNaN(id)) {
    const card = namedThings.find((item) => item.name.includes(nameOrId));
    if (!card) {
      throw new Error(`Card ${nameOrId} not found`);
    }
    id = card.id;
  }
  const search = new URLSearchParams({
    display_story: "1",
    display_id: "1",
    beta: beta ? "1" : "",
  });
  if (String(id).length === 4) {
    search.set("id", `A${id}`);
  } else {
    search.set("id", `C${id}`);
  }
  const url = `${homepage}/?${search}`;
  console.log(`Rendering ${nameOrId} (${id})`);
  await page.goto(url, { waitUntil: "networkidle0" });
  const root = await page.$("#root");
  const buffer = await root!.screenshot({
    quality: 80,
    optimizeForSpeed: true,
    type: "webp",
  });
  return new Response(buffer, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

process.on("exit", () => {
  browser.close();
});

["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
  process.on(signal, () => {
    browser.close().finally(() => {
      process.exit(0);
    });
  });
});
