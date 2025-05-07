import React, { useEffect, useState } from "react";

const FileEditor = () => {
  const [content, setContent] = useState("");
  const [sha, setSha] = useState("");
  const [status, setStatus] = useState("");
  const [commitUrl, setCommitUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("github_token");
  const repo = sessionStorage.getItem("repo");
  const filePath = sessionStorage.getItem("file_path");

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${repo}/contents/${filePath}`,
          {
            headers: {
              Authorization: `token ${token}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch file.");
        }
        const data = await response.json();
        const contentDecoded = atob(data.content);
        setContent(contentDecoded);
        setSha(data.sha);
        setLoading(false);
      } catch (error) {
        setStatus(`❌ Error: ${error.message}`);
        setLoading(false);
      }
    };

    fetchFile();
  }, [repo, filePath, token]);

  const handleCommit = async () => {
    const encodedContent = btoa(unescape(encodeURIComponent(content)));
    try {
      setStatus("⏳ Committing changes to GitHub...");
      const response = await fetch(
        `https://api.github.com/repos/${repo}/contents/${filePath}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "File updated via React App",
            content: encodedContent,
            sha: sha,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to commit changes.");
      }

      const data = await response.json();
      const commitLink = data.commit?.html_url || `https://github.com/${repo}/commits`;
      setCommitUrl(commitLink);
      setStatus("✅ Changes committed successfully!");
    } catch (error) {
      setStatus(`❌ Commit failed: ${error.message}`);
    }
  };

  if (loading) return <p>⏳ Loading file...</p>;

  return (
    <div style={{ padding: "10px", fontFamily: "Arial" }}>
      <h2>📝 Edit File</h2>
      <textarea
        rows={17}
        cols={100}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          fontFamily: "monospace",
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />
      <br /><br />
      <button className="btn btn-primary rounded-sm"
        onClick={handleCommit}
        style={{
          padding: "10px 20px",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          transition: "transform 0.2s ease",
        }}
        onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
      >
        🚀 Commit Changes
      </button>
      <p style={{ marginTop: "10px" }}>{status}</p>
      {commitUrl && (
        <p>
          🔗 <a href={commitUrl} target="_blank" rel="noopener noreferrer">View Commit</a>
        </p>
      )}
    </div>
  );
};

export default FileEditor;
