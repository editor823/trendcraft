import requests
import json
import re
import sys
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding="utf-8")
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

def test_all():
    print("=== [1] YouTube 실시간 수집 테스트 ===")
    yt_url = "https://www.youtube.com/results?search_query=" + requests.utils.quote("다이소 살림꿀템")
    res = requests.get(yt_url, headers={"User-Agent": USER_AGENT, "Accept-Language": "ko-KR,ko;q=0.9"}, timeout=8)
    match = re.search(r"var ytInitialData = ({.*?});</script>", res.text)
    if match:
        data = json.loads(match.group(1))
        contents = data["contents"]["twoColumnSearchResultsRenderer"]["primaryContents"]["sectionListRenderer"]["contents"][0]["itemSectionRenderer"]["contents"]
        yt_count = 0
        for item in contents:
            v = item.get("videoRenderer")
            if v and "videoId" in v:
                vid = v["videoId"]
                title = v["title"]["runs"][0]["text"]
                author = v["ownerText"]["runs"][0]["text"]
                views_str = v.get("viewCountText", {}).get("simpleText", "조회수 100,000회")
                views_digits = re.sub(r"[^0-9]", "", views_str)
                views = int(views_digits) if views_digits else 100000
                full_url = f"https://www.youtube.com/watch?v={vid}"
                print(f"[{yt_count+1}] Title : {title}")
                print(f"    URL   : {full_url}")
                print(f"    Author: {author} | Views: {views:,}")
                yt_count += 1
                if yt_count >= 2:
                    break

    print("\n=== [2] Naver Blog 실시간 수집 테스트 ===")
    naver_url = "https://search.naver.com/search.naver?where=blog&query=" + requests.utils.quote("다이소 추천템")
    res2 = requests.get(naver_url, headers={"User-Agent": USER_AGENT}, timeout=8)
    blog_links = list(dict.fromkeys(re.findall(r'href=["\'](https://blog\.naver\.com/([a-zA-Z0-9_-]+)/([0-9]+))["\']', res2.text)))
    nb_count = 0
    for full_url, blog_id, log_no in blog_links:
        m_url = f"https://m.blog.naver.com/{blog_id}/{log_no}"
        try:
            m_res = requests.get(m_url, headers={"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1"}, timeout=5)
            if m_res.status_code == 200:
                og_t = re.search(r'<meta\s+property=["\']og:title["\']\s+content=["\'](.*?)["\']', m_res.text)
                og_d = re.search(r'<meta\s+property=["\']og:description["\']\s+content=["\'](.*?)["\']', m_res.text)
                if og_t:
                    title = og_t.group(1).strip()
                    desc = og_d.group(1).strip() if og_d else ""
                    print(f"[{nb_count+1}] Title : {title}")
                    print(f"    URL   : {full_url}")
                    print(f"    Author: {blog_id} 블로그 | Desc: {desc[:40]}...")
                    nb_count += 1
                    if nb_count >= 2:
                        break
        except Exception as e:
            continue

    print("\n=== [3] SEO / Tech News RSS 실시간 수집 테스트 ===")
    rss_url = "https://news.google.com/rss/search?q=" + requests.utils.quote("소비 트렌드 절약") + "&hl=ko&gl=KR&ceid=KR:ko"
    rss_res = requests.get(rss_url, headers={"User-Agent": USER_AGENT}, timeout=8)
    root = ET.fromstring(rss_res.content)
    rss_count = 0
    for item in root.findall(".//item"):
        t = item.find("title").text
        link = item.find("link").text
        src = item.find("source").text if item.find("source") is not None else "트렌드 뉴스"
        print(f"[{rss_count+1}] Title : {t}")
        print(f"    URL   : {link[:80]}...")
        print(f"    Source: {src}")
        rss_count += 1
        if rss_count >= 2:
            break

test_all()
