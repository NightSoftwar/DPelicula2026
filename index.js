const botonNav = document.getElementById("menu-btn");
const mobileNav = document.getElementById("menu-mobile")
botonNav.addEventListener("click",(e) =>{
    e.preventDefault()
    mobileNav.classList.toggle("menu-active")
})