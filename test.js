require('shelljs/global');
const request = require('request');

const AUTH_TOKEN = process.env.AUTH_TOKEN;
const API_URL = 'https://api.github.com';
const COMMENTS_PATH = '/repos/alanthai/${repo}/commits/${sha}/comments';
const REPO = 'circleci-test-repo';

spellcheck();

function spellcheck() {
  const spellerror = exec('npm run spellcheck');

  if (spellerror.code) {
    postComment(spellerror.output)
      .then(body => console.log('Push Message:', body))
      .then(null, err => {console.log('Post Error:', err)});
  } else {
    console.log('No error');
  }
}

function postComment(comment) {
  const options = {
    url: getCommentsUrl(),
    auth: {
      user: 'alanthai',
      pass: AUTH_TOKEN
    },
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'request'
    },
    json: {
      body: '```' + comment + '```'
    }
  };

  return new Promise((resolve, reject) => {
    request.post(options, function(err, req, body) {
      if (err) {return reject(err);}

      resolve(body);
    });
  });
}

function getLatestSha() {
  const gitlog = exec('git log').output;
  const commit = gitlog.split('\n')[0];

  return commit.split('commit ')[1];
}

function getCommentsUrl() {
  const sha = getLatestSha();
  const path = COMMENTS_PATH
    .replace('${sha}', sha)
    .replace('${repo}', REPO);

  return `${API_URL}${path}`;
}
