const dataStorage = [['pwm', 'LED1'], ['pwm', 'Led2'], ['pwm', 'Led3'], ['sensor', 'BMP180'], ['sensor', 'Humidity'], ['binary', 'PSU']];
const dataOut = [];
let lastIdCreate = 0;

function minimizeContBtn(targetObj, head) {
  const minBtn = document.createElement('div');
  minBtn.classList = 'minButton';
  minBtn.innerText = 'X';
  head.append(minBtn);
}

function valueContCreate(targetObj, contType, contId) {
  switch (contType) {
    case 'pwm':
    {
      const pwmValue = document.createElement('div');
      pwmValue.classList = 'valueFont';
      pwmValue.innerText = dataOut[contId].value;
      targetObj.append(pwmValue);

      const pwmSlider = document.createElement('input');
      pwmSlider.type = 'range';
      pwmSlider.min = '0';
      pwmSlider.max = '100';
      pwmSlider.value = dataOut[contId].value;
      pwmSlider.onchange = () => {
        pwmValue.innerText = pwmSlider.value;
        dataOut[contId].value = pwmSlider.value;
      };
      targetObj.append(pwmSlider);
      break;
    }
    case 'sensor':
    {
      const valueCont = document.createElement('div');
      valueCont.classList = 'valueFont';
      valueCont.innerText = '20';
      targetObj.append(valueCont);
      break;
    }
    case 'binary':
    {
      const check = document.createElement('input');
      check.type = 'checkbox';
      check.classList = 'valueFont';
      check.onchange = () => {
        if (check.value) {
          dataOut[contId].value = true;
          // add request function
        } else {
          dataOut[contId].value = false;
        }
      };
      targetObj.append(check);
      break;
    }

    default:
      break;
  }
}

// container generation
function generateContainer(mainCont, contType, contId) {
  const elemntCont = document.createElement('div');
  elemntCont.classList = 'contBody';
  elemntCont.id = contId;
  mainCont.append(elemntCont);

  elemntCont.addEventListener('click', (event) => {
    console.log(event.target);
    const targetCont = event.target;
    if (targetCont.classList.value === 'minButton') {
      elemntCont.classList = 'contBody minimizedCont';
      for (let i = 0; i < elemntCont.children.length; i += 1) {
        switch (i) {
          case 0:
            elemntCont.children[i].children[1].hidden = true;
            elemntCont.children[i].classList = 'minHead';
            break;
          case 1:
            elemntCont.children[i].classList = 'minValues';
            break;

          default:
            elemntCont.children[i].hidden = true;
            break;
        }
      }
      dataOut.forEach((element, index) => {
        if (element.id === contId) {
          dataOut[index].hide = true;
        }
      });
    } else {
      dataOut.forEach((element, index) => {
        if (element.hide === true && element.id === contId) {
          elemntCont.classList = 'contBody';
          for (let i = 0; i < elemntCont.children.length; i += 1) {
            switch (i) {
              case 0:
                elemntCont.children[i].children[1].hidden = false;
                elemntCont.children[i].classList = 'contHead';
                break;
              case 1:
                elemntCont.children[i].classList = 'valueFont';
                break;
              default:
                elemntCont.children[i].hidden = false;
                break;
            }
          }
          dataOut[index].hide = false;
        }
      });
    }
  });

  const headBlock = document.createElement('div');
  headBlock.classList = 'contHead';
  elemntCont.append(headBlock);

  const textHead = document.createElement('div');
  textHead.classList = 'textHead';
  textHead.innerText = dataOut[contId].name;
  headBlock.append(textHead);

  minimizeContBtn(elemntCont, headBlock);

  valueContCreate(elemntCont, contType, contId);
}

// init data to dataOut
function initContData(arrNum, id, type, name) {
  dataOut[arrNum] = {
    id,
    type,
    name,
    value: '0',
    hide: false,
  };
  generateContainer(document.getElementById('mainCont'), type, id);
}

// init function
function initCode() {
  const header = document.createElement('div');
  header.classList = 'header';
  header.innerHTML = 'Just control for your room';
  document.getElementById('root').append(header);

  const contsDiv = document.createElement('div');
  contsDiv.classList = 'mainContainer';
  contsDiv.id = 'mainCont';
  document.getElementById('root').append(contsDiv);
  dataStorage.forEach((item, index) => {
    initContData(index, lastIdCreate, item[0], item[1]);
    lastIdCreate += 1;
  });
}

initCode();
