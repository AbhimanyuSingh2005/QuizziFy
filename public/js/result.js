let score = document.getElementById("score");
let root = document.documentElement;
let dashoffset = 450-450*(score.textContent/10);
root.style.setProperty('--stroke-dashoffset', dashoffset);
if(score.textContent>=8){
    document.getElementById("result").textContent = "Congratulations! You performed excellent!";
    score.classList.add("good");
}
else if(score.textContent>=4 && score.textContent<8){
    document.getElementById("result").textContent = "Congratulations! You passed the test!";
    score.classList.add("average");
}
else{
    document.getElementById("result").textContent = "Sorry! You failed the test!";
    score.classList.add("bad");
}