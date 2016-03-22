require('shelljs/global');
const request = require('request');

const API_URL = 'https://api.github.com';
const AUTH_TOKEN = 'c7dbdcc10e97e3b3dbbadd0d2f5ffe0ab3cce26d';
const COMMENTS_PATH = '/repos/alanthai/${repo}/commits/${sha}/comments';
const REPO = 'circleci-test-repo';

function spellcheck() {
  const error = exec('npm run spellcheck');

  if (error.code) {
    postComment(error.output)
      .then(body => console.log('-----Pushed comment-----', body))
      .then(null, err => {console.log('-----ERR-----', err)});
  } else {
    console.log('No error');
  }

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

spellcheck();
