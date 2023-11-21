const nav = document.querySelector(".active");
const contact = document.querySelector(".nav_contact");
const heading = document.getElementById("heading");
document.getElementById("container").addEventListener("scroll", () => {
    let height = document.getElementById("contact_container").getBoundingClientRect().top - document.getElementById("container").getBoundingClientRect().height;
    if (height < 0) {
        nav.className = "";
        contact.className = "active";
    }
    else {
        contact.className = "contact";
        nav.className = "active";
    }
})
