import { useCallback } from "react";
import "./style.css";
import { createRoot } from "react-dom/client";
import {
  ActionCardRawData,
  CharacterRawData,
  EntityRawData,
  KeywordRawData,
  PlayCost,
  SkillRawData,
} from "./types";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

let ninthspace = "./assets/frame/ninthspace.png";
let header_decor = "/assets/frame/header_decor.png";
let CARD_BACK_FRAME = "./assets/frame/avatar_card_frame_2.png";
let CARD_FRAME = "./assets/frame/avatar_card_frame_1.png";
let LEGEND_CARD_FRAME = "./assets/frame/avatar_card_frame_3.png";
let card_back = "./assets/UI_Gcg_CardBack_LevelReward.png";
let avatar_card_hp = "./assets/frame/icon_HP.png";
let avatar_card_energy = "./assets/frame/icon_E.png";
let title_icon = "./assets/frame/TitleIcon.png";
let tags_imgpath = ["./assets/avatar_tag/弓.png"];
let figure = "./assets/frame/figure.png";
let keyword_card_frame = "./assets/frame/keyword_card_frame.png";
let keyword_card_shadow = "./assets/frame/keyword_card_shadow.png";
let dice_readonly = "./assets/frame/read.png";

let avatar_card_face =
  "./assets/card/demo/UI_Gcg_CardFace_Char_Avatar_Sigewinne.png";
let HP = 10;
let ENERGY = 2;
let avatar_name = "希格雯";
let cardstory = "卡牌故事卡牌故事卡牌故事。";
let Normal_Attack = {
  type: "normal",
  cost: [{ type: "GCG_COST_DICE_HYDRO", count: 2 }],
  icon: "./assets/skillmask/单手剑.png",
  skill_name: "",
  richtext_description: "",
  tags_imgpath: ["./assets/keyword_tag/特技.png"],
};

// https://assets.gi-tcg.guyutongxue.site/api/v2/data/1503
const VENTI: CharacterRawData = {
  id: 1503,
  shareId: 38,
  sinceVersion: "v3.7.0",
  obtainable: true,
  name: "温迪",
  englishName: "Venti",
  tags: [
    "GCG_TAG_ELEMENT_ANEMO",
    "GCG_TAG_WEAPON_BOW",
    "GCG_TAG_NATION_MONDSTADT",
  ],
  storyTitle: "风色诗人·温迪",
  storyText:
    "「四季轮转，四风从不止息。」\n「当然啦，功劳也不是它们的，主要是我的。」\n「要是没有吟游诗人，谁去把这些传唱？」",
  skills: [
    {
      id: 15031,
      name: "神代射术",
      englishName: "Divine Marksmanship",
      type: "GCG_SKILL_TAG_A",
      rawDescription: "造成$[D__KEY__DAMAGE]点$[D__KEY__ELEMENT]。",
      description: "造成2点物理伤害。",
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
      keyMap: {
        D__KEY__ELEMENT: "GCG_ELEMENT_PHYSIC",
        D__KEY__DAMAGE: 2,
      },
      icon: "Skill_A_02",
    },
    {
      id: 15032,
      name: "高天之歌",
      englishName: "Skyward Sonnet",
      type: "GCG_SKILL_TAG_E",
      rawDescription:
        "造成$[D__KEY__DAMAGE]点$[D__KEY__ELEMENT]，生成<color=#FFFFFFFF>$[C115031]</color>。",
      description: "造成2点风元素伤害，生成风域。",
      playCost: [
        {
          type: "GCG_COST_DICE_ANEMO",
          count: 3,
        },
      ],
      targetList: [],
      keyMap: {
        D__KEY__ELEMENT: "GCG_ELEMENT_ANEMO",
        D__KEY__DAMAGE: 2,
      },
      icon: "Skill_S_Venti_01",
    },
    {
      id: 15033,
      name: "风神之诗",
      englishName: "Wind's Grand Ode",
      type: "GCG_SKILL_TAG_Q",
      rawDescription:
        "造成$[D__KEY__DAMAGE]点$[D__KEY__ELEMENT]，召唤<color=#FFFFFFFF>$[C115034]</color>。",
      description: "造成2点风元素伤害，召唤暴风之眼。",
      playCost: [
        {
          type: "GCG_COST_DICE_ANEMO",
          count: 3,
        },
        {
          type: "GCG_COST_ENERGY",
          count: 2,
        },
      ],
      targetList: [],
      keyMap: {
        D__KEY__ELEMENT: "GCG_ELEMENT_ANEMO",
        D__KEY__DAMAGE: 2,
      },
      icon: "Skill_E_Venti_01_HD",
    },
  ],
  hp: 12,
  maxEnergy: 2,
  cardFace: "UI_Gcg_CardFace_Char_Avatar_Venti",
  icon: "UI_Gcg_Char_AvatarIcon_Venti",
  category: "characters",
};

let talent = {
  card_face: "./assets/card/demo/UI_Gcg_History_Event_Event_JifengLong.png",
  card_name: "香香软软小蛋糕",
  cost: [{ type: "GCG_COST_ENERGY", count: 2 }],
  skill_name: "音火锻淬",
  richtext_description:
    "造成2点$e[物理伤害,48]。若自身附属$c[夜魂加持,key]，则恢复1点$c[「夜魂值」,key]。",
  tags: ["GCG_TAG_RESONANCE"],
  child: [
    {
      box_type: "text",
      id: 1,
      name: "音火锻淬",
      tags: ["GCG_TAG_VEHICLE"],
      cost: [
        {
          type: "GCG_COST_ENERGY",
          count: 2,
        },
      ],
      cost_readonly: false,
      richtext_description:
        "造成2点$e[物理伤害,48]。若自身附属$c[夜魂加持,key]，则恢复1点$c[「夜魂值」,key]。",
    },
    {
      name: "222",
      box_type: "card",
      id: 2,
      tags: ["GCG_TAG_FOOD"],
      card_face: "./assets/card/demo/UI_Gcg_History_Event_Event_JifengLong.png",
      icon: "./assets/skillmask/单手剑.png",
      cost: [
        {
          type: "GCG_COST_ENERGY",
          count: 2,
        },
      ],
      cost_readonly: false,
      richtext_description:
        "造成2点$e[物理伤害,48]。若自身附属$c[夜魂加持,key]，则恢复1点$c[「夜魂值」,key]。",
    },
  ],
};

let version;

let base_left = 504;
let base_top = 241;
let tag_base_x = 759;
let tag_base_y = 428;
let row;
let col;
let divider_y;

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
} as Record<string, string>;

const CARD_TAG_TEXT_MAP = {
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
  GCG_TAG_FOOD: "食物",
  GCG_TAG_RESONANCE: "元素共鸣",
  GCG_TAG_PLACE: "场地",
  GCG_TAG_ALLY: "伙伴",
  GCG_TAG_ITEM: "道具",
} as Record<string, string>;

const CARD_TAG_IMG_NAME_MAP = {
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
  GCG_TAG_WEAPON_POLE: "Weapon_Pole",
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
} as Record<string, string>;

const SKILL_TYPE_TEXT_MAP = {
  GCG_SKILL_TAG_A: "普通攻击",
  GCG_SKILL_TAG_E: "元素战技",
  GCG_SKILL_TAG_Q: "元素爆发",
  GCG_SKILL_TAG_PASSIVE: "被动技能",
} as Record<string, string>;

const diceImageUrl = (type: string) =>
  `/assets/UI_Gcg_DiceL_${COST_TYPE_IMG_NAME_MAP[type]}_Glow_HD.png`;

const tagImageUrl = (tag: string) =>
  `/assets/UI_Gcg_Tag_${CARD_TAG_IMG_NAME_MAP[tag]}.png`;

const cardFaceUrl = (cardFace: string) =>
  `https://assets.gi-tcg.guyutongxue.site/assets/${cardFace}.webp`;

type TagType = "character" | "cardType" | "cardTag";

const Tag = (props: { type: TagType; tag: string; className?: string }) => {
  return (
    <div className={`tag ${props.className ?? ""}`} data-tag-type={props.type}>
      <div className="tag-icon-container">
        <div
          className="tag-icon"
          style={{ "--image": `url("${tagImageUrl(props.tag)}")` }}
        />
      </div>
      <div className="tag-text">{CARD_TAG_TEXT_MAP[props.tag]}</div>
    </div>
  );
};

const KeywordTag = (props: {
  tag: string;
  image?: string;
  className?: string;
}) => {
  // TODO
  return (
    <div className={`keyword-tag ${props.className ?? ""}`}>
      <div className="keyword-tag-icon-container">
        {props.image ? (
          <img className="keyword-tag-image" src={cardFaceUrl(props.image)} />
        ) : (
          <div
            className="tag-icon"
            style={{ "--image": `url("${tagImageUrl(props.tag)}")` }}
          />
        )}
      </div>
      <div className="keyword-tag-text">{CARD_TAG_TEXT_MAP[props.tag]}</div>
    </div>
  );
};

const Cost = (props: { cost: PlayCost[] }) => {
  return props.cost.map(({ type, count }, i) => (
    <div style={{ position: "absolute", top: 16, right: 115 + i * 80 }}>
      <img src={diceImageUrl(type)} className="dice-icon" />
      <div className="dice-count-outline">{count}</div>
      <div className="dice-count">{count}</div>
    </div>
  ));
};

const KeywordCost = (props: { readonly: boolean; cost: PlayCost[] }) => {
  return props.cost.map(({ type, count }, i) => (
    <div
      style={{
        position: "absolute",
        top: 16,
        right: 105 + i * 80,
      }}
    >
      <img src={diceImageUrl(type)} className="dice-icon" />
      {props.readonly && <img src={dice_readonly} className="dice-readonly" />}
      <div className="dice-count-outline">{count}</div>
      <div className="dice-count">{count}</div>
    </div>
  ));
};

const ActionCost = (props: { cost: PlayCost[] }) => {
  return props.cost.map(({ type, count }, i) => (
    <div
      style={{
        position: "absolute",
        top: 3 + i * 124,
        left: 2 + i * 6,
      }}
    >
      <img src={diceImageUrl(type)} className="actioncard-cost-dice" />
      <div className="actioncard-cost-text-styled-outline">{count}</div>
      <div className="actioncard-cost-text-styled">{count}</div>
    </div>
  ));
};

type ChildData = EntityRawData | KeywordRawData | ActionCardRawData;

const C115031: EntityRawData = {
  id: 115031,
  type: "GCG_CARD_ONSTAGE",
  name: "风域",
  englishName: "Stormzone",
  tags: [],
  skills: [],
  rawDescription:
    "<color=#FFFFFFFF>我方执行「切换角色」行动时：</color>少花费1个元素骰。\\n<color=#FFFFFFFF>$[K3]：2</color>",
  description: "我方执行「切换角色」行动时：少花费1个元素骰。\n可用次数：2",
  shownToken: "GCG_TOKEN_LIFE",
  hidden: false,
  buffIcon: "UI_Gcg_Buff_Common_Special",
  buffIconHash: "13225239691945994096",
  // category: "entities",
};

const C116102: ActionCardRawData = {
  id: 116102,
  obtainable: false,
  type: "GCG_CARD_MODIFY",
  name: "冲天转转",
  englishName: "Turbo Twirly",
  tags: ["GCG_TAG_VEHICLE"],
  targetList: [],
  relatedCharacterId: null,
  relatedCharacterTags: [],
  playCost: [],
  rawDescription:
    "<color=#FFFFFFFF>附属角色切换至后台时：</color>消耗1点夜魂值，召唤<color=#FFFFFFFF>$[C116103]</color>。\\n$[K58]：$[S1161021]\\n（角色最多装备1个「{SPRITE_PRESET#3008}特技」）\\n所附属角色<color=#FFFFFFFF>「夜魂值」</color>为0时，弃置此牌；此牌被弃置时，所附属角色结束<color=#FFFFFFFF>$[C116104]</color>。",
  description:
    "附属角色切换至后台时：消耗1点夜魂值，召唤冲天转转·脱离。\n特技：转转冲击\n（角色最多装备1个「特技」）\n所附属角色「夜魂值」为0时，弃置此牌；此牌被弃置时，所附属角色结束夜魂加持。",
  cardFace: "UI_Gcg_CardFace_Summon_Kachina",
  // category: "action_cards",
};

const Children = ({ children }: { children: ChildData[] }) => {
  return (
    <div className="child-layout">
      {children.map((keyword) => (
        // <!-- 带卡图 -->

        <div className="keyword-box-wrapper">
          {/* <!-- 卡图 --> */}
          {"cardFace" in keyword && keyword.cardFace && (
            <div className="keyword-card">
              <img src={keyword_card_frame} className="keyword-card-frame" />
              <img
                src={cardFaceUrl(keyword.cardFace)}
                className="keyword-card-face"
              />
              <img src={keyword_card_shadow} className="keyword-card-shadow" />
            </div>
          )}
          {/* <!-- 文本框 --> */}
          <div className="keyword-box">
            {/* <!-- name --> */}
            <div className="keyword-title">{keyword.name}</div>
            <div className="keyword-tags">
              <KeywordTag
                tag={"type" in keyword ? keyword.type : "GCG_RULE_EXPLANATION"}
                image={"buffIcon" in keyword ? keyword.buffIcon : void 0}
              />
              {"tags" in keyword &&
                keyword.tags.map((tag) => <KeywordTag tag={tag} />)}
            </div>
            {"playCost" in keyword && (
              <KeywordCost
                cost={keyword.playCost}
                readonly={keyword.type !== "GCG_CARD_EVENT"}
              />
            )}
            {/* <!-- description --> */}
            <div className="keyword-description">
              {keyword.rawDescription}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SkillBox = ({ skill }: { skill: SkillRawData }) => {
  const children: ChildData[] =
    skill.type === "GCG_SKILL_TAG_Q"
      ? [C115031]
      : skill.type === "GCG_SKILL_TAG_E"
      ? [C116102]
      : [];
  return (
    <div className="skill-box">
      {/* <!-- leaves --> */}
      <div className="leaves-box"></div>
      {/* <!-- skill type --> */}
      <div className="skilltype-text-style">
        {SKILL_TYPE_TEXT_MAP[skill.type]}
      </div>
      {/* <!-- figure --> */}
      <img src={figure} className="figure-icon" />
      {/* <!-- cost --> */}
      {skill.playCost && <Cost cost={skill.playCost} />}
      {/* <!-- skill icon --> */}
      <div
        className="skill-icon"
        style={{
          maskImage: `url("https://assets.gi-tcg.guyutongxue.site/assets/${skill.icon}.webp")`,
        }}
      ></div>
      {/* <!-- skill name --> */}
      <div className="skill-title">{skill.name}</div>
      {/* <!-- skill description --> */}
      <div className="description">{skill.rawDescription}</div>
      {/* <!-- child --> */}
      {children && <Children children={children} />}
    </div>
  );
};

const cardFrameImgUrl = "/assets/frame/card_frame_normal.png";

const Character = ({ character }: { character: CharacterRawData }) => {
  const [normalSkill, ...otherSkills] = character.skills;
  return (
    <>
      <div className="character-header">
        <div className="character-image-container">
          {/* <!-- 角色牌牌背 --> */}
          <img src={card_back} className="card-back" />
          <img src={CARD_BACK_FRAME} className="card-frame-shadow" />
          {/* <!-- 角色牌牌面 --> */}
          <div className="card-face">
            <img
              src={cardFaceUrl(character.cardFace)}
              className="card-face-image"
            />
            <img src={cardFrameImgUrl} className="card-frame" />
            <div className="avatar-card-hp">
              <img src={avatar_card_hp} className="avatar-card-hp-image" />
              <div className="hp-text-styled-2">{HP}</div>
              <div className="hp-text-styled-1">{HP}</div>˝
            </div>
            {/* <!-- 能量 --> */}
            <div className="energy-bar">
              {Array.from({ length: ENERGY }).map((_, i) => (
                <img
                  src={avatar_card_energy}
                  className="energy"
                  style={{
                    top: base_top + i * 74,
                    left: base_left + i * 3,
                  }}
                />
              ))}
            </div>
          </div>
          {/* <!-- 牌背边框 --> */}

          {/* <!-- 生命值 --> */}
        </div>

        <div className="character-info">
          {/* <!-- 角色名 --> */}
          <div className="character-title-wrapper">
            <div
              className="character-title"
              style={{
                backgroundImage: `url(${title_icon})`,
              }}
            >
              {character.name}
            </div>
          </div>

          <div className="character-tags">
            {character.tags.map((tag) => (
              <Tag type="character" tag={tag} />
            ))}
          </div>

          {/* // <!-- 分隔线 --> */}
          {/* {% set total_rows = ((tags|length - 1) // 3) + 1 %}
      {% set divider_y = tag_base_y + total_rows * 80 %} */}
          <hr className="info-divider" />

          {/* <!-- 卡牌故事 --> */}
          <p className="info-story">{character.storyText}</p>

          <div className="spacer"></div>

          {/* <!-- 普通攻击 --> */}
          <SkillBox skill={normalSkill} />
        </div>
      </div>
      {otherSkills.map((skill) => (
        <SkillBox skill={skill} />
      ))}
    </>
  );
};

const App = () => {
  return (
    <>
      <div
        className="layout"
        style={{ "--header-decoration": `url("${header_decor}")` }}
      >
        <Character character={VENTI} />
        {/* <!-- 天赋牌 --> */}
        <div className="actioncard-layout-right">
          {/* <!-- 卡面 --> */}
          <div className="actioncard-image-box-right">
            {/* <!-- 牌背 --> */}
            <img src={card_back} className="action-card-back" />
            {/* <!-- 牌背边框 --> */}
            <img src={CARD_BACK_FRAME} className="action-card-frame-2" />
            {/* <!-- 牌面 --> */}
            <img src={talent.card_face} className="action-card-face" />
            {/* <!-- 牌面边框 --> */}
            {talent.cost.find(({ type }) => type === "GCG_COST_LEGEND") ? (
              // <!-- 秘传边框 -->
              <img src={LEGEND_CARD_FRAME} className="action-card-frame-1" />
            ) : (
              // <!-- 普通边框 -->
              <img src={CARD_FRAME} className="action-card-frame-1" />
            )}
            {/* <!-- 费用 --> */}
            <ActionCost cost={talent.cost} />
          </div>
          {/* <!-- 描述卡 --> */}
          <div className="actioncard-text-box">
            {/* <!-- figure --> */}
            <img src={figure} className="figure-icon" />
            {/* <!-- card name --> */}
            <div className="actioncard-name-text-style">{talent.card_name}</div>
            {/* <!-- card tag --> */}
            <div className="actioncard-tags-box">
              {talent.tags.map((tag) => (
                <Tag type="cardTag" tag={tag} />
              ))}
            </div>
            {/* <!-- 虚线 --> */}
            <div className="dashed-line"></div>
            {/* <!-- card description --> */}
            <div className="description">
              {talent.richtext_description}
            </div>
            {/* <!-- child --> */}
            {talent.child && (
              <div className="actioncard-child-layout">
                {talent.child.map(
                  (keyword) =>
                    // <!-- 带卡图 -->

                    (keyword.box_type == "card" && (
                      <div className="actioncard-child-box" key="id">
                        {/* <!-- 卡图 --> */}
                        <img
                          src={keyword_card_frame}
                          className="keyword-card-frame"
                        />
                        <img
                          src={keyword.card_face}
                          className="keyword-card-face"
                        />
                        <img
                          src={keyword_card_shadow}
                          className="keyword-card-shadow"
                        />
                        <div className="keyword-card-corner"></div>
                        {/* <!-- 文本框 --> */}
                        <div className="actioncard-keyword-card-box">
                          {/* <!-- name --> */}
                          <div className="keyword-sign"></div>
                          <div className="keyword-name-text-style">
                            {keyword.name}
                          </div>
                          {/* <!-- tag --> */}
                          <div className="keyword-tags-box">
                            {keyword.tags.map((tag) => (
                              <KeywordTag tag={tag} />
                            ))}
                          </div>
                          <KeywordCost
                            cost={keyword.cost}
                            readonly={keyword.cost_readonly}
                          />
                          {/* <!-- description --> */}
                          <div className="keyword-description">
                            {keyword.richtext_description}
                          </div>
                        </div>
                      </div>
                    )) ||
                    // <!-- 不带卡图 -->
                    (keyword.box_type == "text" && (
                      <div className="actioncard-child-box">
                        {/* <!-- 文本框 --> */}
                        <div className="actioncard-keyword-text-box">
                          {/* <!-- name --> */}
                          <div className="keyword-sign"></div>
                          <div className="keyword-name-text-style">
                            {keyword.name}
                          </div>
                          {/* <!-- tag --> */}
                          <div className="keyword-tags-box">
                            {keyword.tags.map((tag) => (
                              <KeywordTag tag={tag} />
                            ))}
                          </div>
                          {/* <!-- cost --> */}
                          <KeywordCost
                            cost={keyword.cost}
                            readonly={keyword.cost_readonly}
                          />

                          {/* <!-- description --> */}
                          <div className="keyword-description">
                            {keyword.richtext_description}
                          </div>
                        </div>
                      </div>
                    )),
                )}
              </div>
            )}
          </div>
        </div>
        <div className="version-layout">
          <div className="version-text-box">
            <div className="version-text-style">{version}</div>
          </div>
          <img src={ninthspace} className="version-ninthspace" />
        </div>
      </div>
    </>
  );
};

createRoot(document.getElementById("root")).render(<App />);
