import "./style.css";
import { createRoot } from "react-dom/client";
import {
  ActionCardRawData,
  actionCards,
  CharacterRawData,
  characters,
  entities,
  EntityRawData,
  KeywordRawData,
  keywords,
  PlayCost,
  SkillRawData,
} from "@gi-tcg/static-data";


const VERSION = "GYTX";
const CARD_BACK_IMAGE = "./assets/UI_Gcg_CardBack_LevelReward.png";

const shownKeywords = [7];

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

const ninthspace = "./assets/frame/ninthspace.png";
const CARD_BACK_FRAME = "/assets/frame/avatar_card_frame_2.png";
const CARD_NORMAL_FRAME = "/assets/frame/card_frame_normal.png";
const CARD_LEGEND_FRAME = "/assets/frame/card_frame_legend.png";
const avatar_card_hp = "./assets/frame/icon_HP.png";
const avatar_card_energy = "./assets/frame/icon_E.png";
const keyword_card_frame = "./assets/frame/keyword_card_frame.png";
const keyword_card_shadow = "./assets/frame/keyword_card_shadow.png";

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

const TYPE_TAG_TEXT_MAP = {
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
  GCG_TAG_FOOD: "食物",
  GCG_TAG_RESONANCE: "元素共鸣",
  GCG_TAG_PLACE: "场地",
  GCG_TAG_ALLY: "伙伴",
  GCG_TAG_ITEM: "道具",
} as Record<string, string>;

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
} as Record<string, string>;

const diceImageUrl = (type: string) =>
  `/assets/UI_Gcg_DiceL_${COST_TYPE_IMG_NAME_MAP[type]}_Glow_HD.png`;

const tagImageUrl = (tag: string) =>
  `/assets/UI_Gcg_Tag_${TYPE_TAG_IMG_NAME_MAP[tag]}.png`;

const cardFaceUrl = (cardFace: string) =>
  `https://assets.gi-tcg.guyutongxue.site/assets/${cardFace}.webp`;

const PREPEND_ICONS = {
  6: cardFaceUrl(`UI_Gcg_Buff_Common_Shield`),
  100: cardFaceUrl("UI_Gcg_Buff_Common_Element_Physics"),
  101: cardFaceUrl("UI_Gcg_Buff_Common_Element_Ice"),
  102: cardFaceUrl("UI_Gcg_Buff_Common_Element_Water"),
  103: cardFaceUrl("UI_Gcg_Buff_Common_Element_Fire"),
  104: cardFaceUrl("UI_Gcg_Buff_Common_Element_Electric"),
  105: cardFaceUrl("UI_Gcg_Buff_Common_Element_Wind"),
  106: cardFaceUrl("UI_Gcg_Buff_Common_Element_Rock"),
  107: cardFaceUrl("UI_Gcg_Buff_Common_Element_Grass"),
  301: `/assets/UI_Gcg_DiceL_Ice.png`,
  302: `/assets/UI_Gcg_DiceL_Water.png`,
  303: `/assets/UI_Gcg_DiceL_Fire.png`,
  304: `/assets/UI_Gcg_DiceL_Electric.png`,
  305: `/assets/UI_Gcg_DiceL_Wind.png`,
  306: `/assets/UI_Gcg_DiceL_Rock.png`,
  307: `/assets/UI_Gcg_DiceL_Grass.png`,
  308: `/assets/UI_Gcg_DiceL_Same.png`,
  309: `/assets/UI_Gcg_DiceL_Diff.png`,
  310: `/assets/UI_Gcg_DiceL_Energy_Glow_HD.png`,
  411: `/assets/UI_Gcg_DiceL_Any.png`,
} as Record<number, string>;

const KEYWORD_COLORS = {
  101: "#91d5ff",
  102: "#1890ff",
  103: "#f5222d",
  104: "#722ed1",
  105: "#36cfc9",
  106: "#d4b106",
  107: "#52c41a",
  301: "#91d5ff",
  302: "#1890ff",
  303: "#f5222d",
  304: "#722ed1",
  305: "#36cfc9",
  306: "#d4b106",
  307: "#52c41a",
} as Record<number, string>;

type TagType = "character" | "cardType" | "cardTag";

const Tag = (props: { type: TagType; tag: string; className?: string }) => {
  return (
    TYPE_TAG_TEXT_MAP[props.tag] && (
      <div
        className={`tag ${props.className ?? ""}`}
        data-tag-type={props.type}
      >
        <div className="tag-icon-container">
          <div
            className="tag-icon"
            style={{ "--image": `url("${tagImageUrl(props.tag)}")` }}
          />
        </div>
        <div className="tag-text">{TYPE_TAG_TEXT_MAP[props.tag]}</div>
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
    TYPE_TAG_TEXT_MAP[props.tag] && (
      <div className={`keyword-tag ${props.className ?? ""}`}>
        {(props.image || TYPE_TAG_IMG_NAME_MAP[props.tag]) && (
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
        )}
        <div className="keyword-tag-text">{TYPE_TAG_TEXT_MAP[props.tag]}</div>
      </div>
    )
  );
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
        <div className="cost" data-readonly={props.readonly}>
          <img src={diceImageUrl(type)} className={diceClassName} />
          <div className="stroked-text-top">{count}</div>
          <div className="stroked-text-bottom">{count}</div>
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

const Token = ({ token }: { token: DescriptionToken }) => {
  switch (token.type) {
    case "plain":
      return <span className={`description-${token.style}`}>{token.text}</span>;
    case "keyword": {
      const name = keywordNames.get(token.id) ?? `#${token.id}`;
      if (token.boxedWithPostfix) {
        return (
          <span className="description-variable">
            {name}
            {token.boxedWithPostfix && (
              <span className="keyword-boxed">{token.boxedWithPostfix}</span>
            )}
          </span>
        );
      } else {
        return (
          <>
            {PREPEND_ICONS[token.id] && (
              <img
                className="description-keyword-icon"
                src={PREPEND_ICONS[token.id]}
              />
            )}
            <span
              className="description-keyword"
              style={{ "--color": KEYWORD_COLORS[token.id] }}
            >
              {name}
            </span>
          </>
        );
      }
    }
    case "reference":
      return (
        <span className="description-reference">
          {names.get(token.id) ?? `#${token.id}`}
        </span>
      );
    case "lineBreak":
      return <br />;
    case "errored":
      return <span className="description-errored">{token.text}</span>;
  }
};

const Description = ({ description }: { description: ParsedDescription }) => {
  return (
    <>
      {description.map((token) => (
        <Token token={token} />
      ))}
    </>
  );
};

const Children = ({ children }: { children: ParsedChild[] }) => {
  return (
    <div className="child-layout">
      {children.map((keyword) => (
        <div className="keyword-box-wrapper">
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
          <div className="keyword-box">
            <div className="keyword-title">{keyword.name}</div>
            <div className="keyword-tags">
              <KeywordTag
                tag={"type" in keyword ? keyword.type : "GCG_RULE_EXPLANATION"}
                image={"buffIcon" in keyword ? keyword.buffIcon : void 0}
              />
              {"tags" in keyword &&
                keyword.tags.map((tag) => <KeywordTag tag={tag} key={tag} />)}
            </div>
            {"playCost" in keyword && (
              <Cost
                type="keyword"
                cost={
                  keyword.playCost.length === 0
                    ? [{ type: "GCG_COST_DICE_SAME", count: 0 }]
                    : keyword.playCost
                }
                readonly={keyword.type === "GCG_CARD_MODIFY"}
              />
            )}
            <div className="keyword-description">
              <Description description={keyword.parsedDescription} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SkillBox = ({ skill }: { skill: ParsedSkill }) => {
  return (
    <div className="skill-box figure" key={skill.id}>
      <div className="skill-type">{TYPE_TAG_TEXT_MAP[skill.type]}</div>
      {skill.playCost && <Cost type="skill" cost={skill.playCost} />}
      <div
        className="skill-icon"
        style={{
          maskImage: `url("https://assets.gi-tcg.guyutongxue.site/assets/${skill.icon}.webp")`,
        }}
      ></div>
      <div className="skill-title">{skill.name}</div>
      <div className="description">
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
              <img src={avatar_card_energy} className="energy" />
            ))}
          </div>
        </CardFace>
        <div className="character-info">
          <div className="character-title-wrapper">
            <div className="character-title">{character.name}</div>
          </div>
          <div className="character-tags">
            {character.tags.map((tag) => (
              <Tag type="character" tag={tag} key={tag} />
            ))}
          </div>
          <hr className="info-divider" />
          <p className="info-story">{character.storyText}</p>
          <div className="spacer"></div>
          <SkillBox skill={normalSkill} />
        </div>
      </div>
      {otherSkills.map((skill) => (
        <SkillBox skill={skill} />
      ))}
    </div>
  );
};

const ActionCard = ({ card }: { card: ParsedActionCard }) => {
  return (
    <div className="action-card">
      <CardFace
        className="action-card-image-container"
        cardFace={card.cardFace}
      >
        <Cost type="actionCard" cost={card.playCost} />
      </CardFace>
      <div className="action-card-info figure">
        <div className="action-card-title">{card.name}</div>
        <div className="action-card-tags">
          <Tag type="cardType" tag={card.type} />
          {card.tags.map((tag) => (
            <Tag type="cardTag" tag={tag} key={tag} />
          ))}
        </div>
        <div className="dashed-line" />
        <div className="description">
          <Description description={card.parsedDescription} />
        </div>
        {card.children.length > 0 && <Children children={card.children} />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <>
      <div className="layout">
        <Character character={CHARACTER_PARSED} />
        <ActionCard card={CARD_PARSED} />
        <div className="version-layout">
          <div className="version-text">{VERSION}</div>
          <img src={ninthspace} className="ninthspace" />
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

type DescriptionToken =
  | {
      type: "plain";
      text: string;
      style: "strong" | "normal" | "light";
    }
  | {
      type: "keyword";
      id: number;
      boxedWithPostfix?: string;
    }
  | {
      type: "reference";
      refType: string;
      id: number;
    }
  | {
      type: "errored";
      text: string;
    }
  | {
      type: "lineBreak";
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
  const text = rawDescription
    .replace(/<color=#([0-9A-F]{8})>/g, "###COLOR#$1###")
    .replace(/<\/color>/g, "###/COLOR###")
    .replace(/（/g, "###LBRACE###（")
    .replace(/）/g, "）###RBRACE###")
    .replace(/(\\n)+/g, "###BR###")
    .replace(/\$?\{(.*?)\}/g, (_, g1: string) => {
      return keyMap[g1] ?? "";
    });
  const segments = text.replace(/\$\[(.*?)\]/g, "###REF#$1###").split("###");
  const result: DescriptionToken[] = [];
  const referencedIds: number[] = [];
  const colors: string[] = [];
  const braces: number[] = [];
  for (const text of segments) {
    const style =
      colors.length > 0 ? "strong" : braces.length > 0 ? "light" : "normal";
    if (text === "BR") {
      result.push({ type: "lineBreak" });
    } else if (text === "LBRACE") {
      braces.push(1);
    } else if (text === "RBRACE") {
      braces.pop();
    } else if (text.startsWith("COLOR#")) {
      const color = text.substring(6, 14);
      colors.push(color);
      continue;
    } else if (text === "/COLOR") {
      colors.pop();
      continue;
    } else if (text.startsWith("REF#")) {
      const ref = text.substring(4);
      if (ref === "D__KEY__ELEMENT") {
        const damageType = keyMap[ref];
        if (!damageType || !DAMAGE_KEYWORD_MAP[damageType]) {
          result.push({ type: "errored", text: ref });
          continue;
        }
        result.push({ type: "keyword", id: DAMAGE_KEYWORD_MAP[damageType] });
        continue;
      }
      if (keyMap[ref]) {
        result.push({ type: "plain", text: keyMap[ref], style });
        continue;
      }
      const refType = ref[0];
      let id = Number(ref.substring(1));
      if (refType === "K") {
        result.push({ type: "keyword", id });
      } else {
        result.push({ type: "reference", refType, id });
      }
    } else if (text) {
      result.push({ type: "plain", text, style });
    }
  }
  for (let i = 0; i < result.length; i++) {
    const current = result[i];
    const next: DescriptionToken | undefined = result[i + 1];
    if (current.type === "keyword" && [3, 4].includes(current.id)) {
      const match = next?.type === "plain" && next.text.match(/^(：\d+)/);
      if (match) {
        current.boxedWithPostfix = match[1];
        next.text = next.text.substring(match[1].length);
        if (!next.text) {
          result.splice(i + 1, 1);
          i++;
        }
      }
    }
  }
  return result;
};

const skills = [...characters, ...entities].flatMap((e) => e.skills);
const genericEntities = [...entities, ...actionCards];

const names = new Map<number, string>(
  [...genericEntities, ...characters, ...skills].map(
    (e) => [e.id, e.name] as const,
  ),
);
const keywordNames = new Map<number, string>(
  keywords.map((e) => [e.id, e.name] as const),
);

const parseCharacterSkill = (
  skill: SkillRawData,
  suppressedReferencedIds: number[] = [],
): ParsedSkill => {
  const parsedDescription = parseDescription(
    skill.rawDescription,
    skill.keyMap,
  );
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
          result.push(...appendChildren(skill, suppressedReferencedIds));
        }
      }
      if (moveBuffIcon) {
        // @ts-expect-error
        delete self.buffIcon;
      }
    }
  }
  for (const child of parseDescription(childData.rawDescription)) {
    if (child.type === "reference") {
      if (suppressedReferencedIds.includes(child.id)) {
        continue;
      }
      suppressedReferencedIds.push(child.id);
      switch (child.refType) {
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
        case "S": {
          break;
        }
      }
    } else if (child.type === "keyword" && shownKeywords.includes(child.id)) {
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

const CHARACTER = characters.find((c) => c.id === 1503)!;
const CARD = actionCards.find((c) => c.relatedCharacterId === CHARACTER.id)!;

const supIds: number[] = [];
const CHARACTER_PARSED = parseCharacter(CHARACTER, supIds);
const CARD_PARSED = parseActionCard(CARD, supIds);
console.log(CHARACTER_PARSED);
console.log(CARD_PARSED);
createRoot(document.getElementById("root")!).render(<App />);
