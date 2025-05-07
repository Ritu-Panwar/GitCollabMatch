import React, { useState } from "react";

const GitHubAccessForm = ({ onNext }) => {
  const [token, setToken] = useState("");
  const [repo, setRepo] = useState("");
  const [filePath, setFilePath] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem("github_token", token);
    sessionStorage.setItem("repo", repo);
    sessionStorage.setItem("file_path", filePath);
    onNext();
  };

  return (
    <div className="container mt-3">
      {/* <h2 className="text-center mb-4">GitHub Access Form</h2> */}

      {/* Note/Instruction */}
      <div className="alert alert-info">
        <strong>Important:</strong> Before proceeding, you need to create a GitHub personal access token. 
        Follow the steps below:
        <ol>
          <li>Visit <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">GitHub Token Settings</a>.</li>
          <li>Click on "Generate New Token".</li>
          <li>Choose the appropriate scopes for your token (at least "repo" scope for accessing repositories).</li>
          <li>Click "Generate Token" and copy the token generated. Keep this token secure, as it will not be shown again.</li>
        </ol>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm" style={{ maxWidth: "600px", margin: "auto" }}>
        <div className="mb-3">
          <label htmlFor="token" className="form-label">
            <strong>🔐 GitHub Token:</strong>
          </label>
          <input
            type="password"
            id="token"
            className="form-control"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="repo" className="form-label">
            <strong>📦 Repository (owner/repo):</strong>
          </label>
          <input
            type="text"
            id="repo"
            className="form-control"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="filePath" className="form-label">
            <strong>📄 File Path:</strong>
          </label>
          <input
            type="text"
            id="filePath"
            className="form-control"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            required
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary btn-lg w-100">
            Next → Fetch File
          </button>
        </div>
      </form>
    </div>
  );
};

export default GitHubAccessForm;
