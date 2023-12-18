const modal = document.querySelector(".modal");
document.getElementById("submit_button").addEventListener("click", (e) => {
    document.querySelector(".loader").classList.add("loader_active");
    setInterval(() => {
        modal.showModal();
    }, 100);
});