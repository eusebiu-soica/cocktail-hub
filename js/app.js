const URL_Base = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const ingredientsList = document.querySelector(".ingredientsList");
const cocktailDetails = document.querySelector(".cocktail-details");
const cocktailList = document.querySelector(".cocktail-list");
const cocktailImage = document.querySelector("#cocktailImage");
const cocktailRecipe = document.querySelector("#recipeText");
const bener = document.querySelector("#bener");
const allIngredients = document.querySelector(".allIngredient");
const myCocktails = document.querySelector(".myCocktails");

// this function return a list of cocktail based on client search
function displayCocktail(cocktails) {
  ingredientsList.innerHTML = ``;
  cocktailDetails.style.display = "none";
  for (i in cocktails.drinks) {
    if (
      cocktails.drinks[i].strDrink
        .toLowerCase()
        .includes(searchInput.value.trim().toLowerCase()) == false
    ) {
      alert("Someone drink everything!!! Call 112");
    } else {
      cocktailList.innerHTML += `<span onclick="displayInfo('${cocktails.drinks[i].strDrink}')">${cocktails.drinks[i].strDrink}</span>`;

      if (cocktails.drinks.length == 1) {
        cocktailDetails.style.display = "flex";
        cocktailImage.src = cocktails.drinks[i].strDrinkThumb;
        cocktailRecipe.innerText = cocktails.drinks[i].strInstructions;

        for (let x = 1; x < 16; x++) {
          if (
            cocktails.drinks[i][`strIngredient${x}`] == null ||
            cocktails.drinks[i][`strIngredient${x}`] == ""
          ) {
            break;
          } else {
            ingredientsList.innerHTML += `
                <span>${cocktails.drinks[i][`strIngredient${x}`]} (${
              cocktails.drinks[i][`strMeasure${x}`]
            })</span>`;
          }
        }
      }
    }
  }
}

// this function return all details about a cocktail when client click on cocktail name
function displayInfo(cocktail) {
  ingredientsList.innerHTML = ``;
  url = URL_Base + searchInput.value;
  cocktailDetails.style.display = "flex";
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then(function (data) {
      for (i in data.drinks) {
        if (
          data.drinks[i].strDrink.toLowerCase().includes(cocktail.toLowerCase())
        ) {
          cocktailImage.src = data.drinks[i].strDrinkThumb;
          cocktailRecipe.innerText = data.drinks[i].strInstructions;
          for (let x = 1; x < 16; x++) {
            if (
              data.drinks[i][`strIngredient${x}`] == null ||
              data.drinks[i][`strIngredient${x}`] == ""
            ) {
              break;
            } else {
              ingredientsList.innerHTML += `
                <span>${data.drinks[i][`strIngredient${x}`]} (${
                data.drinks[i][`strMeasure${x}`]
              })</span>`;
            }
          }
        }
      }
    });
}

function searchCocktail() {
  if (searchInput.value == "") {
    alert("Please enter a cocktail in search");
  } else {
    bener.style.display = "none";
    let url = URL_Base + searchInput.value;
    cocktailList.innerHTML = "";
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then(function (data) {
        displayCocktail(data);
      });
  }
}

// generate list with ingredients
function Allingredients() {
  fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list")
    .then((response) => response.json())
    .then(function (ingrediente) {
      for (let i in ingrediente.drinks) {
        allIngredients.innerHTML += `<span onclick="selectIngredient(this)">${ingrediente.drinks[i].strIngredient1}</span>
          `;
      }
    });
}

// select and deselect in grediants
let selectIngredients = [];
function selectIngredient(e) {
  if (e.style.backgroundColor === "lightseagreen") {
    e.style.backgroundColor = "#191822";
    e.style.color = "#707793";
    for (let i in selectIngredients) {
      if (e.innerText == selectIngredients[i]) {
        console.log(selectIngredients.splice(i, 1));
        console.log(selectIngredients);
      }
    }
  } else {
    e.style.backgroundColor = "lightseagreen";
    e.style.color = "#2a2a2a";
    selectIngredients.push(e.innerText);
    console.log(selectIngredients);
  }
}

// show cocktail by selected ingredients
function searchByIngredient() {
  myCocktails.innerHTML = "";
  if (selectIngredients.length == 0) {
    alert("Please select an ingredient :)");
  }
  for (let i in selectIngredients) {
    fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${selectIngredients[i]}`
    )
      .then((response) => response.json())
      .then(function (date) {
        for (let x in date.drinks) {
          myCocktails.innerHTML += `<span>${date.drinks[x].strDrink}</span>`;
        }
      });
  }
}
