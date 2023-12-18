const code = document.querySelector(".code");
code.addEventListener("click", copy);
let copyText = document.querySelector(".code").textContent;
let url = `https://quizzifypdf.onrender.com/quiz?id=${copyText}&no=1`;
function copy() {
    // copyText.select();
    // copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText);
    // alert("Copied the text: ");
    code.setAttribute("tag", "Code Copied")
}

var qrcode = new QRCode("qrcode", {
    text: url,
    width: 256,
    height: 256,
	colorLight : "#ffffff",
    colorDark : "#5868bf",
    correctLevel: QRCode.CorrectLevel.H,
  });