const code = document.querySelector(".code");
code.addEventListener("click", copy);
let copyText = document.querySelector(".join_button").value;

function copy() {
    // copyText.select();
    // copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText);
    // alert("Copied the text: ");
    code.setAttribute("tag", "Code Copied")
}

var qrcode = new QRCode("qrcode", {
    text: copyText,
    width: 256,
    height: 256,
	colorLight : "#ffffff",
    colorDark : "#5868bf",
    correctLevel: QRCode.CorrectLevel.H,
  });