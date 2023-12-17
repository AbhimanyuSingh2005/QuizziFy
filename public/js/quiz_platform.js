const modal = document.querySelector(".modal");
document.getElementById("open_modal").addEventListener("click", ()=> {
    modal.showModal();
});
document.getElementById("close_modal").addEventListener("click", ()=> {
    modal.close();
})
var options= document.querySelectorAll(".option");
options.forEach(element => {
    element.addEventListener("click", ()=> {
        element.querySelector("input").checked = true;
    });
});