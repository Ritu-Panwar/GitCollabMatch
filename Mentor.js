const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 8000;

app.get('/start-mentor', (req, res) => {
    const mentorProcess = spawn('streamlit', ['run', 'src/components/match/mentor.py']);

  mentorProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  mentorProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  mentorProcess.on('close', (code) => {
    console.log(`mentor.py exited with code ${code}`);
  });

  res.send('Mentor.py started');
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
