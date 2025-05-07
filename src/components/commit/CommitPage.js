import React, { useState } from "react";
import GitHubAccessForm from './GitHubAccessForm'
import FileEditor from './FileEditor'

const CommitPage = () => {
  const [step, setStep] = useState(1);

  return (
    <div className='container text-center mt-5'>
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1 className='text-center m-4'>🛠️ GitHub File Editor</h1>
      {step === 1 && <GitHubAccessForm onNext={() => setStep(2)}/>}
      {step === 2 && <FileEditor />}
    </div>
    </div>
  )
}

export default CommitPage
