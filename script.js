const quote_api = 'https://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')
const lastResultsElement = document.getElementById('lastResults')

let timerInterval
let timerStarted = false

quoteInputElement.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault()
    renderNewQuote()
  }
})

quoteInputElement.addEventListener('input', () => {
  if (!timerStarted) {
    startTimer()
    timerStarted = true
  }

  const arrayQuote = quoteDisplayElement.querySelectorAll('span')
  const arrayValue = quoteInputElement.value.split('')

  let correct = true
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index]
    if (character == null) {
      characterSpan.classList.remove('correct')
      characterSpan.classList.remove('incorrect')
      correct = false
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct')
      characterSpan.classList.remove('incorrect')
    } else {
      characterSpan.classList.remove('correct')
      characterSpan.classList.add('incorrect')
      correct = false
    }

    if (index === arrayValue.length) {
      characterSpan.classList.add('active')
    } else {
      characterSpan.classList.remove('active')
    }
  })

  if (correct) {
    calculateStats()
    renderNewQuote()
  }
})

function getRandomQuote() {
  return fetch(quote_api)
    .then(response => response.json())
    .then(data => data.content)
}

async function renderNewQuote() {
  const quote = await getRandomQuote()
  quoteDisplayElement.innerHTML = ''
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span')
    characterSpan.innerText = character
    quoteDisplayElement.appendChild(characterSpan)
  })
  quoteInputElement.value = null

  const firstCharacter = quoteDisplayElement.querySelector('span')
  if (firstCharacter) firstCharacter.classList.add('active')

  clearInterval(timerInterval)
  timerStarted = false
  timerElement.innerText = 0
}

function calculateStats() {
  const timeTaken = getTimerTime()
  const timeInMinutes = Math.max(timeTaken, 1) / 60
  const characterCount = quoteDisplayElement.innerText.length
  const wpm = Math.round((characterCount / 5) / timeInMinutes)
  lastResultsElement.innerText = `WPM: ${wpm} | Time: ${timeTaken}s`
}

let startTime
function startTimer() {
  startTime = new Date()
  timerInterval = setInterval(() => {
    timer.innerText = getTimerTime()
  }, 1000)
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000)
}

renderNewQuote()

const instructionsModal = document.getElementById('instructionsModal')
const startGameBtn = document.getElementById('startGameBtn')

startGameBtn.addEventListener('click', () => {
  instructionsModal.style.display = 'none'
  quoteInputElement.focus() // Automatically selects the text box
})