let globalResults = [];

// Fonction qui affiche un message dans le tableau de manière dynamique (erreur, chargement ...)
function displayMessage(message) {
  const tbody = document.querySelector("#tbl-users tbody");
  tbody.innerHTML = `<td colspan="6" style="text-align: center;">${message}</td>`;
}

// Fonction qui apelle les utilsateurs et stock le resultat trié par ordre alphabétique dans une variable globale globale
async function fetchUsers() {
  try {
    displayMessage("Chargement en cours...");
    const response = await fetch("https://randomuser.me/api/?results=20");
    const { results } = await response.json();

    globalResults = [...results].sort((a, b) =>
      a.name.first.localeCompare(b.name.first)
    );
    render(globalResults);
  } catch (error) {
    console.error("Error fetching users:", error);
    displayMessage("Erreur lors du chargement des utilisateurs");
  }
}

async function addUsers() {
  try {
    if (globalResults && globalResults.length > 0) {
      displayMessage("Additionnement des utilisateurs en cours...");
      const response = await fetch("https://randomuser.me/api/?results=20");
      const { results } = await response.json();

      globalResults = [...globalResults, ...results].sort((a, b) =>
        a.name.first.localeCompare(b.name.first)
      );
      render(globalResults);
    } else {
      displayMessage("Fetch des utilisateurs avant");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// Fonction qui affiche les utilisateurs dans le tableau
function render(results) {
  const tbody = document.querySelector("#tbl-users tbody");

  if (results.length === 0) {
    displayMessage("Aucun utilisateur trouvé");
    return;
  }

  tbody.innerHTML = results
    .map(
      (user) => `
        <tr>
            <td><img src="${user.picture.thumbnail}" alt="${
        user.name.first
      } Photo"></td>
            <td>${user.name.first} ${user.name.last}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.gender === "male" ? "👨" : "👩"}</td>
            <td>${user.dob.age}</td>
        </tr>
      `
    )
    .join("");
}

// Fonction qui filtre les utilisateurs par genre
function filterUsers() {
  const filterValue = document.getElementById("filter-gender").value;

  if (filterValue === "all") {
    render(globalResults);
  } else {
    const filteredResults = globalResults.filter(
      (user) => user.gender === filterValue
    );
    render(filteredResults);
  }
}

// Fonction qui trie les utilisateurs par age
function sortByAge() {
  const sort = document.getElementById("sort-age").value;
  if (sort === "none") {
    render(globalResults);
  } else if (sort === "older-first") {
    const sortedResults = [...globalResults].sort(
      (a, b) => b.dob.age - a.dob.age
    );
    render(sortedResults);
  } else if (sort === "younger-first") {
    const sortedResults = [...globalResults].sort(
      (a, b) => a.dob.age - b.dob.age
    );
    render(sortedResults);
  }
}

// Fonction qui recherche les utilisateurs via le champ de recherche, casse comprise,
//  la gestion des accents est déjà gérer par javascript de manière native et inclusive
function search() {
  const searchValue = document
    .getElementById("search")
    .value.trim()
    .toLowerCase();

  if (searchValue === "") {
    render(globalResults);
    return;
  }

  const filteredResults = globalResults.filter(
    (user) =>
      user.email.toLowerCase().includes(searchValue) ||
      user.phone.toLowerCase().includes(searchValue) ||
      user.name.first.toLowerCase().includes(searchValue) ||
      user.name.last.toLowerCase().includes(searchValue)
  );

  render(filteredResults);
}

// Ajout des écouteurs d'événements
document.getElementById("fetch-users").addEventListener("click", fetchUsers);
document.getElementById("add-users").addEventListener("click", addUsers);
document.getElementById("search-button").addEventListener("click", search);
document
  .getElementById("filter-gender")
  .addEventListener("change", filterUsers);
document.getElementById("sort-age").addEventListener("change", sortByAge);

// Au chargment de la page, j'affice un message de base dans le tableau qui est vide
document.addEventListener("DOMContentLoaded", () => {
  displayMessage("Aucun utilisateur chargé");
});
