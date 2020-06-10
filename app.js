class Film {
  constructor(title, director, description) {
    this.title = title;
    this.director = director;
    this.description = description;
    this.uid = Date.now();
  }
}

class UI {
  addFilmToList(film) {
    const list = document.getElementById("film-list");
    //Create tr element
    const row = document.createElement("tr");
    const att = document.createAttribute("data-uid");
    att.value = film.uid;
    row.setAttributeNode(att);

    //Insert cols
    row.innerHTML = `
        <td>${film.title}</td>
        <td>${film.director}</td>
        <td>${film.description}</td>
        <td><a href class="delete">X</a></td>
        `;
    list.appendChild(row);
  }

  showAlert(message, className) {
    //Create  div
    const div = document.createElement("div");
    //Add classes
    div.className = `alert mb-2 ${className}`;
    //Add text
    div.appendChild(document.createTextNode(message));
    //Get parent
    const container = document.querySelector(".container");
    //Get form
    const form = document.querySelector("#film-form");
    //Insert alert
    container.insertBefore(div, form);

    //Timeout to alert disappear
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3456);
  }

  deleteFilm(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    title.value = "";
    director.value = "";
    description.value = "";
    [title, director, description].forEach(function (singleInput) {
      singleInput.parentNode.children[1].style.display = "block";
    });
  }
}

//Local Storage Class
class Store {
  static getFilms() {
    let films;
    if (localStorage.getItem("films") === null) {
      films = [];
    } else {
      films = JSON.parse(localStorage.getItem("films"));
    }
    return films;
  }
  static displayFilms() {
    const films = Store.getFilms();
    films.forEach((film) => {
      const ui = new UI();
      //Add film to UI
      ui.addFilmToList(film);
    });
  }
  static addFilm(film) {
    const films = Store.getFilms();
    films.push(film);
    localStorage.setItem("films", JSON.stringify(films));
  }
  static removeFilm(uid) {
    const films = Store.getFilms();

    films.forEach((film, index) => {
      if (film.uid === uid * 1) {
        films.splice(index, 1);
      }
    });
    localStorage.setItem("films", JSON.stringify(films));
  }
}

//DOM Load Event
document.addEventListener("DOMContentLoaded", Store.displayFilms);

//Event Listeners
const title = document.getElementById("title");
const director = document.getElementById("director");
const description = document.getElementById("description");

[title, director, description].forEach(function (singleInput) {
  singleInput.addEventListener("blur", function () {
    if (singleInput.value) {
      singleInput.parentNode.children[1].style.display = "none";
    } else {
      singleInput.parentNode.children[1].style.display = "block";
    }
  });
});

document.getElementById("film-form").addEventListener("submit", function (e) {
  e.preventDefault();

  //Instatiate film
  const film = new Film(title.value, director.value, description.value);

  //Instatantiate UI
  const ui = new UI();

  //Validate
  if (title.value === "" || director.value === "" || description.value === "") {
    //Error alert
    ui.showAlert("Wszystkie pola są wymagane", "error");
  } else {
    //Add film to list
    ui.addFilmToList(film);
    //Add to LocalStorage
    Store.addFilm(film);

    //Show alert
    ui.showAlert("Film dodano do kolekcji", "success");

    //Clear fields
    ui.clearFields();
  }
});

document.getElementById("film-list").addEventListener("click", function (e) {
  //Instatantiate UI
  const ui = new UI();

  e.preventDefault();
  ui.deleteFilm(e.target);
  Store.removeFilm(
    e.target.parentElement.parentElement.getAttribute("data-uid")
  );

  //Show alert
  ui.showAlert("Film usunięto z kolekcji", "neutral");
});
