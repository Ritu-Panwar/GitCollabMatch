# from joblib import load
# import pickle
import pandas as pd
import streamlit as st
from github import Github
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env file
import os
SERVER_GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

try:
    # Test token validity
    g = Github(SERVER_GITHUB_TOKEN)
    # g.get_user().login 
except Exception as e:
    st.error(f"❌Server-side GitHub token is invalid or expired: {e}")
    st.stop()

# Mentor GitHub usernames and expertise
mentor_data = pd.DataFrame({
    'GitHub Username': ['octocat', 'mojombo', 'defunkt', 'pjhyett', 'wycats', 'torvalds', 'hadley', 'gaearon', 'tensorflow', 'keras-team'],
    'Expertise': [
        'Data Scientist', 'Frontend Developer', 'ML Engineer', 'Web Developer', 'Data Analyst',
        'Systems Programmer', 'Data Visualization Expert', 'React Specialist', 'Deep Learning Engineer', 'AI Researcher'
    ]
})

# Streamlit UI
st.title("👥 GitHub-Based Mentor-Mentee Matcher with Connection Requests")

mentee_github = st.text_input("🔎 Enter Mentee GitHub Username", help="Enter the mentee's GitHub username to match skills.")

#  Checks if the input is empty or not
if not mentee_github.strip():
    st.warning("⚠️ Enter a valid GitHub username.")
    st.stop()

# Fetch GitHub profile and skills
def extract_github_profile(username, repo_limit=5):
    try:
        user = g.get_user(username)
        #  Filter Public & Active Repositories
        repos = [repo for repo in user.get_repos() if not repo.private and not repo.archived][:repo_limit]
        #  Extract Programming Languages
        languages = set()

        for repo in repos:
            try:
                repo_languages = repo.get_languages()
                if repo_languages:
                    languages.update(repo_languages.keys())
                    # If languages exist, add them to the set using .update() (to avoid duplicates).
            except Exception:
                continue

        return {
            'Name': user.name or user.login,
            'Username': user.login,
            'Profile URL': user.html_url,
            'Skills': list(languages) if languages else [],
            'Public Repos': repos
        }
    except Exception as e:
        st.error(f"❌ Error fetching data for {username}: {e}")
        return None

# Calculate skill overlap
def calculate_skill_overlap(mentee_skills, mentor_skills):
    return len(set(mentee_skills).intersection(set(mentor_skills)))

# Create a connection request as a GitHub issue with status tracking
def send_connection_request(mentor_username, mentee_profile):
    try:
        mentor_user = g.get_user(mentor_username)
        repos = [repo for repo in mentor_user.get_repos() if not repo.private and repo.has_issues]

        if not repos:
            st.error("❌ Mentor has no accessible repositories with issues enabled.")
            return None

        target_repo = repos[0]  # Select the first available repo
        issue_title = f"🔔 Connection Request from {mentee_profile['Name']}"
        issue_body = (
            f"Hi @{mentor_username},\n\n"
            f"👋 {mentee_profile['Name']} ([GitHub Profile]({mentee_profile['Profile URL']})) wants to connect with you!\n"
            f"💡 **Mentee Skills:** {', '.join(mentee_profile['Skills'])}\n"
            f"💬 Please respond if you're open to connect.\n\n"
            f"_This request was sent via the Mentor-Mentee Matcher App._"
        )

        issue = target_repo.create_issue(title=issue_title, body=issue_body)
        st.success(f"✅ Connection request sent! [View Issue]({issue.html_url})")

        return issue.html_url

    except Exception as e:
        st.error(f"❌ Failed to send connection request: {e}")
        return None

# Track connection request status
def track_request_status(issue_url):
    try:
        issue_path = issue_url.replace("https://github.com/", "").replace("/issues/", "").split("/")
        repo_full_name = f"{issue_path[0]}/{issue_path[1]}"
        issue_number = int(issue_path[2])

        repo = g.get_repo(repo_full_name)
        issue = repo.get_issue(number=issue_number)

        if issue.state == "closed":
            st.success("✅ Your connection request was accepted or closed by the mentor.")
        else:
            st.info("ℹ️ Your connection request is still pending.")

    except Exception as e:
        st.error(f"❌ Could not track request status: {e}")

# Fetch mentee profile and skills
mentee_profile = extract_github_profile(mentee_github.strip())
if not mentee_profile or not mentee_profile['Skills']:
    # st.warning("⚠️ No skills found for the mentee's GitHub profile.")
    st.stop()

st.write(f"✅ **Mentee:** [{mentee_profile['Name']}]({mentee_profile['Profile URL']})")
st.write(f"🛠️ **Skills:** {', '.join(mentee_profile['Skills'])}")

# Fetch mentor profiles and compare skills
def fetch_mentor_match(username, expertise):
    profile = extract_github_profile(username)
    if profile and profile['Skills']:
        overlap = calculate_skill_overlap(mentee_profile['Skills'], profile['Skills'])
        return {
            'Mentor Name': profile['Name'],
            'GitHub Username': profile['Username'],
            'Profile URL': profile['Profile URL'],
            'Expertise': expertise,
            'Skill Overlap': overlap,
            'Mentor Skills': profile['Skills']
        } if overlap > 0 else None
    return None

with st.spinner("🔎 Searching for mentors..."):
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(executor.map(lambda row: fetch_mentor_match(row['GitHub Username'], row['Expertise']), mentor_data.to_dict('records')))

# Filtering and Sorting Matches
mentor_matches = [res for res in results if res]

if mentor_matches:
    st.warning("⚠️ No suitable mentors found. Assigning a default mentor for testing.")
    mentor_matches.append({
        'Mentor Name': 'Testing Mentor',
        'GitHub Username': 'panwarritu',
        'Profile URL': 'https://github.com/panwarritu',
        'Expertise': 'Default Mentor for Testing',
        'Skill Overlap': 0,
        'Mentor Skills': ['N/A']
    })
    
    mentor_matches.sort(key=lambda x: x['Skill Overlap'], reverse=True)
    st.subheader("🎯 Matched Mentors")

    for mentor in mentor_matches:
        st.markdown(f"**[{mentor['Mentor Name']}]({mentor['Profile URL']})**")
        st.write(f"🔗 **Skill Overlap:** {mentor['Skill Overlap']} skills")
        st.write(f"🛠️ **Mentor Skills:** {', '.join(mentor['Mentor Skills'])}")
        st.write(f"💼 **Expertise:** {mentor['Expertise']}")

        if st.button(f"🤝 Connect with {mentor['Mentor Name']}", key=mentor['GitHub Username']):
            issue_url = send_connection_request(mentor['GitHub Username'], mentee_profile)
            if issue_url:
                st.markdown(f"🔎 **Track Request:** Click [here]({issue_url}) to view the request status.")
                if st.button("🔄 Check Status", key=f"status_{mentor['GitHub Username']}"):
                    track_request_status(issue_url)
else:
    st.warning("⚠️ No suitable mentors found based on GitHub skill comparison.")
