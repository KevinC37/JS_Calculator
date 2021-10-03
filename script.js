let writeHistory = document.getElementById("history");
let numbers = document.querySelectorAll(".number");
let input = document.getElementById("text");
let operators = document.querySelectorAll(".operator");

const stylesheet = document.styleSheets[0];
let boxRule;

let currentTheme = {
  darkMode: false,
  lightMode: true,
};

let darkLightMode = document
  .getElementById("lightDarkToggle")
  .addEventListener("click", () => {


    if (currentTheme.lightMode) {
      for (let i = 0; i < stylesheet.cssRules.length; i++) {
        let currentSelector = stylesheet.cssRules[i].selectorText;
        boxRule = stylesheet.cssRules[i];

        document
          .getElementById("multiply_svg_icon")
          .classList.add("multiply_dark");
        document
          .getElementById("backspace_1")
          .classList.add("backspace_svg_1_dark");
        document
          .getElementById("backspace_2")
          .classList.add("backspace_svg_2_dark");


        if (currentSelector === "#calculator_main") {
          boxRule.style.setProperty("background-color", "rgba(16, 16, 30, 1)");
        } else if (currentSelector === "#history") {
          boxRule.style.setProperty("color", "rgba(136, 136, 174, 1)");
        } else if (currentSelector === "#text") {
          boxRule.style.setProperty("color", "rgba(225, 225, 255, 1)");
        } else if (currentSelector === "#buttons > *") {
          boxRule.style.setProperty("color", "rgba(225, 225, 255, 1)");
          boxRule.style.setProperty("background-color", "rgba(40, 40, 63, 1)");
        } else if(currentSelector == "#buttons > button:not(#equal):hover") {
          boxRule.style.setProperty("background-color", "#3F3F5B");
        } else if(currentSelector == "#buttons > button:not(#equal):active") {
          boxRule.style.setProperty("background-color", "#1F1F49");
        }
      }

      currentTheme.lightMode = false;
      currentTheme.darkMode = true;
    } else {
      for (let i = 0; i < stylesheet.cssRules.length; i++) {
        let currentSelector = stylesheet.cssRules[i].selectorText;
        boxRule = stylesheet.cssRules[i];

        document
          .getElementById("multiply_svg_icon")
          .classList.remove("multiply_dark");
        document
          .getElementById("backspace_1")
          .classList.remove("backspace_svg_1_dark");
        document
          .getElementById("backspace_2")
          .classList.remove("backspace_svg_2_dark");

        if (currentSelector === "#calculator_main") {
          boxRule.style.setProperty("background-color", "#fafafa");
        } else if (currentSelector === "#history") {
          boxRule.style.setProperty("color", "rgba(85, 85, 115, 1)");
        } else if (currentSelector === "#text") {
          boxRule.style.setProperty("color", "rgba(16, 16, 30, 1)");
        }  else if(currentSelector == "#buttons > button:not(#equal):hover") {
          boxRule.style.setProperty("background-color", "rgba(224, 224, 224, 1)");
        } else if(currentSelector == "#buttons > button:not(#equal):active") {
          boxRule.style.setProperty("background-color", "rgba(210, 210, 214, 1)");
        } else if (currentSelector === "#buttons > *") {
          boxRule.style.setProperty("color", "rgba(16, 16, 30, 1)");
          boxRule.style.setProperty("background-color", "#F0F0F0");
        }
      }
      currentTheme.lightMode = true;
      currentTheme.darkMode = false;
    }
  });

let preventTwoOrMoreOperators = {
  operatorUsed: false,
  operators: [],
};

let equalUsed = document
  .getElementById("equal")
  .addEventListener("click", () => {});

let backspace = document
  .getElementById("backspace")
  .addEventListener("click", () => {
    let equalRegex = /\n?\d+\.?\d*[=]\n|\d+\.?\d*[=]/;
    let operandsRegext = /\n?\d+\.?\d*[+x\-\/]\n|\d+\.?\d*[+x\-\/]/g;

    if (!writeHistory.value.length) {
      if (input.innerHTML.length <= 1) {
        input.innerHTML = 0;
      } else if (input.innerHTML.length >= 2) {
        input.innerHTML = input.innerHTML.slice(0, input.innerHTML.length - 1);
      }
    } else if (!!writeHistory.value) {
      if (equalUsed) {
        input.innerHTML = writeHistory.value
          .match(equalRegex)
          .join("")
          .replace(/\=/, "");
        writeHistory.value = writeHistory.value
          .replace(equalRegex, "")
          .replace(/^\n|\B\n\B$|\,|\n$/g, "");
        equalUsed = false;
      } else if (!equalUsed) {
        if (input.innerHTML.length > 1 && input.innerHTML != "0") {
          input.innerHTML = input.innerHTML.slice(
            0,
            input.innerHTML.length - 1
          );
        } else if (input.innerHTML.length <= 1 && input.innerHTML != "0") {
          input.innerHTML = "0";
        } else if (
          input.innerHTML == "0" &&
          writeHistory.value.match(/\d+\.?\d*/g).length <= 1
        ) {
          input.innerHTML = writeHistory.value.match(/\d+\.?\d*/).join();
          writeHistory.value = "";
        } else if (
          input.innerHTML == "0" &&
          writeHistory.value.match(/\d+\.?\d*/g).join().length > 1
        ) {
          input.innerHTML = writeHistory.value
            .replace(/[+x\-\/]$/, "")
            .replace(operandsRegext, "");
          writeHistory.value = writeHistory.value
            .replace(/[+x\-\/]$/, "")
            .match(operandsRegext)
            .join()
            .replace(/^\n|\B\n\B$|\,|\n$/g, "");
        }
      }
    }
  });

let dot = document.getElementById("dot").addEventListener("click", (e) => {
  if (input.innerHTML[0] == ".") {
    input.innerHTML = "0.";
  } else if (!!input.innerHTML.match(/\./g)) {
    return;
  } else if (!!writeHistory.value.match(/\=$/)) {
    writeHistory.value = "";
    input.innerHTML += ".";
    return;
  } else {
    input.innerHTML += ".";
  }
});

function clear() {
  input.innerHTML = 0;
  writeHistory.value = "";
  preventTwoOrMoreOperators.operatorUsed = false;
  preventTwoOrMoreOperators.operators = [];
  console.log("clear has run");
}

function calc(str) {
  str = str.replace(/\n/g, "");
  let firstOperands = str.match(
    /^-\d+[.]?\d*\x\d+[.]?\d*|^-\d+[.]?\d*\/\d+[.]?\d*|\d+[.]?\d*\x\d+[.]?\d*|\d+[.]?\d*\/\d+[.]?\d*/g
  );
  let result = [];

  while (!!firstOperands) {
    try {
      for (let i = 0; i < firstOperands.length; i++) {
        let firstNum = parseFloat(firstOperands[0].match(/^\-?\d+[.]?\d*/));
        let secondNum = parseFloat(firstOperands[0].match(/\d+[.]?\d*$/));

        if (firstOperands[0].indexOf("x") >= 0) {
          result.push(firstNum * secondNum);
        } else if (firstOperands[0].indexOf("/") >= 0) {
          result.push(firstNum / secondNum);
        }

        str = str.replace(firstOperands[0], result[i]);

        firstOperands.shift();
      }
      firstOperands = str.match(
        /^-\d+[.]?\d*\x\d+[.]?\d*|^-\d+[.]?\d*\/\d+[.]?\d*|\d+[.]?\d*\x\d+[.]?\d*|\d+[.]?\d*\/\d+[.]?\d*/
      );

      result.length = 0;
    } catch (e) {
      console.log(e);
    }
  }

  let secondOperands = str.match(
    /^\-?\d+[.]?\d*\-\d+[.]?\d*|^\-?\d+[.]?\d*\+\d+[.]?\d*|\d+[.]?\d*\+\d+[.]?\d*|\d+[.]?\d*\-\d+[.]?\d*/
  );

  while (!!secondOperands) {
    try {
      for (let i = 0; i < secondOperands.length; i++) {
        let firstNum = parseFloat(secondOperands[0].match(/^\-?\d+[.]?\d*/));
        let secondNum = parseFloat(secondOperands[0].match(/\d+[.]?\d*$/));

        if (secondOperands[0].indexOf("+") >= 0) {
          result.push(firstNum + secondNum);
        } else if (secondOperands[0].indexOf("-") >= 0) {
          result.push(firstNum - secondNum);
        }
        str = str.replace(secondOperands[0], result[i]);

        secondOperands.shift();
      }
      secondOperands = str.match(
        /^\-?\d+[.]?\d*\-\d+[.]?\d*|^\-?\d+[.]?\d*\+\d+[.]?\d*|\d+[.]?\d*\+\d+[.]?\d*|\d+[.]?\d*\-\d+[.]?\d*/
      );

      result.length = 0;
    } catch (e) {
      console.log(e);
    }
  }

  return !!str.match(/\./g) ? parseFloat(str).toFixed(2) : parseInt(str);
}

let squareRoot = document
  .getElementById("sqrt")
  .addEventListener("click", (e) => {
    if (input.innerHTML.length > 0 && writeHistory.value.length == 0) {
      let result = Math.sqrt(input.innerHTML);
      !Number.isInteger(result)
        ? (input.innerHTML = result.toFixed(2))
        : (input.innerHTML = result);
      writeHistory.value = "";
    } else {
      let result = Math.sqrt(calc(writeHistory.value));
      !Number.isInteger(result)
        ? (input.innerHTML = result.toFixed(2))
        : (input.innerHTML = result);
      writeHistory.value = "";
    }
  });

let percentage = document
  .getElementById("percentage")
  .addEventListener("click", () => {
    if (writeHistory.value.length == 0) {
      return;
    } else {
      let result = (calc(writeHistory.value) / 100) * Number(input.innerHTML);
      !Number.isInteger(result)
        ? (input.innerHTML = result.toFixed(2))
        : (input.innerHTML = result);
    }
  });

function toExp(a, b) {
  return Number.parseFloat(a).toExponential(b);
}

for (let i = 0; i < numbers.length; i++) {
  numbers[i].addEventListener("click", () => {
    let numberClicked = numbers[i].value;

    if (input.innerHTML[0] == "0") {
      if (input.innerHTML[1] == ".") {
        input.innerHTML;
      } else {
        input.innerHTML = "";
      }
    }

    if (writeHistory.value.match(/\=$/)) {
      clear();
      input.innerHTML = "";
    }

    if (input.innerHTML.length < 6) {
      input.style.fontSize = `96px`;
    } else if (input.innerHTML.length >= 6 && input.innerHTML.length <= 11) {
      input.style.fontSize = `50px`;
    }

    if (input.innerHTML.length <= 11) {
      input.innerHTML += numberClicked;
    }
    preventTwoOrMoreOperators.operatorUsed = false;
    preventTwoOrMoreOperators.operators = [];
  });
}

for (let i = 0; i < operators.length; i++) {
  operators[i].addEventListener("click", () => {
    let operatorClicked = operators[i].value;

    if (preventTwoOrMoreOperators.operatorUsed == false) {
      if (operatorClicked == "=" && equalUsed == false) {
        writeHistory.value += "\n" + input.innerHTML + operatorClicked;
        writeHistory.scrollTo(0, writeHistory.scrollHeight);
        input.innerHTML = "0";
        equalUsed = true;
      } else if (operatorClicked != "=") {
        writeHistory.value += "\n" + input.innerHTML + operatorClicked;
        writeHistory.scrollTo(0, writeHistory.scrollHeight);
        input.innerHTML = "0";
        equalUsed = false;
      }

      preventTwoOrMoreOperators.operatorUsed = true;
      preventTwoOrMoreOperators.operators.push(operatorClicked);
    } else {
      preventTwoOrMoreOperators.operators.push(operatorClicked);

      writeHistory.value = writeHistory.value.replace(
        /[+-\/x]$/,
        operatorClicked
      );
      preventTwoOrMoreOperators.operatorUsed = true;
      preventTwoOrMoreOperators.operators = [];
    }

    if (operatorClicked == "C") {
      clear();
    } else if (operatorClicked == "=") {
      if (equalUsed == true && writeHistory.value.match(/\=/g).length > 1) {
        writeHistory.value = writeHistory.value.replace(/\d+\=$/, "");
        input.innerHTML = calc(writeHistory.value);
        return;
      } else {
        input.innerHTML = calc(writeHistory.value);
        preventTwoOrMoreOperators.operatorUsed = false;
        equalUsed = true;
        preventTwoOrMoreOperators.operators = [];

        if (input.innerHTML.length >= 11) {
          input.innerHTML = toExp(input.innerHTML, 2);
          input.style.fontSize = `50px`;
        } else if (input.innerHTML.length < 11 && input.innerHTML.length >= 6) {
          input.style.fontSize = `50px`;
        } else {
          input.style.fontSize = `96px`;
        }
      }
    } else if (!!writeHistory.value.match(/\=/g)) {
      writeHistory.value = writeHistory.value.match(
        /[-]?\d+[x+-\/]$|[-]?\d+\.\d+[x+-\/]$/
      );
    }
  });
}

window.addEventListener("keydown", (e) => {
  let keyPressed = e.key.toLowerCase();
  console.log(keyPressed);
  if(keyPressed == "enter") {
    keyPressed = "=";
  } else if (keyPressed == "*") {
    keyPressed = "x";
  } else if (keyPressed == "/") {
    e.preventDefault();
  } else if(keyPressed == "%") {
    if (writeHistory.value.length == 0) {
      return;
    } else {
      let result = (calc(writeHistory.value) / 100) * Number(input.innerHTML);
      !Number.isInteger(result)
        ? (input.innerHTML = result.toFixed(2))
        : (input.innerHTML = result);
    }
  } else if(keyPressed == "backspace") {
    let equalRegex = /\n?\d+\.?\d*[=]\n|\d+\.?\d*[=]/;
    let operandsRegext = /\n?\d+\.?\d*[+x\-\/]\n|\d+\.?\d*[+x\-\/]/g;

    if (!writeHistory.value.length) {
      if (input.innerHTML.length <= 1) {
        input.innerHTML = 0;
      } else if (input.innerHTML.length >= 2) {
        input.innerHTML = input.innerHTML.slice(0, input.innerHTML.length - 1);
      }
    } else if (!!writeHistory.value) {
      if (equalUsed) {
        input.innerHTML = writeHistory.value
          .match(equalRegex)
          .join("")
          .replace(/\=/, "");
        writeHistory.value = writeHistory.value
          .replace(equalRegex, "")
          .replace(/^\n|\B\n\B$|\,|\n$/g, "");
        equalUsed = false;
      } else if (!equalUsed) {
        if (input.innerHTML.length > 1 && input.innerHTML != "0") {
          input.innerHTML = input.innerHTML.slice(
            0,
            input.innerHTML.length - 1
          );
        } else if (input.innerHTML.length <= 1 && input.innerHTML != "0") {
          input.innerHTML = "0";
        } else if (
          input.innerHTML == "0" &&
          writeHistory.value.match(/\d+\.?\d*/g).length <= 1
        ) {
          input.innerHTML = writeHistory.value.match(/\d+\.?\d*/).join();
          writeHistory.value = "";
        } else if (
          input.innerHTML == "0" &&
          writeHistory.value.match(/\d+\.?\d*/g).join().length > 1
        ) {
          input.innerHTML = writeHistory.value
            .replace(/[+x\-\/]$/, "")
            .replace(operandsRegext, "");
          writeHistory.value = writeHistory.value
            .replace(/[+x\-\/]$/, "")
            .match(operandsRegext)
            .join()
            .replace(/^\n|\B\n\B$|\,|\n$/g, "");
        }
      }
    }
  }


  if (Number.isInteger(Number(keyPressed))  || keyPressed == ".") {
    if (input.innerHTML[0] == "0") {
      if (input.innerHTML[1] == ".") {
        input.innerHTML;
      } else {
        input.innerHTML = "";
      }
    }


    if (writeHistory.value.match(/\=$/)) {
      clear();
      input.innerHTML = "";
    }

    if (input.innerHTML.length < 6) {
      input.style.fontSize = `96px`;
    } else if (input.innerHTML.length >= 6 && input.innerHTML.length <= 11) {
      input.style.fontSize = `50px`;
    }

    if (input.innerHTML.length <= 11) {
      input.innerHTML += keyPressed;
    }
    preventTwoOrMoreOperators.operatorUsed = false;
    preventTwoOrMoreOperators.operators = [];
  } else if(keyPressed == "c" || keyPressed == "x" || keyPressed == "+" || keyPressed == "-" ||
  keyPressed == "/" || keyPressed == "=" || keyPressed == "enter" ) {

  

    if (preventTwoOrMoreOperators.operatorUsed == false) {
      if (keyPressed == "=" && equalUsed == false) {
        writeHistory.value += "\n" + input.innerHTML + keyPressed;
        writeHistory.scrollTo(0, writeHistory.scrollHeight);
        input.innerHTML = "0";
        equalUsed = true;
      } else if (keyPressed != "=") {
        writeHistory.value += "\n" + input.innerHTML + keyPressed;
        writeHistory.scrollTo(0, writeHistory.scrollHeight);
        input.innerHTML = "0";
        equalUsed = false;
      }

      preventTwoOrMoreOperators.operatorUsed = true;
      preventTwoOrMoreOperators.operators.push(keyPressed);
    } else {
      preventTwoOrMoreOperators.operators.push(keyPressed);

      writeHistory.value = writeHistory.value.replace(
        /[+-\/x]$/,
        keyPressed
      );
      preventTwoOrMoreOperators.operatorUsed = true;
      preventTwoOrMoreOperators.operators = [];
    }

    

    if (keyPressed == "c") {
      clear();
    } else if (keyPressed == "=" || keyPressed == "enter") {
      if (equalUsed == true && writeHistory.value.match(/\=/g).length > 1) {
        writeHistory.value = writeHistory.value.replace(/\d+\=$/, "");
        input.innerHTML = calc(writeHistory.value);
        return;
      } else {
        input.innerHTML = calc(writeHistory.value);
        preventTwoOrMoreOperators.operatorUsed = false;
        equalUsed = true;
        preventTwoOrMoreOperators.operators = [];

        if (input.innerHTML.length >= 11) {
          input.innerHTML = toExp(input.innerHTML, 2);
          input.style.fontSize = `50px`;
        } else if (input.innerHTML.length < 11 && input.innerHTML.length >= 6) {
          input.style.fontSize = `50px`;
        } else {
          input.style.fontSize = `96px`;
        }
      }
    } else if (!!writeHistory.value.match(/\=/g)) {
      writeHistory.value = writeHistory.value.match(
        /[-]?\d+[x+-\/]$|[-]?\d+\.\d+[x+-\/]$/
      );
    }
  }


      
});

//Calling functions
clear();
