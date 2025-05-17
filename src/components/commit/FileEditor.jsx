import React, { useEffect, useState } from "react";

const FileEditor = () => {
  const [content, setContent] = useState("");
  const [sha, setSha] = useState("");
  const [status, setStatus] = useState("");

  const token = sessionStorage.getItem("github_token");
  const repo = sessionStorage.getItem("repo");
  const filePath = sessionStorage.getItem("file_path");

  const [owner, repoName] = repo.split("/");

  const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/contents/${filePath}`;

  useEffect(() => {
    const fetchFile = async () => {
      setStatus("Fetching file...");
      try {
        const res = await fetch(apiUrl, {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (!res.ok) throw new Error("File not found or access denied");

        const data = await res.json();
        setContent(atob(data.content));
        setSha(data.sha);
        setStatus("File loaded successfully");
      } catch (error) {
        setStatus(`Error: ${error.message}`);
      }
    };

    fetchFile();
  }, [apiUrl, token]);

  const handleSave = async () => {
    setStatus("Saving...");
    try {
      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Updated via web editor",
          content: btoa(content),
          sha: sha,
        }),
      });

      if (!res.ok) throw new Error("Failed to update file");

      const result = await res.json();
      setSha(result.content.sha);
      setStatus("✅ File updated successfully!");
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">📝 GitHub File Editor</h3>
      <p><strong>Status:</strong> {status}</p>

      <textarea
        className="form-control"
        rows="15"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <button className="btn btn-success mt-3 w-100" onClick={handleSave}>
        💾 Save Changes to GitHub
      </button>
    </div>
  );
};

export default FileEditor;
