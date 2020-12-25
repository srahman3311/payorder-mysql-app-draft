// let date_picker = document.getElementById("date_picker");


// date_picker.addEventListener("click", e => {
//     console.log(e.target.value);
// });


let modalDisplayer = document.querySelector(".modal-displayer");
let modal = document.querySelector(".modal");

modalDisplayer.addEventListener("click", e => {
    console.log("hi");
   modal.style.display = "block";
});



let modalClose = document.querySelector(".modal-close");

modalClose.addEventListener("click", e => {
    modal.style.display = "none";
});


