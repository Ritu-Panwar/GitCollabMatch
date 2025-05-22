import streamlit as st
import os
import requests
from dotenv import load_dotenv

# Load GitHub Token
load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"}


# Get list of languages used by a user
def get_user_languages(username):
    try:
        url = f"https://api.github.com/users/{username}/repos"
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            return set()
        repos = response.json()
        langs = set()
        for repo in repos:
            lang = repo.get("language")
            if lang:
                langs.add(lang)
        return langs
    except requests.exceptions.RequestException:
        return set()


# Get public repo stats: stars, repos, languages
def get_user_stats(username):
    try:
        url = f"https://api.github.com/users/{username}/repos"
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            return 0, 0, set()
        repos = response.json()
        stars = 0
        langs = set()
        for repo in repos:
            stars += repo.get("stargazers_count", 0)
            if repo.get("language"):
                langs.add(repo["language"])
        return len(repos), stars, langs
    except requests.exceptions.RequestException:
        return 0, 0, set()


# Estimate skill level from stats
def estimate_skill_level(repo_count, stars, lang_count):
    score = 0
    if repo_count >= 15:
        score += 2
    elif repo_count >= 5:
        score += 1

    if stars >= 50:
        score += 2
    elif stars >= 10:
        score += 1

    if lang_count > 5:
        score += 2
    elif lang_count >= 3:
        score += 1

    if score >= 5:
        return "Advanced"
    elif score >= 3:
        return "Intermediate"
    else:
        return "Beginner"


# Fetch mentee profile including languages and skill level
def fetch_mentee_profile(username):
    repo_count, stars, langs = get_user_stats(username)
    skill_level = estimate_skill_level(repo_count, stars, len(langs))
    return {
        "Username": username,
        "Languages": list(langs),
        "Skill Level": skill_level,
        "Repo Count": repo_count,
        "Stars": stars
    }


# Fetch mentors based on overlapping skills
def fetch_mentors_by_skills(mentee_languages, max_per_lang=5):
    seen = set()
    mentor_profiles = []

    for lang in mentee_languages:
        search_url = f"https://api.github.com/search/users?q=language:{lang}&per_page={max_per_lang}"
        try:
            res = requests.get(search_url, headers=HEADERS, timeout=10)
            if res.status_code != 200:
                continue
            users = res.json().get("items", [])
            for user in users:
                username = user.get("login")
                if not username or username in seen:
                    continue
                seen.add(username)
                mentor_langs = get_user_languages(username)
                overlap = set(mentee_languages).intersection(mentor_langs)
                if overlap:
                    mentor_profiles.append({
                        "Username": username,
                        "Profile": f"https://github.com/{username}",
                        "Matched Skills": list(overlap),
                        "Skill Match Count": len(overlap)
                    })
        except requests.exceptions.RequestException:
            continue

    mentor_profiles.sort(key=lambda x: x["Skill Match Count"], reverse=True)
    return mentor_profiles


# ---------------- UI -------------------
st.set_page_config(page_title="GitHub Mentor Finder", page_icon="🤝", layout="centered")
st.markdown("""
    <style>
        .big-title {
            font-size: 42px;
            font-weight: bold;
            color: #4B8BBE;
            text-align: center;
        }
        .subtitle {
            font-size: 18px;
            text-align: center;
            color: #555;
            margin-bottom: 2em;
        }
        .mentor-box {
            background-color: #f8f9fa;
            border-left: 5px solid #4B8BBE;
            padding: 1em;
            margin-bottom: 1em;
            border-radius: 8px;
        }
        .skill-tag {
            background-color: #e1ecf4;
            color: #0366d6;
            padding: 3px 8px;
            margin: 2px;
            border-radius: 6px;
            display: inline-block;
            font-size: 13px;
        }
    </style>
""", unsafe_allow_html=True)

st.markdown('<div class="big-title">🤝 GitHub Mentor-Mentee Matcher</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">Find mentors on GitHub with matching skills</div>', unsafe_allow_html=True)

mentee_username = st.text_input("👤 Enter your GitHub username:")

if mentee_username:
    with st.spinner("🔍 Fetching your profile and skills..."):
        profile = fetch_mentee_profile(mentee_username.strip())

    if not profile["Languages"]:
        st.error("⚠️ No skills found for this GitHub profile.")
        st.stop()

    st.success(f"✅ Skills detected for `{profile['Username']}`:")
    st.markdown("".join(
        f"<span class='skill-tag'>{lang}</span>" for lang in profile["Languages"]
    ), unsafe_allow_html=True)
    st.info(f"🌟 **Estimated Skill Level:** {profile['Skill Level']}  \n📦 Public Repos: {profile['Repo Count']}  ⭐ Stars: {profile['Stars']}")

    with st.spinner("🔎 Searching for top mentors..."):
        mentors = fetch_mentors_by_skills(profile["Languages"])

    if not mentors:
        st.warning("❌ No suitable mentors found.")
    else:
        st.subheader("👨‍🏫 Top Suggested Mentors")
        for mentor in mentors[:5]:
            st.markdown(f"""
                <div class="mentor-box">
                    <b>👤 <a href="{mentor['Profile']}" target="_blank">{mentor['Username']}</a></b><br/>
                    🔗 <a href="{mentor['Profile']}" target="_blank">{mentor['Profile']}</a><br/>
                    🔍 Matched Skills: {" ".join(f"<span class='skill-tag'>{skill}</span>" for skill in mentor['Matched Skills'])}<br/>
                    🌟 Skill Match Count: {mentor['Skill Match Count']}
                </div>
            """, unsafe_allow_html=True)
