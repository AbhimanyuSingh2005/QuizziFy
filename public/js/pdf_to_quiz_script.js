const dragarea = document.querySelector(".selection_area");
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
            // console.log(start, end);
            for (
                currentPage = start; currentPage <= end; currentPage++
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
            document.querySelector(".toggle").classList.add("disabled");
            document.getElementById("submit_button").classList.add("disabled");
        },
    );
}

function pageindex() {
    var last = pdf_length[0];
    document.querySelector(".toggle").classList.remove("disabled");
    document.getElementById("submit_button").classList.remove("disabled");
    document.getElementById("index_start").setAttribute("value", "1");
    document.getElementById("index_end").setAttribute("value", last);
}

function textentered() {
    document.querySelector(".toggle").classList.remove("disabled");
    document.getElementById("index_start").classList.add("disabled");
    document.getElementById("index_end").classList.add("disabled");
    document.querySelector(".index_start").classList.add("disabled");
    document.querySelector(".index_end").classList.add("disabled");
    document.getElementById("submit_button").classList.remove("disabled");
    document.getElementById("index_start").removeAttribute("required");
    document.getElementById("index_end").removeAttribute("required");
    document.getElementById("pdf").removeAttribute("required");
}
document.getElementById("index_end").addEventListener("change", index_check);
document.getElementById("index_start").addEventListener("change", index_check);

function index_check() {
    if (document.getElementById("index_start").value != 0 && document.getElementById("index_end").value != 0) {
        if (document.getElementById("index_start").value > document.getElementById("index_end").value) {
            document.getElementById("index_start").value = document.getElementById("index_end").value;
        }
        if (document.getElementById("index_end").value > pdf_length[0]) {
            document.getElementById("index_end").value = pdf_length[0];
            doo();
        }
        doo();
    }
}

document.getElementById("submit_button").addEventListener("click", (e) => {
    // e.preventDefault();
    if (document.getElementById("index_end").value - document.getElementById("index_start").value>10) {
        document.getElementById("index_end").value = document.getElementById("index_start").valueAsNumber+9;
    }
    document.querySelector(".loader").classList.add("loader_active");
    setInterval(() => {
        modal.showModal();
    }, 100);
});