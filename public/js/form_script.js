const dragarea = document.querySelector(".selection_area");
// modal.close();
const modal = document.querySelector(".modal");
let pdf_length = [];
dragarea.addEventListener("dragenter", (e) => {
    e.preventDefault();
});
dragarea.addEventListener("dragover", (e) => {
    e.preventDefault();
});
dragarea.addEventListener("dragleave", (e) => {
    e.preventDefault();
});
dragarea.addEventListener("drop", (e) => {
    e.preventDefault();
    let dt = e.dataTransfer
    let files = dt.files
    document.getElementById('pdf').files = files;
    pdfselected();
});
function pdfselected() {
    let input = document.getElementById('pdf').files[0];
    document.querySelector(".select_button").textContent = "PDF Selected";
    document.querySelector(".select_button").style.background = "Green";
    document.querySelector(".select_button_para").textContent = input.name;
    doo();
}
function doo() {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js';
    function extractText(pdfUrl) {
        var pdf = pdfjsLib.getDocument(pdfUrl);
        return pdf.promise.then(function (pdf) {
            var totalPageCount = pdf.numPages;
            pdf_length[0] = totalPageCount;
            pageindex();
            var countPromises = [];
            var start = document.getElementById('index_start').valueAsNumber;
            // var startnum = start;
            var end = document.getElementById('index_end').valueAsNumber;
            console.log(start, end);
            for (
                currentPage = start;
                currentPage <= end;
                currentPage++
            ) {
                var page = pdf.getPage(currentPage);
                countPromises.push(
                    page.then(function (page) {
                        var textContent = page.getTextContent();
                        return textContent.then(function (text) {
                            return text.items
                                .map(function (s) {
                                    return s.str;
                                })
                                .join('');
                        });
                    }),
                );
            }

            return Promise.all(countPromises).then(function (texts) {
                return texts.join('');
            });
        });
    }

    var input = document.getElementById('pdf');
    const file = input.files[0];
    const url = window.URL.createObjectURL(file);
    extractText(url).then(
        function (text) {
            document.getElementById('text').classList.remove('error');
            document.getElementById('text').value = text;
            document.getElementById('text').removeAttribute('disabled');
        },
        function (reason) {
            document.getElementById('text').classList.add('error');
            document.getElementById('text').value = reason.toString();
            document.getElementById('text').setAttribute('disabled', "");
            document.getElementById('submit_button').setAttribute('disabled', "");
            document.getElementById('index_end').setAttribute('disabled', "");
            document.getElementById('index_start').setAttribute('disabled', "");
            document.getElementById('difficulty').setAttribute('disabled', "");
        },
    );
}
function pageindex() {
    // var pdf_lengh= Array.from(pdf_length);
    // console.log(pdf_length[0]);
    var last = pdf_length[0];
    document.getElementById("index_start").removeAttribute("disabled");
    document.getElementById("difficulty").removeAttribute("disabled");
    document.getElementById("index_start").setAttribute("max", last);
    document.getElementById("index_start").setAttribute("value", `1`);
    document.getElementById("index_end").removeAttribute("disabled");
    document.getElementById("submit_button").removeAttribute("disabled");
    document.getElementById("index_end").setAttribute("max", last);
    document.getElementById("index_end").setAttribute("value", `${last}`);
}
function textentered() {
    document.getElementById("submit_button").removeAttribute("disabled");
}
document.getElementById("difficulty").addEventListener("change", () => {
    // console.log(document.getElementById("difficulty").value);
    document.getElementById("difficulty_value").textContent = document.getElementById("difficulty").value;
});
document.getElementById("index_start").addEventListener("change", ()=>{
    if(document.getElementById("index_start").value
    <=document.getElementById("index_end").value){
        doo();
    }
    else{
        document.getElementById("index_start").value=document.getElementById("index_end").value;
        doo();
    }
});
document.getElementById("index_end").addEventListener("change", doo);
document.getElementById("submit_button").addEventListener("click", (e) => {
    // e.preventDefault();
    document.querySelector(".loader").classList.add("loader_active");
    modal.showModal();
});