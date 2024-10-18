const upButton = document.querySelector(".table__up");
const downButton = document.querySelector(".table__down");
const upperTablePart = document.querySelector(".table__upper-part");

let heightCounter = 0;

upButton.addEventListener("click", function () {
  if (heightCounter < 3) {
    this.classList.add("table__up--disabled");
    this.disabled === true;
    this.classList.remove("table__up--disabled");
    this.disabled === false;
    downButton.classList.remove("table__down--disabled");
    downButton.disabled === false;
    heightCounter++;
    console.log(heightCounter);
    upperTablePart.style.transform =
      "translateY(" + heightCounter * -10 + "px)";
    if (heightCounter >= 3) {
      this.classList.add("table__up--disabled");
      this.disabled === true;
    }
  } else {
    this.classList.add("table__up--disabled");
    this.disabled === true;
  }
});

downButton.addEventListener("click", function () {
  if (heightCounter > -3) {
    this.classList.remove("table__down--disabled");
    this.disabled === false;
    upButton.classList.remove("table__up--disabled");
    upButton.disabled === false;
    heightCounter--;
    console.log(heightCounter);
    upperTablePart.style.transform =
      "translateY(" + heightCounter * -10 + "px)";
    if (heightCounter <= -3) {
      this.classList.add("table__down--disabled");
      this.disabled === true;
    }
  } else {
    this.classList.add("table__down--disabled");
    this.disabled === true;
  }
});
