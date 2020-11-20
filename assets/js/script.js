
let buffer = [];
let operators = ['+','-','*','/'];

isOperator = (x) => { return operators.includes(x); }

function parse(x){

    if(buffer.length > 18) return;

    /* First Number */

    if(buffer.length === 0 && x === '-'){
        buffer.push(x);
        showBuffer(buffer.join(''));
        return;
    }else if(buffer.length === 0 && (isOperator(x) || x === '.')){
        return;
    }

    if(buffer.length === 1 && buffer[0] === 0 && x === 0){
        return;
    }

    if(buffer.length === 1 && buffer[0] === '-' && isOperator(x)){
        clearBuffer();
        return;
    }

    if(x === '.'){
        if(buffer.includes(x)){
            if(!buffer.slice(1).includes('+') && !buffer.slice(1).includes('*') && !buffer.slice(1).includes('/')){
                return;
            }
        }

        let operatorIndex = -1;

        if(buffer.indexOf('+') !== -1) operatorIndex = buffer.indexOf('+');
        if(buffer.lastIndexOf('-') !== -1) operatorIndex = buffer.lastIndexOf('-');
        if(buffer.indexOf('*') !== -1) operatorIndex = buffer.indexOf('*');
        if(buffer.indexOf('/') !== -1) operatorIndex = buffer.indexOf('/');

        if(buffer.slice(operatorIndex).includes('.')){
            return;
        }

    }

    /* Operator */

    if(buffer.length > 0 && (isOperator(x)) || x === '.'){

        if(isOperator(buffer[buffer.length-2]) && (isOperator(buffer[buffer.length-1])) ){
            return;
        }

        if((isOperator(buffer[buffer.length-1]) || buffer[buffer.length-1] === '.') && x !== '-'){
            buffer[buffer.length-1] = x;
            showBuffer(buffer.join(''));
            return;
        }
    }

    if(buffer.length > 0 && x === 0 && isOperator(buffer[buffer.length-2]) && buffer[buffer.length-1] === 0){
        return;
    }

    if(x !== '') buffer.push(x);

    showBuffer(buffer.join(''));

    if(isOperator(buffer[0]) && buffer.filter((a) => {
        return(isOperator(a));
    }).length === 1){
        showResult(buffer.join(''));
    }else if(buffer.filter((a) => {
        return(isOperator(a));
    }).length === 0){
        showResult(buffer.join(''));
    }
}

function backspace(){
    buffer.pop();
    parse('');
    showBuffer(buffer.join(''));
}

function clearBuffer(){
    buffer = [];
    showBuffer(buffer);
    showResult(buffer);
}

function showBuffer(x){
    if(x.includes('/'))  x = x.replace('/', '÷');
    document.getElementById("bufferDisplay").innerHTML = x;
}

function addDecimal(num, index) {
    return num.substring(0,index) + '.' + num.substring(index+1);
}

function calculateResult(){

    let num1 = 0;
    let num1_negative = false;
    let num2 = 0;
    let num2_negative = false;
    let decimal1 = 0;
    let decimal2 = 0;

    let operator = '';
    let parsingNum2 = false;

    for(let i = 0; i < buffer.length; i++){

        if(i === 0 && isOperator(buffer[i])){
            num1_negative = true;
            continue;
        }

        if(isOperator(buffer[i]) && parsingNum2){
            continue;
        }

        if(buffer[i] === '.'){
            if(decimal1 === 0 && !parsingNum2) decimal1 = i;
            if(decimal1 !== 0 && parsingNum2) decimal2 = i;
        }

        if(isOperator(buffer[i])){
            parsingNum2 = true;
            if(operator === '') operator = buffer[i];
            if(buffer[i+1] === '-') num2_negative = true;
        }

        if(!isOperator(buffer[i]) && !parsingNum2){
            num1 *= 10;
            num1 += buffer[i];
        }else parsingNum2 = true;

        if(!isOperator(buffer[i]) && parsingNum2){
            num2 *= 10;
            num2 += buffer[i];
        }

    }

    if(decimal1 !== 0){
        if(num1_negative) decimal1 -= 1;
        num1 = num1.toString();
        num1 = addDecimal(num1, decimal1);
        num1 = parseFloat(num1);
    }

    if(decimal2 !== 0){
        decimal2 -= num1.toString().length + 1;
        if(num2_negative) decimal2 -= 1;
        num2 = num2.toString();
        num2 = addDecimal(num2, decimal2);
        num2 = parseFloat(num2);
    }
    /*
    console.log(num1_negative);
    console.log(num1);
    console.log(operator);
    console.log(num2_negative);
    console.log(num2);
    */
    num1 = num1_negative ? -1*num1 : num1;
    num2 = num2_negative ? -1*num2 : num2;

    let result = 0;

    switch(operator){
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            result = num1 / num2;
            break;
    }

    if(result % 1 !== 0){
        result = result.toFixed(10);
        result = result.toString();
        result = parseFloat(result);
    }

    showResult(result);
    buffer = [];
    result = result.toString();
    for(let i = 0; i < result.length; i++){
        buffer.push(result[i]);
    }
    showBuffer(buffer.join(''));
}

function showResult(x){
    document.getElementById("resultDisplay").innerHTML = x;
}
