require('shelljs/global');

const error = exec('npm run spellcheck');

if (error.code) {
  console.log('Error');
} else {
  console.log('No error');
}
