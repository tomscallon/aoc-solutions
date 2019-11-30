#! /usr/local/bin/node
require('dotenv').config();

const fs = require('fs');
const fse = require('fs-extra');
const https = require('https');
const prompt = require('prompt');

// Utilities for working with the answer file.
class Answer {
  constructor(str = '{}') {
    this._data = JSON.parse(str);

    // Ensure required properties.
    if (!this._data.lastAnswers) {
      this._data.lastAnswers = [];
    }
  }

  static fromFile(path, def) {
    return new Answer(fs.readFileSync(path, 'utf8'));
  }

  static readWrite(path, action) {
    let answer;
    try {
      answer = Answer.fromFile(path);
    } catch (e) {
      answer = new Answer();
    }
    action(answer);
    writeFile(path, answer.toString());
  }

  toString() {
    return JSON.stringify(this._data);
  }

  getLastAnswer(part) {
    return this._data.lastAnswers[part - 1];
  }

  setLastAnswer(part, answer) {
    this._data.lastAnswers[part - 1] = answer;
  }
}

const writeFile = (path, content, successCallback = undefined) => fs.writeFile(
  path,
  content,
  (err) => {
    if (err) {
      console.error(`Failed to write to ${path}: ${err.message}`);
      process.exit();
    } else if (typeof successCallback === 'function') {
      successCallback();
    }
  }
)

const makeRequest = (url, options, onSuccess, onFail) => {
  https.request(url, options, response => {
    let data = '';

    // Combine chunks into the whole response.
    response.on('data', chunk => data += chunk);

    // The whole response has been received. Call the success callback.
    response.on('end', () => onSuccess(data));

  }).on('error', err => onFail(err))
    .end();
}

const actions = {
  make: (year, day) => {
    const folderPath = getFolderPath(year, day);

    fse.mkdirs(folderPath);

    const filePath = getCodeFilePath(year, day);

    const doWrite = () => writeFile(
      filePath,
      createCodeFileBody(year, day),
      () => console.log(`Created solution file ${filePath}.`),
    );

    console.log(`Creating ${filePath}`);
    fs.stat(filePath, (err, stat) => {
      if (err) {
        if (err.code !== 'ENOENT') {
          console.error(`\nCan't write to the code file '${filePath}': ${err}`);
          process.exit();
        } else {
          // File doesn't exist, so go ahead and create it.
          doWrite();
        }
      } else {
        console.log(`\nThe file '${filePath}' already exists. Overwrite it?`);
        prompt.get(['overwrite'], (err, res) => {
          if (err) {
            console.error(`\nHit an error while collecting input: ${err}.`);
            process.exit();
          }

          if (
            res.overwrite.toLowerCase() === 'y' ||
            res.overwrite.toLowerCase() === 'yes'
          ) {
            doWrite();
            console.log('File was overwritten.\n');
          } else {
            console.log('Didn\'t overwrite the existing file.');
          }
        });
      }
    });

    actions.get_input(year, day);
  },
  run: (year, day, part) => {
    const filePath = getCodeFilePath(year, day);
    let module;

    try {
      module = require(filePath);
    } catch (e) {
      console.error(`\nHit an error while loading the code: ${e}.\n`);
      process.exit();
    }

    let result;
    let time;

    try {
      time = Date.now();
      result = module[part]();
      time = Date.now() - time;
    } catch (e) {
      console.error(`\nHit an error while running the code: ${e}.\n`);
      process.exit();
    }

    // Display the reults.
    console.log(`\nRan: ${year}, day ${day}, part ${part}\nTook: ${time}ms\nResult: ${result}\n`);

    // Save the result to the answer file.
    Answer.readWrite(
      getAnswerFilePath(year, day),
      a => a.setLastAnswer(part, result),
    );

    // Potentially submit the answer to the API.
    console.log('Would you like to submit this answer? (y/n)');
    prompt.get(['submit'], (err, res) => {
      if (err) {
        console.error(`\nHit an error while collecting input: ${err}.`);
        process.exit();
      }

      if (['y', 'yes'].includes(res.submit.toLowerCase())) {
        actions.submit_answer(year, day, part, result);
      }
    });
  },
  /*submit_answer: (year, day, part, answer = undefined) => {
    // If no answer's provided, attempt to read it from the file.
    if (answer === undefined) {
      let p = getAnswerFilePath(year, day);
      console.log(`Reading stored answer from ${p}.`);
      try {
        let a = Answer.fromFile(p);
        answer = a.getLastAnswer(part);
      } catch (e) {
        console.log(`Failed to read saved answer: ${e.message}`);
        process.exit();
      }
    }

    // Submit to the API.
    console.log(`Submitting ${answer} as answer for ${year} day ${day} part ${part}`);
    makeRequest(
      getSubmitURL(year, day)
    );
  },*/
};

// Validate the action
const action = process.argv[2];

if (!(action in actions)) {
  printUsageError(`'${action}' is not a valid action.`);
  process.exit();
}

// Validate the remaining arguments
let [language, year, day, part] = process.argv.slice(3);
year = +year;
day = +day;

// Language only provided for make and run
if (!['make', 'run'].includes(action)) {
  [year, day, part] = [language, year, day];
}

// Validate 'language'
if (['make', 'run'].includes(action)) {
  if (false) {

  }
}

// Validate 'year'
if (!year || year % 1 !== 0 || year < 2015 || year > FINAL_YEAR) {
  printUsageError(`'year' must be an integer between 2015 and ${FINAL_YEAR}, inclusive`);
  process.exit();
}

// Validate 'day'
if (!day || day % 1 !== 0 || day < 1 || day > 25) {
  printUsageError(`'day' must be an integer between 1 and 25, inclusive`);
  process.exit();
}

// Validate 'part'
if (action === 'run') {
  if(!part || part % 1 !== 0 || part < 1 || part > 2) {
    printUsageError(`'part' must be 1 or 2`);
    process.exit();
  }
}

// Done validating, now run!
actions[action](year, day, part);
