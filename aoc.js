#! /usr/local/bin/node

throw new Error("Hey! Don't run this. Run `node cli/cli.bundle.js` instead.");

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

const actions = {
  submit_answer: (year, day, part, answer = undefined) => {
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
  },
};
