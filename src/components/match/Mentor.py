import streamlit as st
import os
import requests
import json
from dotenv import load_dotenv
from collections import Counter
import plotly.graph_objects as go

# Load GitHub Token
load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"}

# Utility Functions
def get_user_repos(username):
    url = f"https://api.github.com/users/{username}/repos?per_page=100"
    res = requests.get(url, headers=HEADERS)
    if res.status_code != 200:
        return []
    return res.json()

def get_user_profile(username):
    url = f"https://api.github.com/users/{username}"
    res = requests.get(url, headers=HEADERS)
    if res.status_code != 200:
        return {}
    return res.json()

def summarize_languages(repos):
    langs = [repo["language"] for repo in repos if repo["language"]]
    return Counter(langs)

def estimate_skill_level(repo_count, stars, lang_count):
    score = 0
    score += 2 if repo_count >= 15 else 1 if repo_count >= 5 else 0
    score += 2 if stars >= 50 else 1 if stars >= 10 else 0
    score += 2 if lang_count > 5 else 1 if lang_count >= 3 else 0
    return "Advanced" if score >= 5 else "Intermediate" if score >= 3 else "Beginner"

def get_user_languages(username):
    # Fetch repos and summarize languages for a mentor
    repos = get_user_repos(username)
    langs = [repo["language"] for repo in repos if repo["language"]]
    return list(set(langs))

def fetch_mentors_by_skills(langs, max_per_lang=5):
    seen = set()
    mentors = []
    for lang in langs:
        url = f"https://api.github.com/search/users?q=language:{lang}&per_page={max_per_lang}"
        res = requests.get(url, headers=HEADERS)
        if res.status_code != 200:
            continue
        for user in res.json().get("items", []):
            login = user["login"]
            if login not in seen:
                seen.add(login)
                user_langs = get_user_languages(login)
                mentors.append({
                    "Username": login,
                    "Profile": f"https://github.com/{login}",
                    "Languages": user_langs
                })
    return mentors

# Streamlit Page Settings
st.set_page_config(page_title="GitHub Mentor Matcher", page_icon="🤝", layout="centered")

# 💅 Enhanced CSS Styling
st.markdown("""
    <style>
        html, body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f0f2f6;
        }
        .reportview-container .main .block-container{
        max-width: 1200px;  /* Increase max width */
        padding-left: 3rem;  /* Increase side padding */
        padding-right: 3rem;
        }
        .title {
            font-size: 48px;
            font-weight: 900;
            color: #2c7be5;
            text-align: center;
            margin-top: 30px;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 20px;
            text-align: center;
            color: #444444;
            margin-bottom: 40px;
            font-weight: 500;
        }
        .tag {
            display: inline-block;
            background-color: #cce4ff;
            color: #004085;
            padding: 6px 14px;
            border-radius: 20px;
            margin: 3px 4px;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            transition: background-color 0.3s ease;
        }
        .tag:hover {
            background-color: #a3c1ff;
            cursor: default;
        }
        .mentor-card {
            background-color: white;
            border-left: 6px solid #2c7be5;
            padding: 20px;
            margin: 12px 0;
            border-radius: 14px;
            box-shadow: 0 4px 15px rgba(44,123,229,0.15);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .mentor-card:hover {
            box-shadow: 0 8px 30px rgba(44,123,229,0.3);
            transform: translateY(-5px);
        }
        .skill-level {
            background: linear-gradient(90deg, #ffb347, #ffcc33);
            padding: 6px 18px;
            border-radius: 12px;
            color: #3b3b3b;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
            margin-bottom: 15px;
            box-shadow: 0 3px 8px rgba(0,0,0,0.1);
        }
        a {
            color: #2c7be5;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
""", unsafe_allow_html=True)

# Title
st.markdown('<div class="title">🤝 GitHub Mentor-Mentee Matcher</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">Find ideal mentors on GitHub based on your skills and interests</div>', unsafe_allow_html=True)

# Inputs
username = st.text_input("👤 Enter your GitHub username:")
goal = st.selectbox("🎯 What is your mentorship goal?", [
    "Contribute to Open Source",
    "Interview Preparation",
    "Learn a New Stack"
])

if username:
    with st.spinner("Fetching your GitHub data..."):
        profile = get_user_profile(username)
        repos = get_user_repos(username)
        repo_count = len(repos)
        stars = sum(repo.get("stargazers_count", 0) for repo in repos)
        lang_summary = summarize_languages(repos)
        skill_level = estimate_skill_level(repo_count, stars, len(lang_summary))

    if not repos:
        st.error("❌ No public repositories found.")
    else:
        st.success("✅ GitHub data fetched successfully!")
        st.markdown(f"<div class='skill-level'>Skill Level: {skill_level}</div>", unsafe_allow_html=True)
        st.write(f"📦 Public Repositories: `{repo_count}`")
        st.write(f"⭐ Total Stars: `{stars}`")
        st.write(f"🧭 Selected Goal: `{goal}`")

        # Interactive 3D-like Pie chart with Plotly
        if lang_summary:
            st.subheader("🧪 Most Used Languages")
            labels = list(lang_summary.keys())
            values = list(lang_summary.values())

            fig = go.Figure(data=[go.Pie(
                labels=labels,
                values=values,
                hole=0.3,
                hoverinfo='label+percent+value',
                marker=dict(line=dict(color='#000000', width=2))
            )])

            fig.update_traces(textinfo='percent+label', pull=[0.1 if v == max(values) else 0 for v in values])
            fig.update_layout(
                showlegend=True,
                legend_title_text='Languages',
                margin=dict(t=10, b=10, l=10, r=10),
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)'
            )

            st.plotly_chart(fig, use_container_width=True)

        # Select languages to match mentors
        selected_langs = st.multiselect(
            "📌 Select languages to match mentors:",
            list(lang_summary.keys()),
            default=list(lang_summary.keys())
        )

        if selected_langs:
            with st.spinner("🔎 Finding mentors..."):
                mentors = fetch_mentors_by_skills(selected_langs)

            if not mentors:
                st.warning("No mentors found.")
            else:
                st.subheader("👨‍🏫 Top Suggested Mentors")
                saved_mentors = []
                for mentor in mentors[:10]:  # Show up to 10 mentors
                    lang_tags = " ".join([f"<span class='tag'>{lang}</span>" for lang in mentor["Languages"]])
                    st.markdown(f"""
                        <div class='mentor-card'>
                            👤 <b><a href="{mentor['Profile']}" target="_blank">{mentor['Username']}</a></b><br>
                            🔗 <a href="{mentor['Profile']}" target="_blank">{mentor['Profile']}</a><br>
                            📘 Skills: {lang_tags}
                        </div>
                    """, unsafe_allow_html=True)
                    saved_mentors.append(mentor)

                if st.button("💾 Save Mentor List"):
                    with open("saved_mentors.json", "w") as f:
                        json.dump(saved_mentors, f, indent=2)
                    st.success("Mentor list saved as `saved_mentors.json`.")
