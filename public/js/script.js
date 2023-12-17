const nav = document.querySelector(".active");
const contact = document.querySelector(".nav_contact");
const heading = document.getElementById("heading");
const nav_observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
           nav.className = "";
           contact.className = "active";
        } else {
           nav.className = "active";
           contact.className = "";
        }
    });
    });
document.querySelectorAll(".contact").forEach(section => {
    nav_observer.observe(section);
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
           entry.target.classList.add("show");
        } 
        else {
            entry.target.classList.remove("show");
        }
    });
    });
const aos = document.querySelectorAll(".aos");
console.log(aos);
aos.forEach((element) => {
    observer.observe(element);
});