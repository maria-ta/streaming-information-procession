const HTML_IDS = {
  valuesContainer: 'values-container',
  expectedNum: 'expected-num',
  calculatedNum: 'calculated-num',
}

function createValueCell(value) {
  const cell = document.createElement('div');
  cell.classList.add('values__cell');
  cell.innerText = value;
  return cell;
}

function receiveThreadValue({value}) {
  console.log('Value: ', value);
  const container = document.getElementById(HTML_IDS.valuesContainer);
  const cell = createValueCell(value);
  container.appendChild(cell);
}

function receiveNumberCount({value}) {
  console.log(`Approximate number of different elements is ${value}`);
  const output = document.getElementById(HTML_IDS.calculatedNum);
  output.innerText = value;
}

function receiveTotalCount({value}) {
  const output = document.getElementById(HTML_IDS.expectedNum);
  output.innerText = value;
}

function init() {
  this.socket = io('http://localhost:3000');

  this.socket.on('maxNumber', (number) => {
    console.log(`Max number is ${number}`);
  });

  this.socket.on('threadValue', (message) => {
    receiveThreadValue(message);
  });

  this.socket.on('numberCount', (message) => {
    receiveNumberCount(message);
  });

  this.socket.on('totalCount', (message) => {
    receiveTotalCount(message);
  });
}

init();
