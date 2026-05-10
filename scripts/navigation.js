

const navbutton = document.querySelector("#han-btn");
const navlink = document.querySelector("#nav-bar");



navbutton.addEventListener("click", () => {
    navbutton.classList.toggle("show");
    navlink.classList.toggle("show");
})