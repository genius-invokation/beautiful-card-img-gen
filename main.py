# main
# Cherry_C9H13N created on 2025/5/2
import os
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from jinja2 import Environment, FileSystemLoader
import time
from richtext_analysis import richtext


# 加载数据
with open('./demo/card.json', 'r', encoding='utf-8') as f:
    data = json.load(f)


def to_uri(val):
    # return Path(val).resolve().as_uri() if val else None
    return "./" + val if val else None


data["ninthspace"] = "./assets/frame/ninthspace.png"
data["header_decor"] = "./assets/frame/header_decor.png"
data["avatar_card_frame_2"] = "./assets/frame/avatar_card_frame_2.png"
data["avatar_card_frame_1"] = "./assets/frame/avatar_card_frame_1.png"
data["avatar_card_frame_3"] = "./assets/frame/avatar_card_frame_3.png"
data["card_back"] = "./assets/frame/大赤沙海·长夜.png"
data["avatar_card_hp"] = "./assets/frame/icon_HP.png"
data["avatar_card_energy"] = "./assets/frame/icon_E.png"
data["title_icon"] = "./assets/frame/TitleIcon.png"
data["tags_imgpath"] = [f"./assets/avatar_tag/{p}.png" for p in data.get("tags", [])]
data["figure"] = "./assets/frame/figure.png"
data["keyword_card_frame"] = "./assets/frame/keyword_card_frame.png"
data["keyword_card_shadow"] = "./assets/frame/keyword_card_shadow.png"
data["dice_readonly"] = "./assets/frame/read.png"
data["Normal_Attack"]["richtext_description"] = richtext(data["Normal_Attack"]["description"])
data["Normal_Attack"]["cost"] = [{"type": p['type'], "icon": f"./assets/dice/{p['type']}.png", "count": p['count']} for p in data["Normal_Attack"].get("cost", [])]
data["Normal_Attack"]["icon"] = f"./assets/skillmask/{data['Normal_Attack']['icon']}.png"

for skill in data["skill_list"]:
    skill["richtext_description"] = richtext(skill["description"])
    skill["cost"] = [{"type": p['type'], "icon": f"./assets/dice/{p['type']}.png", "count": p['count']} for p in skill.get("cost", [])]
    if "child" in skill:
        for keyword in skill["child"]:
            keyword["tags_imgpath"] = [f"./assets/keyword_tag/{p}.png" for p in keyword.get("tags", [])]
            keyword["richtext_description"] = richtext(keyword["description"])
            if "cost" in keyword:
                keyword["cost"] = [{"type": p['type'], "icon": f"./assets/dice/{p['type']}.png", "count": p['count']} for p in keyword.get("cost", [])]

data["talent"]["richtext_description"] = richtext(data["talent"]["description"])
data["talent"]["tags_imgpath"] = [f"./assets/action_tag/{p}.png" for p in data["talent"].get("tags", [])]
data["talent"]["cost"] = [{"type": p['type'], "icon": f"./assets/diceHD/{p['type']}.png", "count": p['count']} for p in data["talent"].get("cost", [])]
if "child" in data["talent"]:
    for keyword in data["talent"]["child"]:
        keyword["tags_imgpath"] = [f"./assets/keyword_tag/{p}.png" for p in keyword.get("tags", [])]
        keyword["richtext_description"] = richtext(keyword["description"])
        if "cost" in keyword:
            keyword["cost"] = [{"type": p['type'], "icon": f"./assets/dice/{p['type']}.png", "count": p['count']} for p in keyword.get("cost", [])]

# 渲染 HTML
env = Environment(loader=FileSystemLoader('.'))
template = env.get_template("./avatarcard.html")

html_content = template.render(**data)

# 保存 HTML
with open("./demo_rendered.html", "w", encoding='utf-8') as f:
    f.write(html_content)

# 截图
options = Options()
options.add_argument("--headless")
options.add_argument("--hide-scrollbars")
options.add_argument("--force-device-scale-factor=1")  # 重要：防止缩放影响截图尺寸
options.add_argument("--window-size=1712,100")  # 初始小窗口
driver = webdriver.Chrome(options=options)

# 加载页面
driver.get("http://localhost:8000/demo_rendered.html")
time.sleep(1.5)  # 确保所有图片加载完成

# 获取真实页面高度（考虑所有加载完）
scroll_height = driver.execute_script(
    "return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)")
driver.set_window_size(1730, int(scroll_height * 1.048))
time.sleep(0.5)

# 再次确认高度更新后截图
driver.save_screenshot("./demo/output.png")
driver.quit()

