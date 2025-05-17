import "./style.css";
import { createRoot } from "react-dom/client";
import {
  ActionCardRawData,
  // actionCards,
  CharacterRawData,
  // characters,
  // entities,
  EntityRawData,
  KeywordRawData,
  // keywords,
  PlayCost,
  SkillRawData,
} from "@gi-tcg/static-data";

import zh_characters from "./data_zh/characters.json";
import zh_actionCards from "./data_zh/action_cards.json";
import zh_keywords from "./data_zh/keywords.json";
import zh_entities from "./data_zh/entities.json";

import en_characters from "./data_en/characters.json";
import en_actionCards from "./data_en/action_cards.json";
import en_keywords from "./data_en/keywords.json";
import en_entities from "./data_en/entities.json";
const LANGUAGE = "zh" as "zh" | "en"; //语言zh en
const AUTHOR_CONFIG = [
  { name: "ninthspace", img: "/assets/frame/ninthspace.png" },
  { name: "guyutongxue", img: "/assets/frame/guyu.png" },
  { name: "dudu-bot", img: "/assets/frame/dudubot.png" },
][0]; //作者信息 0:ninthspace, 1:guyu, 2:dudu-bot
const VERSION = "Beta 5.6 v3"; //版本号
const CARD_BACK_IMAGE = "./assets/UI_Gcg_CardBack_Championship_09.png"; //牌背
const DISPLAY_ID = true; //显示ID

// 手动配置的child
const CHILDREN_CONFIG = {
  11142: "$[C111141],$[C111142]，$[C111143]", // 茜特菈莉 有个不知道哪来的错误夜魂加持
  12102: "$[C112101],$[S12104]", // 那维莱特 K1020=S12104
  12111: "", // 芙宁娜 普攻置空
  13152: "$[C113151],$[C113154],$[C113155],$[C113156]", // 玛薇卡
} as Record<number, string>;

// 需要展示的规则解释ID
const shownKeywords = [7];

// 费用只读的ID，全部实体都写在这，准备技能已经做了特判不用写了
const costReadonly = [112131, 112132, 112133, 112142];

// 新卡技能icon
const SKILL_ICON_MAP = {
  11142: "./assets/card/demo/UI_Talent_U_Citlali_01.png",
  11143: "./assets/card/demo/UI_Talent_U_Citlali_02.png",
  11144: "./assets/card/demo/Skill_S_Citlali_02.png",
  13152: "./assets/card/demo/Skill_S_Mavuika_01.png",
  13153: "./assets/card/demo/UI_Talent_U_Mavuika_01.png",
  13154: "./assets/card/demo/Skill_S_Mavuika_06.png",
} as Record<number, string>;

// 新卡bufficon
// 应该是兼容老卡的，老卡用的是函数cardfaceurl，只是我目标路径没有老卡
// 可能新卡和老卡都有用到cardfaceurl的地方，如果能作出区分也行
const BUFF_ICON_MAP = {
  111141: "./assets/card/demo/UI_Gcg_Buff_Nightsoul_Ice.webp",
  111142: "./assets/card/demo/UI_Gcg_Buff_Citlali_Shiled.png",
  111143: "./assets/card/demo/UI_Gcg_Buff_Citlali_E1.png",
  113151: "./assets/card/demo/UI_Gcg_Buff_Nightsoul_Fire.webp",
  113152: "./assets/card/demo/UI_Gcg_Buff_Mavuika_S.png",
  113153: "./assets/card/demo/UI_Gcg_Buff_Mavuika_E.png",
  1131541: "./assets/card/demo/UI_Gcg_Buff_Vehicle_Mavuika2.png",
  1131551: "./assets/card/demo/UI_Gcg_Buff_Vehicle_Mavuika3.png",
  1131561: "./assets/card/demo/UI_Gcg_Buff_Vehicle_Mavuika1.png",
} as Record<number, string>;

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}

const Data = {
  zh: {
    characters: zh_characters,
    actionCards: zh_actionCards,
    keywords: zh_keywords,
    entities: zh_entities,
  },
  en: {
    characters: en_characters,
    actionCards: en_actionCards,
    keywords: en_keywords,
    entities: en_entities,
  },
};

const { characters, actionCards, keywords, entities } = Data[LANGUAGE];

const LOGO = AUTHOR_CONFIG.img;
const CARD_BACK_FRAME = "/assets/frame/avatar_card_frame_2.png";
const CARD_NORMAL_FRAME = "/assets/frame/card_frame_normal.png";
const CARD_LEGEND_FRAME = "/assets/frame/card_frame_legend.png";
const avatar_card_hp = "/assets/frame/UI_TeyvatCard_LifeBg.png";
const avatar_card_energy = "/assets/frame/UI_TeyvatCard_LifeBg3.png";
const keyword_card_frame = "/assets/frame/keyword_card_frame.png";
// const keyword_card_shadow = "/assets/frame/keyword_card_shadow.png";
const keyword_cardback_repeat = "/assets/frame/UI_Gcg_CardBack_Repeat.png";
const keyword_cardback_bottom = "/assets/frame/UI_Gcg_CardBack_Bottom.png";

// 特殊能量，卡图右侧的能量条
const SPECIAL_ENERGY_MAP = {
  1315: "/assets/frame/UI_TeyvatCard_LifeBg_Mavuika1.png",
} as Record<number, string>;

const COST_TYPE_IMG_NAME_MAP = {
  GCG_COST_DICE_VOID: "Diff",
  GCG_COST_DICE_CRYO: "Ice",
  GCG_COST_DICE_HYDRO: "Water",
  GCG_COST_DICE_PYRO: "Fire",
  GCG_COST_DICE_ELECTRO: "Electric",
  GCG_COST_DICE_ANEMO: "Wind",
  GCG_COST_DICE_GEO: "Rock",
  GCG_COST_DICE_DENDRO: "Grass",
  GCG_COST_DICE_SAME: "Same",
  GCG_COST_ENERGY: "Energy",
  GCG_COST_LEGEND: "Legend",
  GCG_COST_SPECIAL_ENERGY: "Energy_Mavuika",
} as Record<string, string>;

const TYPE_TAG_TEXT_MAP = {
  zh: {
    GCG_RULE_EXPLANATION: "规则解释",
    GCG_SKILL_TAG_A: "普通攻击",
    GCG_SKILL_TAG_E: "元素战技",
    GCG_SKILL_TAG_Q: "元素爆发",
    GCG_SKILL_TAG_PASSIVE: "被动技能",
    GCG_SKILL_TAG_VEHICLE: "特技",
    GCG_CARD_EVENT: "事件牌",
    GCG_CARD_ONSTAGE: "出战状态",
    GCG_CARD_STATE: "状态",
    GCG_CARD_SUMMON: "召唤物",
    GCG_CARD_SUPPORT: "支援牌",
    GCG_CARD_MODIFY: "装备牌",
    GCG_TAG_ELEMENT_CRYO: "冰元素",
    GCG_TAG_ELEMENT_HYDRO: "水元素",
    GCG_TAG_ELEMENT_PYRO: "火元素",
    GCG_TAG_ELEMENT_ELECTRO: "雷元素",
    GCG_TAG_ELEMENT_ANEMO: "风元素",
    GCG_TAG_ELEMENT_GEO: "岩元素",
    GCG_TAG_ELEMENT_DENDRO: "草元素",
    GCG_TAG_NATION_MONDSTADT: "蒙德",
    GCG_TAG_NATION_LIYUE: "璃月",
    GCG_TAG_NATION_INAZUMA: "稻妻",
    GCG_TAG_NATION_SUMERU: "须弥",
    GCG_TAG_NATION_FONTAINE: "枫丹",
    GCG_TAG_NATION_NATLAN: "纳塔",
    GCG_TAG_NATION_SNEZHNAYA: "至冬",
    GCG_TAG_CAMP_ERIMITE: "镀金旅团",
    GCG_TAG_CAMP_FATUI: "愚人众",
    GCG_TAG_CAMP_MONSTER: "魔物",
    GCG_TAG_CAMP_SACREAD: "圣骸兽",
    GCG_TAG_CAMP_HILICHURL: "丘丘人",
    GCG_TAG_ARKHE_PNEUMA: "始基力：荒性",
    GCG_TAG_ARKHE_OUSIA: "始基力：芒性",
    GCG_TAG_WEAPON: "武器",
    GCG_TAG_WEAPON_BOW: "弓",
    GCG_TAG_WEAPON_SWORD: "单手剑",
    GCG_TAG_WEAPON_CLAYMORE: "双手剑",
    GCG_TAG_WEAPON_POLE: "长柄武器",
    GCG_TAG_WEAPON_CATALYST: "法器",
    GCG_TAG_WEAPON_NONE: "其它武器",
    GCG_TAG_ARTIFACT: "圣遗物",
    GCG_TAG_TALENT: "天赋",
    GCG_TAG_VEHICLE: "特技",
    GCG_TAG_LEGEND: "秘传",
    GCG_TAG_FOOD: "料理",
    GCG_TAG_RESONANCE: "元素共鸣",
    GCG_TAG_PLACE: "场地",
    GCG_TAG_ALLY: "伙伴",
    GCG_TAG_ITEM: "道具",
    GCG_TAG_PREPARE_SKILL: "准备技能",
    GCG_TAG_NYX_STATE: "夜魂态",
    GCG_TAG_SHEILD: "护盾",
    GCG_TAG_DENDRO_PRODUCE: "草元素相关反应产物",
    GCG_TAG_FALL_ATTACK: "下落攻击",
    GCG_TAG_FORBIDDEN_ATTACK: "无法使用技能",
    GCG_TAG_IMMUNE_CONTROL: "免疫控制",
    GCG_TAG_IMMUNE_FREEZING: "免疫冻结",
    GCG_TAG_SLOWLY: "战斗行动",
  },
  en: {
    GCG_RULE_EXPLANATION: "Detailed Rules",
    GCG_SKILL_TAG_A: "Normal Attack",
    GCG_SKILL_TAG_E: "Elemental Skill",
    GCG_SKILL_TAG_Q: "Elemental Burst",
    GCG_SKILL_TAG_PASSIVE: "Passive Skill",
    GCG_SKILL_TAG_VEHICLE: "Technique",
    GCG_CARD_EVENT: "Event Card",
    GCG_CARD_ONSTAGE: "Combat Status",
    GCG_CARD_STATE: "Status",
    GCG_CARD_SUMMON: "Summon",
    GCG_CARD_SUPPORT: "Support Card",
    GCG_CARD_MODIFY: "Equipment Card",
    GCG_TAG_ELEMENT_CRYO: "Cryo",
    GCG_TAG_ELEMENT_HYDRO: "Hydro",
    GCG_TAG_ELEMENT_PYRO: "Pyro",
    GCG_TAG_ELEMENT_ELECTRO: "Electro",
    GCG_TAG_ELEMENT_ANEMO: "Anemo",
    GCG_TAG_ELEMENT_GEO: "Geo",
    GCG_TAG_ELEMENT_DENDRO: "Dendro",
    GCG_TAG_NATION_MONDSTADT: "Mondstadt",
    GCG_TAG_NATION_LIYUE: "Liyue",
    GCG_TAG_NATION_INAZUMA: "Inazuma",
    GCG_TAG_NATION_SUMERU: "Sumeru",
    GCG_TAG_NATION_FONTAINE: "Fontaine",
    GCG_TAG_NATION_NATLAN: "Natlan",
    GCG_TAG_NATION_SNEZHNAYA: "Snezhnaya",
    GCG_TAG_CAMP_ERIMITE: "The Eremites",
    GCG_TAG_CAMP_FATUI: "Fatui",
    GCG_TAG_CAMP_MONSTER: "Monster",
    GCG_TAG_CAMP_SACREAD: "Sacread",
    GCG_TAG_CAMP_HILICHURL: "Hilichurl",
    GCG_TAG_ARKHE_PNEUMA: "Arkhe: Pneuma",
    GCG_TAG_ARKHE_OUSIA: "Arkhe: Ousia",
    GCG_TAG_WEAPON: "Weapon",
    GCG_TAG_WEAPON_BOW: "Bow",
    GCG_TAG_WEAPON_SWORD: "Sword",
    GCG_TAG_WEAPON_CLAYMORE: "Claymore",
    GCG_TAG_WEAPON_POLE: "Polearm",
    GCG_TAG_WEAPON_CATALYST: "Catalyst",
    GCG_TAG_WEAPON_NONE: "Other Weapon",
    GCG_TAG_ARTIFACT: "Artifact",
    GCG_TAG_TALENT: "Talent",
    GCG_TAG_VEHICLE: "Technique",
    GCG_TAG_LEGEND: "Arcane Legend",
    GCG_TAG_FOOD: "Food",
    GCG_TAG_RESONANCE: "Elemental Resonance",
    GCG_TAG_PLACE: "Location",
    GCG_TAG_ALLY: "Companion",
    GCG_TAG_ITEM: "Item",
    GCG_TAG_PREPARE_SKILL: "Prepare Skill",
    GCG_TAG_NYX_STATE: "Nightsoul's Blessing State",
    GCG_TAG_SHEILD: "Sheild",
    GCG_TAG_DENDRO_PRODUCE: "Dendro-Related Reactions",
    GCG_TAG_FALL_ATTACK: "Plunging Attack",
    GCG_TAG_FORBIDDEN_ATTACK: "Cannot Use Skills",
    GCG_TAG_IMMUNE_CONTROL: "Immune to Control",
    GCG_TAG_IMMUNE_FREEZING: "Immune to Frozen",
    GCG_TAG_SLOWLY: "Combat Action",
  },
} as Record<string, Record<string, string>>;

const TYPE_TAG_IMG_NAME_MAP = {
  GCG_CARD_EVENT: "Custom_ActionCard",
  GCG_CARD_ONSTAGE: "Custom_Summon",
  GCG_CARD_STATE: "Custom_Summon",
  GCG_CARD_SUMMON: "Custom_Summon",
  GCG_CARD_SUPPORT: "Custom_ActionCard",
  GCG_CARD_MODIFY: "Custom_ActionCard",
  GCG_TAG_ELEMENT_CRYO: "Element_Ice",
  GCG_TAG_ELEMENT_HYDRO: "Element_Water",
  GCG_TAG_ELEMENT_PYRO: "Element_Fire",
  GCG_TAG_ELEMENT_ELECTRO: "Element_Electric",
  GCG_TAG_ELEMENT_ANEMO: "Element_Wind",
  GCG_TAG_ELEMENT_GEO: "Element_Rock",
  GCG_TAG_ELEMENT_DENDRO: "Element_Grass",
  GCG_TAG_NATION_MONDSTADT: "Faction_Mondstadt",
  GCG_TAG_NATION_LIYUE: "Faction_Liyue",
  GCG_TAG_NATION_INAZUMA: "Faction_Inazuma",
  GCG_TAG_NATION_SUMERU: "Faction_Sumeru",
  GCG_TAG_NATION_FONTAINE: "Faction_Fontaine",
  GCG_TAG_NATION_NATLAN: "Faction_Natlan",
  GCG_TAG_NATION_SNEZHNAYA: "Faction_Snezhnaya",
  GCG_TAG_CAMP_ERIMITE: "Faction_Erimite",
  GCG_TAG_CAMP_FATUI: "Faction_Fatui",
  GCG_TAG_CAMP_MONSTER: "Faction_Monster",
  GCG_TAG_CAMP_SACREAD: "Faction_Sacred",
  GCG_TAG_CAMP_HILICHURL: "Faction_Hili",
  GCG_TAG_ARKHE_PNEUMA: "Faction_Pneuma",
  GCG_TAG_ARKHE_OUSIA: "Faction_Ousia",
  GCG_TAG_WEAPON: "Card_Weapon",
  GCG_TAG_WEAPON_BOW: "Weapon_Bow",
  GCG_TAG_WEAPON_SWORD: "Weapon_Sword",
  GCG_TAG_WEAPON_CLAYMORE: "Weapon_Claymore",
  GCG_TAG_WEAPON_POLE: "Weapon_Polearm",
  GCG_TAG_WEAPON_CATALYST: "Weapon_Catalyst",
  GCG_TAG_WEAPON_NONE: "Weapon_None",
  GCG_TAG_ARTIFACT: "Card_Relic",
  GCG_TAG_TALENT: "Card_Talent",
  GCG_TAG_VEHICLE: "Card_Vehicle",
  GCG_TAG_LEGEND: "Card_Legend",
  GCG_TAG_FOOD: "Card_Food",
  GCG_TAG_RESONANCE: "Card_Sync",
  GCG_TAG_PLACE: "Card_Location",
  GCG_TAG_ALLY: "Card_Ally",
  GCG_TAG_ITEM: "Card_Item",
  GCG_TAG_SLOWLY: "Card_CombatAction",
} as Record<string, string>;

const diceImageUrl = (type: string) =>
  `/assets/UI_Gcg_DiceL_${COST_TYPE_IMG_NAME_MAP[type]}_Glow_HD.png`;

const tagImageUrl = (tag: string) =>
  `/assets/UI_Gcg_Tag_${TYPE_TAG_IMG_NAME_MAP[tag]}.png`;

const buffImageUrl = (buff: string) =>
  `/assets/UI_Gcg_Buff_Common_${TYPE_TAG_IMG_NAME_MAP[buff]}.png`;

const cardFaceUrl = (cardFace: string) => `/assets/card/demo/${cardFace}.png`;

interface DescriptionIconImage {
  imageUrl?: string;
  tagIcon?: string;
}

const DESCRIPTION_ICON_IMAGES = {
  4007: { imageUrl: `/assets/UI_Gcg_Keyword_Shield.png` },
  2100: { imageUrl: `/assets/UI_Gcg_Keyword_Element_Physics.png` },
  2101: { imageUrl: `/assets/UI_Gcg_Keyword_Element_Ice.png` },
  2102: { imageUrl: `/assets/UI_Gcg_Keyword_Element_Water.png` },
  2103: { imageUrl: `/assets/UI_Gcg_Keyword_Element_Fire.png` },
  2104: { imageUrl: `/assets/UI_Gcg_Keyword_Element_Electric.png` },
  2105: { imageUrl: `/assets/UI_Gcg_Keyword_Element_Wind.png` },
  2106: { imageUrl: `/assets/UI_Gcg_Keyword_Element_Rock.png` },
  2107: { imageUrl: `/assets/UI_Gcg_Keyword_Element_Grass.png` },
  1101: { imageUrl: `/assets/UI_Gcg_DiceL_Ice.png` },
  1102: { imageUrl: `/assets/UI_Gcg_DiceL_Water.png` },
  1103: { imageUrl: `/assets/UI_Gcg_DiceL_Fire.png` },
  1104: { imageUrl: `/assets/UI_Gcg_DiceL_Electric.png` },
  1105: { imageUrl: `/assets/UI_Gcg_DiceL_Wind.png` },
  1106: { imageUrl: `/assets/UI_Gcg_DiceL_Rock.png` },
  1107: { imageUrl: `/assets/UI_Gcg_DiceL_Grass.png` },
  1108: { imageUrl: `/assets/UI_Gcg_DiceL_Same.png` },
  1109: { imageUrl: `/assets/UI_Gcg_DiceL_Diff.png` },
  1110: { imageUrl: `/assets/UI_Gcg_Keyword_Energy.png` },
  1111: { imageUrl: `/assets/UI_Gcg_DiceL_Any.png` },
  1112: { imageUrl: `/assets/UI_Gcg_Keyword_Legend.png` },
  // 1113: "元素精通",
  4008: { imageUrl: `/assets/UI_Gcg_Keyword_Fighting_Spirit.png` },
  3003: { tagIcon: "GCG_TAG_WEAPON" },
  3004: { tagIcon: "GCG_TAG_ARTIFACT" },
  3006: { tagIcon: "GCG_TAG_TALENT" },
  3007: { tagIcon: "GCG_TAG_LEGEND" },
  3008: { tagIcon: "GCG_TAG_VEHICLE" },
  3101: { tagIcon: "GCG_TAG_FOOD" },
  3102: { tagIcon: "GCG_TAG_ITEM" },
  3103: { tagIcon: "GCG_TAG_ALLY" },
  3104: { tagIcon: "GCG_TAG_PLACE" },
  3200: { tagIcon: "GCG_TAG_WEAPON_NONE" },
  3201: { tagIcon: "GCG_TAG_WEAPON_CATALYST" },
  3202: { tagIcon: "GCG_TAG_WEAPON_BOW" },
  3203: { tagIcon: "GCG_TAG_WEAPON_CLAYMORE" },
  3204: { tagIcon: "GCG_TAG_WEAPON_POLE" },
  3205: { tagIcon: "GCG_TAG_WEAPON_SWORD" },
  3401: { tagIcon: "GCG_TAG_NATION_MONDSTADT" },
  3402: { tagIcon: "GCG_TAG_NATION_LIYUE" },
  3403: { tagIcon: "GCG_TAG_NATION_INAZUMA" },
  3404: { tagIcon: "GCG_TAG_NATION_SUMERU" },
  3405: { tagIcon: "GCG_TAG_NATION_FONTAINE" },
  3406: { tagIcon: "GCG_TAG_NATION_NATLAN" },
  3407: { tagIcon: "GCG_TAG_NATION_SNEZHNAYA" },
  3501: { tagIcon: "GCG_TAG_CAMP_FATUI" },
  3502: { tagIcon: "GCG_TAG_CAMP_HILICHURL" },
  3503: { tagIcon: "GCG_TAG_CAMP_MONSTER" },
  3504: { tagIcon: "GCG_TAG_ARKHE_PNEUMA" },
  3505: { tagIcon: "GCG_TAG_ARKHE_OUSIA" },
  // ?: { tagIcon: "GCG_TAG_CAMP_SACREAD" },
  // ?: { tagIcon: "GCG_TAG_CAMP_ERIMITE" },
} as Record<number, DescriptionIconImage>;

const KEYWORD_COLORS = {
  310: "#d8b456",
  100: "#d9b253",
  101: "#63bacd",
  102: "#488ccb",
  103: "#d6684b",
  104: "#917ce8",
  105: "#5ca8a6",
  106: "#d29d5d",
  107: "#88b750",
  150: "#d9b253",
  151: "#63bacd",
  152: "#488ccb",
  153: "#d6684b",
  154: "#917ce8",
  155: "#5ca8a6",
  156: "#d29d5d",
  157: "#88b750",
  200: "#d9b253",
  201: "#63bacd",
  202: "#488ccb",
  203: "#d6684b",
  204: "#917ce8",
  205: "#5ca8a6",
  206: "#d29d5d",
  207: "#88b750",
  210: "#d9b253",
  211: "#63bacd",
  212: "#488ccb",
  213: "#d6684b",
  214: "#917ce8",
  215: "#5ca8a6",
  216: "#d29d5d",
  217: "#88b750",
  250: "#d9b253",
  251: "#63bacd",
  252: "#488ccb",
  253: "#d6684b",
  254: "#917ce8",
  255: "#5ca8a6",
  256: "#d29d5d",
  257: "#88b750",
  260: "#d9b253",
  261: "#63bacd",
  262: "#488ccb",
  263: "#d6684b",
  264: "#917ce8",
  265: "#5ca8a6",
  266: "#d29d5d",
  267: "#88b750",
  300: "#d9b253",
  301: "#63bacd",
  302: "#488ccb",
  303: "#d6684b",
  304: "#917ce8",
  305: "#5ca8a6",
  306: "#d29d5d",
  307: "#88b750",
} as Record<number, string>;

/** 处理中间点间距 */
const Text = ({ text }: { text: string | undefined | null }) => {
  // : (string | JSX.Element)[]
  if (LANGUAGE === "en") {
    return <span className="english-text">{text}</span>;
  }

  if (typeof text !== "string" || !text.includes("·")) return text;
  return text.split("·").flatMap((part, i, arr) =>
    i < arr.length - 1
      ? [
          part,
          <span key={i} className="middot">
            ·
          </span>,
        ]
      : [part],
  );
};

type TagType = "character" | "cardType" | "cardTag";

const Tag = (props: { type: TagType; tag: string; className?: string }) => {
  return (
    TYPE_TAG_TEXT_MAP[LANGUAGE][props.tag] && (
      <div
        className={`tag ${props.className ?? ""}`}
        data-tag-type={props.type}
      >
        <div className="tag-icon-container">
          {props.tag.startsWith("GCG_TAG_ELEMENT_") ? (
            <img className="tag-icon-image" src={buffImageUrl(props.tag)} />
          ) : (
            <div
              className="tag-icon-mask"
              style={{ "--image": `url("${tagImageUrl(props.tag)}")` }}
            />
          )}
        </div>
        <div className="tag-text">
          <Text text={TYPE_TAG_TEXT_MAP[LANGUAGE][props.tag]} />
        </div>
      </div>
    )
  );
};

const KeywordTag = (props: {
  tag: string;
  image?: string;
  className?: string;
}) => {
  return (
    TYPE_TAG_TEXT_MAP[LANGUAGE][props.tag] && (
      <div className={`keyword-tag ${props.className ?? ""}`}>
        {/* {(props.image || TYPE_TAG_IMG_NAME_MAP[props.tag]) && (
          <div className="keyword-tag-icon-container">
            {props.image ? (
              <img
                className="keyword-tag-image"
                src={cardFaceUrl(props.image)}
              />
            ) : (
              <div
                className="keyword-tag-icon"
                style={{ "--image": `url("${tagImageUrl(props.tag)}")` }}
              />
            )}
          </div>
        )} */}
        <div className="keyword-tag-text">
          {TYPE_TAG_TEXT_MAP[LANGUAGE][props.tag]}
        </div>
      </div>
    )
  );
};

const KeywordIcon = (props: {
  id: number;
  tag: string;
  image?: string;
  className?: string;
}) => {
  if (props.id in BUFF_ICON_MAP && BUFF_ICON_MAP[props.id]) {
    return (
      <img
        className="buff-icon"
        src={BUFF_ICON_MAP[props.id]}
      ></img>
    )
  } else if (props.id in PREPARE_SKILL_MAP && PREPARE_SKILL_MAP[props.id]) {
    const prepareState = entities.find((e) => e.id === PREPARE_SKILL_MAP[props.id]);
    if (prepareState && "buffIcon" in prepareState && prepareState.buffIcon) {
      return(
        <img
          className="buff-icon"
          src={cardFaceUrl(prepareState.buffIcon)}
        ></img>
      )
    } else return(void 0)
  } else {
    return(
      props.image && <img className="buff-icon" src={cardFaceUrl(props.image)} />
    )
  }  
    // TYPE_TAG_IMG_NAME_MAP[props.tag] && (
    //     <div
    //       className="buff-mask"
    //       style={{ "--image": `url("${tagImageUrl(props.tag)}")` }}
    //     />
    //   )
};

const Cost = (props: {
  type: "skill" | "keyword" | "actionCard";
  cost: PlayCost[];
  readonly?: boolean;
}) => {
  const rootClassName = {
    skill: "skill-cost-group",
    keyword: "keyword-cost-group",
    actionCard: "action-card-cost-group",
  }[props.type];
  const diceClassName =
    props.type === "actionCard" ? "action-card-cost-dice" : "dice-icon";
  return (
    <div className={rootClassName}>
      {props.cost.map(({ type, count }, i) => (
        <div className="cost" data-readonly={props.readonly} key={type}>
          <img src={diceImageUrl(type)} className={diceClassName} />
          {type !== "GCG_COST_LEGEND" && (
            <>
              <div className="stroked-text-top">{count}</div>
              <div className="stroked-text-bottom">{count}</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

type ChildData =
  | SkillRawData
  | EntityRawData
  | KeywordRawData
  | ActionCardRawData;

const BOLD_COLOR = "#FFFFFFFF";

const remapColors = (color: string | undefined) => {
  const COLOR_MAPS = {
    "#99FFFFFF": "#63bacd", // 冰
    "#80C0FFFF": "#488ccb", // 水
    "#FF9999FF": "#d6684b", // 火
    "#FFACFFFF": "#917ce8", // 雷
    "#80FFD7FF": "#5ca8a6", // 风
    "#FFE699FF": "#d29d5d", // 岩
    "#7EC236FF": "#88b750", // 草
  } as Record<string, string>;
  if (!color) {
    return;
  }
  return COLOR_MAPS[color] ?? color;
};

const KEYWORD_CHILD_MAP: Record<number, number> = Object.fromEntries(
  keywords
    .filter((k) => k.name && k.id > 1000)
    .map((k) => {
      const match = entities.find(
        (e) => 
          e.name === k.name && 
          e.id > 110000 &&
          !(e.tags as string[]).includes("GCG_TAG_PREPARE_SKILL")
      );
      return match ? [k.id, match.id] : null;
    })
    .filter((pair): pair is [number, number] => !!pair)
);

const PREPARE_SKILL_MAP: Record<number, number> = Object.fromEntries(
  entities
    .filter((e) => (e.tags as string[]).includes("GCG_TAG_PREPARE_SKILL")
    )
    .flatMap((entity) => {
      const matches = [...entity.rawDescription.matchAll(/\$\[S(\d{5})\]/g)];
      return matches.map((m) => [parseInt(m[1], 10), entity.id]);
    })
);

const Token = ({ token }: { token: DescriptionToken }) => {
  switch (token.type) {
    case "plain":
      return (
        <span
          className={`description-${token.style()}`}
          style={{
            "--color": remapColors(token.color),
          }}
        >
          <Text text={token.text} />
        </span>
      );
    case "boxedKeyword": {
      return (
        <span className="description-variable">
          <Text text={token.text} />
        </span>
      );
    }
    case "icon": {
      const { imageUrl, tagIcon } = DESCRIPTION_ICON_IMAGES[token.id] ?? {};
      const overrideStyleClass = token.overrideStyle()
        ? `description-${token.overrideStyle()}`
        : "";
      return (
        <>
          {imageUrl && <img className="description-icon" src={imageUrl} />}
          {tagIcon && (
            <span
              className={`description-icon-tag ${overrideStyleClass}`}
              style={{
                "--image": `url("${tagImageUrl(tagIcon)}")`,
              }}
            />
          )}
        </>
      );
    }
    case "reference":
      const overrideStyleClass = token.overrideStyle()
        ? `description-${token.overrideStyle()}`
        : "";
      return (
        <span
          className={`description-token ref-${token.refType} ${overrideStyleClass}`}
          style={{
            "--manual-color": token.manualColor ?? "",
          }}
        >
          <Text text={names.get(token.id) ?? `#${token.id}`} />
        </span>
      );
    case "lineBreak":
      return <br />;
    case "errored":
      return (
        <span className="description-token description-errored">
          {token.text}
        </span>
      );
  }
};

const Description = ({ description }: { description: ParsedDescription }) => {
  return (
    <>
      {description.map((token, i) => (
        <Token token={token} key={i} />
      ))}
    </>
  );
};

const Children = ({ children }: { children: ParsedChild[] }) => {
  return (
    <div className="child-layout">
      {children.map((keyword) => (
        <div className="keyword-box-wrapper">
          <div className="keyword-line"></div>
          {"cardFace" in keyword && keyword.cardFace && (
            <div className="keyword-card">
              <img
                src={keyword_cardback_bottom}
                className="keyword-card-back-bottom"
              />
              <div
                className="keyword-card-back-repeat"
                style={{ "--image": `url("${keyword_cardback_repeat}")` }}
              ></div>
              <img
                src={cardFaceUrl(keyword.cardFace)}
                className="keyword-card-face"
              />
              <img src={keyword_card_frame} className="keyword-card-frame" />
            </div>
          )}
          <div className="keyword-box">
            <div className="keyword-buff-box">
              {!("cardFace" in keyword && keyword.cardFace) && ( 
                <KeywordIcon
                  id={ keyword.id }
                  tag={
                    "type" in keyword ? keyword.type : "GCG_RULE_EXPLANATION"
                  }
                  image={"buffIcon" in keyword ? keyword.buffIcon : void 0}
                />
              )}
              <div className="keyword-title-box">
                <div className="keyword-title">
                  <Text text={keyword.name} />
                </div>
                <div className="keyword-tags">
                  <KeywordTag
                    tag={
                      "type" in keyword ? keyword.type : "GCG_RULE_EXPLANATION"
                    }
                    image={"buffIcon" in keyword ? keyword.buffIcon : void 0}
                  />
                  {keyword.id in PREPARE_SKILL_MAP && (
                    <KeywordTag tag="GCG_TAG_PREPARE_SKILL"/>
                  )}
                  {"tags" in keyword &&
                    keyword.tags.map((tag) => (
                      <KeywordTag tag={tag} key={tag} />
                    ))}
                  {DISPLAY_ID && (
                    <div className="id-box">
                      <div className="keyword-tag-text">ID: {keyword.id}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {"playCost" in keyword && (
              <Cost
                type="keyword"
                cost={
                  keyword.playCost.length === 0
                    ? [{ type: "GCG_COST_DICE_SAME", count: 0 }]
                    : keyword.playCost
                }
                readonly={
                  costReadonly.includes(keyword.id) ||
                  [
                    "GCG_SKILL_TAG_A",
                    "GCG_SKILL_TAG_E",
                    "GCG_SKILL_TAG_Q",
                  ].includes(keyword.type)
                }
                // readonly={keyword.type === "GCG_CARD_MODIFY"}
              />
            )}
            <div className={`keyword-description keyword-description-${LANGUAGE}`}>
              <Description description={keyword.parsedDescription} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SkillBox = ({ skill }: { skill: ParsedSkill }) => {
  if (skill.hidden) {
    return null;
  }
  return (
    <div className="skill-box figure" key={skill.id}>
      {/* <div className="author-decorator-top">{AUTHOR_CONFIG.name}</div> */}
      <div className="author-decorator-bottom">{AUTHOR_CONFIG.name}</div>
      <div className="skill-type">
        {TYPE_TAG_TEXT_MAP[LANGUAGE][skill.type]}
      </div>
      {skill.playCost && <Cost type="skill" cost={skill.playCost} />}
      <div
        className="skill-icon"
        style={{
          maskImage: `url("${
            skill.icon
              ? `https://assets.gi-tcg.guyutongxue.site/assets/${skill.icon}.webp`
              : SKILL_ICON_MAP[skill.id]
          }")`,
        }}
      ></div>
      <div className="skill-title">
        <Text text={skill.name} />
        {DISPLAY_ID && <span className="id-box">ID: {skill.id}</span>}
      </div>
      <div className={`skill-description skill-description-${LANGUAGE}`}>
        <Description description={skill.parsedDescription} />
      </div>
      {skill.children.length > 0 && <Children children={skill.children} />}
    </div>
  );
};

const CardFace = (props: {
  className?: string;
  isLegend?: boolean;
  cardFace: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={`card-face-component ${props.className ?? ""}`}>
      <img src={CARD_BACK_IMAGE} className="card-back" />
      <img src={CARD_BACK_FRAME} className="card-frame-shadow" />
      {/* <!-- 角色牌牌面 --> */}
      <div className="card-face">
        <img src={cardFaceUrl(props.cardFace)} className="card-face-image" />
        <img
          src={props.isLegend ? CARD_LEGEND_FRAME : CARD_NORMAL_FRAME}
          className="card-frame"
        />
        {props.children}
      </div>
    </div>
  );
};

const Character = ({ character }: { character: ParsedCharacter }) => {
  const [normalSkill, ...otherSkills] = character.parsedSkills;
  return (
    <div className="character">
      <div className="character-header">
        <CardFace
          className="character-image-container"
          cardFace={character.cardFace}
        >
          <div className="avatar-card-hp">
            <img src={avatar_card_hp} className="avatar-card-hp-image" />
            <div className="stroked-text-top">{character.hp}</div>
            <div className="stroked-text-bottom">{character.hp}</div>
          </div>
          <div className="energy-bar">
            {Array.from({ length: character.maxEnergy }).map((_, i) => (
              <img
                src={SPECIAL_ENERGY_MAP[character.id] ?? avatar_card_energy}
                key={i}
                className="energy"
              />
            ))}
          </div>
        </CardFace>
        <div className="character-info">
          <div className="character-title-wrapper">
            <div className="character-title">
              <Text text={character.name} />
            </div>
          </div>
          <div className="character-tags">
            {character.tags.map((tag) => (
              <Tag type="character" tag={tag} key={tag} />
            ))}
          </div>
          <hr className="info-divider" />
          <p className="info-story">
            <Text text={character.storyText} />
          </p>
          <div className="spacer"></div>
          <SkillBox skill={normalSkill} />
        </div>
      </div>
      {otherSkills.map((skill) => (
        <SkillBox skill={skill} key={skill.id} />
      ))}
    </div>
  );
};

const ActionCard = ({ card }: { card: ParsedActionCard }) => {
  return (
    <div className="action-card">
      <div className="action-card-info figure">
        <div className="author-decorator-bottom">{AUTHOR_CONFIG.name}</div>
        <div className="action-card-title">
          <Text text={card.name} />
          {DISPLAY_ID && <span className="id-box">ID: {card.id}</span>}
        </div>
        <div className="action-card-tags">
          <Tag type="cardType" tag={card.type} />
          {card.tags.map((tag) => (
            <Tag type="cardTag" tag={tag} key={tag} />
          ))}
        </div>
        <div className="dashed-line" />
        <div className={`action-card-description action-card-description-${LANGUAGE}`}>
          <Description description={card.parsedDescription} />
        </div>
        {card.children.length > 0 && <Children children={card.children} />}
      </div>
      <CardFace
        isLegend={card.tags.includes("GCG_TAG_LEGEND")}
        className="action-card-image-container"
        cardFace={card.cardFace}
      >
        <Cost
          type="actionCard"
          cost={
            card.playCost.length === 0
              ? [{ type: "GCG_COST_DICE_SAME", count: 0 }]
              : card.playCost
          }
        />
      </CardFace>
    </div>
  );
};

const App = () => {
  return (
    <>
      <div className="layout">
        <Character character={CHARACTER_PARSED} />
        <ActionCard card={CARD_PARSED} />
        {/* {cardsParsed.map((c) => <ActionCard card={c} />)} */}
        <div className="version-layout">
          <div className="version-text">{VERSION}</div>
          <img src={LOGO} className="logo" />
        </div>
      </div>
    </>
  );
};

interface ParsedCharacter extends CharacterRawData {
  parsedSkills: ParsedSkill[];
}
interface ParsedSkill extends SkillRawData {
  parsedDescription: ParsedDescription;
  children: ParsedChild[];
}
interface ParsedEntity extends EntityRawData {
  parsedDescription: ParsedDescription;
}
interface ParsedActionCard extends ActionCardRawData {
  parsedDescription: ParsedDescription;
  children: ParsedChild[];
}
interface ParsedKeyword extends KeywordRawData {
  parsedDescription: ParsedDescription;
}

type ParsedChild =
  | ParsedSkill
  | ParsedEntity
  | ParsedActionCard
  | ParsedKeyword;

type TokenStyle = "strong" | "light" | "dimmed";

type DescriptionToken =
  | {
      type: "plain";
      text: string;
      style: () => TokenStyle | "normal";
      color?: string;
    }
  | {
      type: "boxedKeyword";
      text: string;
    }
  | {
      type: "hiddenKeyword";
      id: number;
    }
  | {
      type: "reference";
      refType: string;
      id: number;
      overrideStyle: () => TokenStyle | undefined;
      // 手动指定天赋牌引用角色/技能的颜色
      manualColor?: string;
    }
  | {
      type: "errored";
      text: string;
    }
  | {
      type: "lineBreak";
    }
  | {
      type: "icon";
      id: number;
      overrideStyle: () => TokenStyle | undefined;
    };

type ParsedDescription = DescriptionToken[];

const DAMAGE_KEYWORD_MAP = {
  GCG_ELEMENT_PHYSIC: 100,
  GCG_ELEMENT_CRYO: 101,
  GCG_ELEMENT_HYDRO: 102,
  GCG_ELEMENT_PYRO: 103,
  GCG_ELEMENT_ELECTRO: 104,
  GCG_ELEMENT_ANEMO: 105,
  GCG_ELEMENT_GEO: 106,
  GCG_ELEMENT_DENDRO: 107,
} as Record<string, number>;

const parseDescription = (
  rawDescription: string,
  keyMap: Record<string, string> = {},
): ParsedDescription => {
  const segments = rawDescription
    .replace(/<color=#FFFFFFFF>(\$\[.*?\])<\/color>/g, "$1")
    .replace(/<color=#([0-9A-F]{8})>/g, "###COLOR#$1###")
    .replace(/<\/color>/g, "###/COLOR###")
    .replace(/[（(]/g, "###LBRACE###（")
    .replace(/[）)]/g, "）###RBRACE###")
    .replace(/(\\n)+/g, "###BR###")
    .replace(/\$\{(.*?)\}/g, (_, g1: string) => {
      return keyMap[g1] ?? "";
    })
    .replace(/\{SPRITE_PRESET#(\d+)\}/g, "###SPRITE#$1###")
    .replace(/\$\[K(3|4)\][：:](\d+)/g, "###BOXED#$1#$2###")
    .replace(/\$\[(.*?)\]/g, "###REF#$1###")
    .split("###");
  const result: DescriptionToken[] = [];
  interface ColorInfo {
    rawColor: string;
    readonly isBold: boolean;
    isConditionBold: boolean;
  }
  interface ParenthesisInfo {
    afterBr: boolean;
  }
  const colors: ColorInfo[] = [];
  const parentheses: ParenthesisInfo[] = [];
  for (const text of segments) {
    const lastToken = result[result.length - 1];
    const rootColor = colors[0];
    const rootParenthesis = parentheses[0];
    const color = rootColor?.isBold ? void 0 : rootColor?.rawColor;
    const styles = {
      overrideStyle() {
        return rootParenthesis?.afterBr
          ? "light"
          : rootColor?.isConditionBold
          ? "dimmed"
          : rootColor?.isBold
          ? "strong"
          : void 0;
      },
      style() {
        return this.overrideStyle() ?? "normal";
      },
    };
    // const when = colons.length > 0;
    if (text === "BR") {
      result.push({ type: "lineBreak" });
    } else if (text === "LBRACE") {
      parentheses.push({
        afterBr:
          lastToken?.type === "lineBreak" || lastToken?.type === "boxedKeyword",
      });
    } else if (text === "RBRACE") {
      parentheses.pop();
    } else if (text.startsWith("COLOR#")) {
      const rawColor = text.substring(5, 14);
      colors.push({
        rawColor,
        isBold: rawColor === BOLD_COLOR,
        isConditionBold: false,
      });
    } else if (text === "/COLOR") {
      const lastColor = colors.pop();
      if (
        lastToken?.type === "plain" &&
        /[:：]$/.test(lastToken.text) && //lastToken.text.endsWith("：")
        lastColor?.isBold
      ) {
        lastColor.isConditionBold = true;
      }      
    } else if (text.startsWith("REF#")) {
      const ref = text.substring(4);
      let usingKeywordId: number | null = null;
      if (ref === "D__KEY__ELEMENT") {
        const damageType = keyMap[ref];
        if (!damageType || !DAMAGE_KEYWORD_MAP[damageType]) {
          result.push({ type: "errored", text: ref });
          continue;
        }
        usingKeywordId = DAMAGE_KEYWORD_MAP[damageType];
      } else if (keyMap[ref]) {
        result.push({ type: "plain", text: keyMap[ref], ...styles });
        continue;
      } else {
        const refType = ref[0];
        let id = Number(ref.substring(1));
        let manualColor: string | undefined = undefined;
        if (refType === "K") {
          const mappedC = KEYWORD_CHILD_MAP[id];
          if (mappedC) {
            result.push({
              type: "reference",
              refType: "C",
              id: mappedC,
              manualColor,
              ...styles,
            });
          } else {
            usingKeywordId = id;
          }          
        } else {  
          if (refType === "A") {
            manualColor = KEYWORD_COLORS[100 + (Math.floor(id / 100) % 10)];
          } else if (refType === "S" && id.toString().length === 5) {
            manualColor =
              KEYWORD_COLORS[100 + Number(id.toString().slice(-4, -3))];
          }
          result.push({
            type: "reference",
            refType,
            id,
            manualColor,
            ...styles,
          });
        }
      }
      if (usingKeywordId !== null) {
        const keyword = keywords.find((e) => e.id === usingKeywordId);
        if (keyword) {
          result.push(
            { type: "hiddenKeyword", id: usingKeywordId },
            ...parseDescription(keyword.rawName).map((token) => {
              if (token.type === "plain") {
                return {
                  ...token,
                  style: () => {
                    const outerStyle = styles.style();
                    return outerStyle === "normal" ? token.style() : outerStyle;
                  },
                  color: KEYWORD_COLORS[usingKeywordId] ?? token.color,
                } as const;
              } else if (token.type === "reference" || token.type === "icon") {
                return {
                  ...token,
                  // ...styles,
                  overrideStyle: () => {
                    const outerStyle = styles.overrideStyle();
                    return outerStyle ?? token.overrideStyle();
                  },
                } as const;
              } else {
                return token;
              }
            }),
          );
        } else {
          result.push({ type: "errored", text: `#${usingKeywordId}` });
        }
      }
    } else if (text.startsWith("BOXED#")) {
      const [_, id, count] = text.split("#");
      const keywordId = Number(id);
      const { name } = keywords.find((e) => e.id === keywordId)!;
      result.push({
        type: "boxedKeyword",
        text: `${name}：${count}`,
      });
    } else if (text.startsWith("SPRITE#")) {
      const id = Number(text.substring(7));
      result.push({
        type: "icon",
        id,
        ...styles,
      });
    } else if (text) {
      result.push({
        type: "plain",
        text,
        color,
        ...styles,
      });
    }
  }
  return result;
};

const skills = [...characters, ...entities].flatMap(
  (e) => e.skills as SkillRawData[],
);
const genericEntities = [...actionCards, ...entities];

const names = new Map<number, string>(
  [...genericEntities, ...characters, ...skills].map(
    (e) => [e.id, e.name] as const,
  ),
);

const parseCharacterSkill = (
  skill: SkillRawData,
  suppressedReferencedIds: number[] = [],
): ParsedSkill => {
  const parsedDescription = parseDescription(
    skill.rawDescription,
    skill.keyMap,
  );
  suppressedReferencedIds.push(skill.id);  
  const children = appendChildren(skill, suppressedReferencedIds, true);
  return {
    ...skill,
    parsedDescription,
    children,
  };
};

const appendChildren = (
  childData: ChildData,
  suppressedReferencedIds: number[],
  childOnly = false,
): ParsedChild[] => {
  const parsedDescription = parseDescription(
    childData.rawDescription,
    "keyMap" in childData ? childData.keyMap : {},
  );
  const result: ParsedChild[] = [];
  if (!childOnly) {
    const self = {
      ...childData,
      parsedDescription,
    } as ParsedChild;
    result.push(self);

    if (
      "tags" in childData &&
      childData.tags.includes("GCG_TAG_VEHICLE") &&
      "skills" in childData
    ) {
      let moveBuffIcon = false;
      for (const skill of childData.skills) {
        if (skill.type === "GCG_SKILL_TAG_VEHICLE") {
          // @ts-expect-error
          skill.buffIcon = childData.buffIcon;
          moveBuffIcon = true;
        }
      }
      if (moveBuffIcon) {
        // @ts-expect-error
        delete self.buffIcon;
      }
    }
  }

  const children =
    childData.id in CHILDREN_CONFIG
      ? parseDescription(CHILDREN_CONFIG[childData.id])
      : parsedDescription;
  for (const child of children) {
    if (child.type === "reference") {
      if (suppressedReferencedIds.includes(child.id)) {
        continue;
      }
      suppressedReferencedIds.push(child.id);
      switch (child.refType) {
        case "S": {
          const data = skills.find((sk) => sk.id === child.id);
          if (!data) {
            continue;
          }
          result.push(...appendChildren(data, suppressedReferencedIds));
          break;
        }
        case "C": {
          const data = genericEntities
            .filter((e) => e.id === child.id)
            .reduce(
              (acc, e) => ({
                ...acc,
                ...e,
              }),
              {} as EntityRawData & ActionCardRawData,
            );
          if (!data) {
            continue;
          }
          result.push(...appendChildren(data, suppressedReferencedIds));
          break;
        }
        case "A": {
          break;
        }
      }
    } else if (
      child.type === "hiddenKeyword" &&
      shownKeywords.includes(child.id)
    ) {
      if (suppressedReferencedIds.includes(-child.id)) {
        continue;
      }
      suppressedReferencedIds.push(-child.id);
      const data = keywords.find((e) => e.id === child.id);
      if (data) {
        result.push({
          ...data,
          type: "GCG_RULE_EXPLANATION",
          parsedDescription: parseDescription(data.rawDescription),
        });
      }
    }
  }
  return result;
};

const parseCharacter = (
  data: CharacterRawData,
  supIds: number[],
): ParsedCharacter => {
  supIds.push(...data.skills.flatMap((sk) => sk.hidden ? [] : [sk.id]))
  const parsedSkills = data.skills.map((skill) =>
    parseCharacterSkill(skill, supIds),
  );
  return {
    ...data,
    parsedSkills,
  };
};

const parseActionCard = (
  data: ActionCardRawData,
  supIds: number[],
): ParsedActionCard => {
  return {
    ...data,
    parsedDescription: parseDescription(data.rawDescription),
    children: appendChildren(data, supIds, true),
  };
};

const supIds: number[] = [];
const CHARACTER = characters.find((c) => c.id === 1413)!;
const CARD = actionCards.find((c) => c.relatedCharacterId === CHARACTER.id)!;
const cards = actionCards.filter(
  (c) =>
    c.sinceVersion === "v5.6.50-beta" &&
    !(c.tags as string[]).includes("GCG_TAG_TALENT"),
);
const cardsParsed = cards.map((c) => parseActionCard(c, supIds));

const CHARACTER_PARSED = parseCharacter(CHARACTER, supIds);
const CARD_PARSED = parseActionCard(CARD, supIds);
console.log(CHARACTER_PARSED);
console.log(CARD_PARSED);
createRoot(document.getElementById("root")!).render(<App />);
