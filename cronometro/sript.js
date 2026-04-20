let sec = 0;
let min = 0;
let hr = 0;
let interval;

function twoDigits(digit) {
    if (digit < 10) {
        return ('0' + digit);
    } else {
        return (digit);
    }
}

function start() {
    // Evita que múltiplos intervalos sejam criados se clicar várias vezes
    pause(); 
    interval = setInterval(timer, 1000);
}

function pause() {
    clearInterval(interval);
}

function reset() {
    clearInterval(interval);
    sec = 0;
    min = 0;
    hr = 0;
    document.querySelector('.display').innerText = "00:00:00";
}

function timer() {
    sec++;
    if (sec == 60) {
        min++;
        sec = 0;
        if (min == 60) {
            min = 0;
            hr++;
        }
    }
    // Atualiza o visor usando a função de dois dígitos
    document.querySelector('.display').innerText = 
        twoDigits(hr) + ':' + twoDigits(min) + ':' + twoDigits(sec);
}