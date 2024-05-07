const fs = require('fs');
const { join } = require('path');

function _filterVersion(stdmsg) {
  const cliVersion = stdmsg.match('(\\d+\\.)(\\d+\\.)(\\d+)')
  if (cliVersion) return cliVersion[0]
  else return '0.0.0'
}

function _readFile(path, usrOpts) {
  const opts = {
    encoding: 'utf8',
    lineEnding: '\n'
  };
  Object.assign(opts, usrOpts);
  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(path);
    let acc = '';
    let pos = 0;
    let index;
    rs
      .on('data', chunk => {
        index = chunk.indexOf(opts.lineEnding);
        acc += chunk;
        if (index === -1) {
          pos += chunk.length;
        } else {
          pos += index;
          rs.close();
        }
      })
      .on('close', () => resolve(acc.slice(acc.charCodeAt(0) === 0xFEFF ? 1 : 0, pos)))
      .on('error', err => reject(err));
  });
};

function getLocalDir(dir) {
  const localDir = join(
    __dirname,
    'runner',
    join(
      Math.random()
        .toString(36)
        .substring(7)
    ),
    dir
  );
  return localDir;
}


module.exports = { _filterVersion, _readFile, getLocalDir };
