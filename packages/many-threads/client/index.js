const HTML_IDS = {
  threadCellsContainer: 'thread-cells-container',
  threadCell: 'thread-cell',
  threadOutput: 'thread-output',
  threadSum: 'thread-sum',
  maxSum: 'max-sum',
  maxSumIndex: 'max-sum-index',
}

function receiveThreadValue({i, value}) {
  const cell = document.getElementById(getThreadCellId(i));
  const output = document.getElementById(getThreadOutputId(i));
  cell.classList.remove('active');
  if (value) {
    cell.classList.add('active');
  }
  output.innerText = value;
}

function receiveThreadSum({i, value}) {
  const sum = document.getElementById(getThreadSumId(i));
  sum.innerText = value;
  sum.setAttribute('title', value);
}

function receiveMaxSum({i, value}) {
  const maxSum = document.getElementById(HTML_IDS.maxSum);
  const maxSumIndex = document.getElementById(HTML_IDS.maxSumIndex);
  maxSumIndex.innerText = i;
  maxSum.innerText = value;
}

function getThreadCellId(i) {
  return `${HTML_IDS.threadCell}-${i}`;
}

function getThreadSumId(i) {
  return `${HTML_IDS.threadSum}-${i}`;
}

function getThreadOutputId(i) {
  return `${HTML_IDS.threadOutput}-${i}`;
}

function generateThreadCells(number) {
  const threads = document.getElementById(HTML_IDS.threadCellsContainer);
  const rowsAndColumns = Math.sqrt(number);

  for (let i = 0; i < number; i++) {
    const row = Math.floor(i / rowsAndColumns) + 1;
    const column = i % rowsAndColumns + 1;
    const cell = document.createElement('div');
    cell.setAttribute('id', getThreadCellId(i));
    cell.classList.add('thread-cell');
    if (number > 9) cell.classList.add('small');
    cell.style['grid-column'] = `${column}`;
    cell.style['grid-row'] = `${row}`;

    const output = document.createElement('output');
    output.setAttribute('id', getThreadOutputId(i));
    output.classList.add('thread-cell__output');
    cell.appendChild(output);

    const sum = document.createElement('div');
    sum.setAttribute('id', getThreadSumId(i));
    sum.classList.add('thread-cell__sum');
    sum.innerText = 0;
    cell.appendChild(sum);

    threads.appendChild(cell);
  }

  threads.style['grid-template-columns'] = `repeat(${rowsAndColumns}, 1fr)`;
  threads.style['grid-template-rows'] = `repeat(${rowsAndColumns}, 1fr)`;
}

function init() {
  this.socket = io('http://localhost:3000');

  this.socket.on('threadNumber', (number) => {
    console.log(number);
    generateThreadCells(number);
  });

  this.socket.on('threadValue', (message) => {
    receiveThreadValue(message);
  });

  this.socket.on('threadSum', (message) => {
    receiveThreadSum(message);
  });

  this.socket.on('maxSum', (message) => {
    receiveMaxSum(message);
  });
}

init();
