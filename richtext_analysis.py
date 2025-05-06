# richtext_analysis
# Cherry_C9H13N created on 2025/5/2
import re

# 颜色名称查找表
COLOR_MAP = {
    "物理": "#d9b253",
    "火": "#d6684b",
    "水": "#488ccb",
    "冰": "#63bacd",
    "雷": "#917ce8",
    "草": "#88b750",
    "风": "#5ca8a6",
    "岩": "#d29d5d",
    "充能": "#d8b456",
    "key": "#aa8d76",
    "dark": "#716864",
    "light": "#9d918c",
    "bright": "#fefef4",
}

# 文本 → 图标名 → 颜色
ICON_MAP = {
    "物理伤害": ("dmg_phys", "物理"),
    "冰元素伤害": ("dmg_ice", "冰"),
    "水元素伤害": ("dmg_water", "水"),
    "火元素伤害": ("dmg_fire", "火"),
    "雷元素伤害": ("dmg_elec", "雷"),
    "草元素伤害": ("dmg_grass", "草"),
    "风元素伤害": ("dmg_wind", "风"),
    "岩元素伤害": ("dmg_rock", "岩"),
    "充能": ("energy", "充能"),
    "护盾": ("shield", None),
    "万能元素": ("die_all", None),
    "无色元素": ("die_any", None),
    "冰元素骰": ("die_ice", None),
    "水元素骰": ("die_water", None),
    "火元素骰": ("die_fire", None),
    "雷元素骰": ("die_elec", None),
    "草元素骰": ("die_grass", None),
    "风元素骰": ("die_wind", None),
    "岩元素骰": ("die_rock", None),
}

# 提示词 → 图标名
MASK_MAP = {'丘丘人': '丘丘人',
            '伙伴': '伙伴',
            '元素共鸣': '元素共鸣',
            '其他武器': '其他武器',
            '单手剑': '单手剑',
            '双手剑': '双手剑',
            '圣遗物': '圣遗物',
            '圣骸兽': '圣骸兽',
            '场地': '场地',
            '天赋': '天赋',
            '弓箭': '弓箭',
            '愚人众': '愚人众',
            '战斗行动': '战斗行动',
            '料理': '料理',
            '枫丹': '枫丹',
            '武器': '武器',
            '法器': '法器',
            '海乱鬼': '海乱鬼',
            '特技': '特技',
            '璃月': '璃月',
            '秘传': '秘传',
            '稻妻': '稻妻',
            '纳塔': '纳塔',
            '芒性': '芒性',
            '荒性': '荒性',
            '蒙德': '蒙德',
            '道具': '道具',
            '镀金旅团': '镀金旅团',
            '长柄武器': '长柄武器',
            '须弥': '须弥',
            '魔物': '魔物'}


# type → class 样式
STYLE_MAP = {
    "light24": "rich-text-style-highlight-light24",
    "dark22": "rich-text-style-highlight-dark22",
}


def richtext(text: str) -> str:
    # 1. $e[文本,大小]
    def replace_e(match):
        label, size = match.groups()
        filename, colorname = ICON_MAP.get(label, ("unknown", None))  # 注意 colorname 可能为 None
        img_tag = (
            f"<img src='./assets/icon/{filename}.png' class='rich-text-icon' "
            f"style='width: {size}px'>"
        )
        if colorname:
            color = COLOR_MAP.get(colorname, "#ff0000")
            if color:
                return f"{img_tag}<span style='color: {color};'>{label}</span>"
        return f"{img_tag}<span>{label}</span>"

    # 2. $m[提示词,大小,颜色名]
    def replace_m(match):
        label, size, colorname = match.groups()
        filename = MASK_MAP.get(label, "unknown")
        color = COLOR_MAP.get(colorname, "#ff0000")
        return (
            f"<span class='rich-text-mask' style='width: {size}px; height: {size}px; "
            f"background-color: {color}; "
            f"-webkit-mask-image: url(./assets/iconmask/{filename}.png); "
            f"mask-image: url(./assets/iconmask/{filename}.png);'></span>"
        )

    # 3. $c[文本,颜色名]
    def replace_c(match):
        label, colorname = match.groups()
        color = COLOR_MAP.get(colorname, "#ff0000")
        return f"<span style='color: {color};'>{label}</span>"

    # 4. $h[文本,type]
    def replace_h(match):
        label, t = match.groups()
        class_name = STYLE_MAP.get(t, "rich-text-style-highlight-light24")
        return f"<span class='{class_name}'>{label}</span>"

    # 替换顺序非常重要
    text = re.sub(r"\$e\[(.*?),(.*?)\]", replace_e, text)
    text = re.sub(r"\$m\[(.*?),(.*?),(.*?)\]", replace_m, text)
    text = re.sub(r"\$c\[(.*?),(.*?)\]", replace_c, text)
    text = re.sub(r"\$h\[(.*?),(.*?)\]", replace_h, text)

    return text
