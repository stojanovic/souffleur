'use strict'

const readline = require('readline')

const colors = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  yellow: '\x1b[33m'
}

module.exports = function prompt(questions, results) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  function singlePrompt(question) {
    let questionObject = question
    if (typeof question === 'string')
      questionObject = {
        question: question,
        color: 'cyan',
        optional: false
      }

    let color = questionObject.color || 'cyan'

    return new Promise((resolve, reject) =>
      rl.question(`${colors[color]}${questionObject.question}:${colors.reset} `, answer => {
        rl.close()
        if (!answer && !questionObject.optional) {
          console.log(`\n${colors.red}Answer can't be empty!${colors.reset}\n`)
          return reject(question)
        }

        resolve({
          question: questionObject.question,
          answer: answer || null
        })
      })
    )
  }

  if (typeof questions === 'string' || (typeof questions === 'object' && questions.question))
    questions = [questions]

  if (!Array.isArray(questions))
    throw new Error('First argument needs to be an array, string or object')

  if (!results)
    results = {}

  if (questions.length)
    return singlePrompt(questions.shift())
      .then(response => {
        results[response.question] = response.answer
        return prompt(questions, results)
      })
      .catch(question => {
        if (typeof question === 'string' || typeof question === 'object') {
          questions.unshift(question)
          return prompt(questions, results)
        }

        return question
      })

  return Promise.resolve(results)
}
