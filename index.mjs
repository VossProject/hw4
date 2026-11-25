import express from 'express';
const licenses = (await import('spdx-license-list')).default;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

let projects = [];
let lastFetch = 0;

app.get('/', (req, res) => {
  res.render('index', { title: "Home" });
});

app.get('/everyday', async (req, res) => {
  if (Date.now() - lastFetch > 10 * 60 * 1000) {
    try {
      let url = "https://api.github.com/search/repositories?q=repo:brave/brave-browser+repo:videolan/vlc+repo:ollama/ollama+repo:microsoft/vscode";
      let response = await fetch(url);
      if (response.ok) {
        let data = await response.json();
        projects = data.items;
        lastFetch = Date.now();
      }
    } catch (error) {
      console.log(error);
    }
  }
  res.render('everyday', { title: "Everyday Open Source", projects });
});

app.get('/contributing', (req, res) => {
  res.render('contributing', { title: "Getting Involved" });
});

app.get('/licenses', (req, res) => {
  let popular = ["MIT", "Apache-2.0", "GPL-3.0", "GPL-2.0", "MPL-2.0", "BSD-3-Clause"];
  let total = Object.keys(licenses).length;
  let approved = Object.values(licenses).filter(license => license.osiApproved).length;
  res.render('licenses', { title: "Licenses", licenses, popular, total, approved });
});

app.get('/my-story', (req, res) => {
  res.render('my-story', { title: "My Story" });
});

app.listen(process.env.PORT || 3002, () => {
  console.log('server started');
});
