'use strict'

const readline = require('readline')

const colors = {
  reset: '\e[0m',
  cyan: '\e[36m',
  red: '\e[31m'
}

module.exports = function prompt(questions, results) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  function singlePrompt(question) {
    return new Promise((resolve, reject) =>
      rl.question(`${colors.cyan}${question}:${colors.reset} `, answer => {
        rl.close()
        if (!answer) {
          console.log(`\n${colors.red}Answer can't be empty!${colors.reset}\n`)
          return reject(question)
        }

        resolve({
          question: question,
          answer: answer
        })
      })
    )
  }

  if (typeof questions === 'string')
    questions = [questions]

  if (!Array.isArray(questions))
    throw new Error('First argument needs to be an array or string')

  if (!results)
    results = {}

  if (questions.length)
    return singlePrompt(questions.shift())
      .then(response => {
        results[response.question] = response.answer
        return prompt(questions, results)
      })
      .catch(question => {
        if (typeof question === 'string') {
          questions.unshift(question)
          return prompt(questions, results)
        }

        return question
      })

  return Promise.resolve(results)
}
