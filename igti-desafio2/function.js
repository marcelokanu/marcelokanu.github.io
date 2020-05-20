let allUsers = [];
let totalMale = 0;
let totalFemale = 0;
let totalAge = 0;
let mediaAge = 0;

let numberFormat = null;

window.addEventListener("load", () => {
  title = document.querySelector("#title");
  loader = document.querySelector("#loader");
  contentResult = document.querySelector("#content-result")
  
  contentResult.style.visibility='hidden';
  inputFind = document.querySelector("#inputFind");
  buttonFind = document.querySelector("#buttonFind");

  buttonFind.disabled = true;
  inputFind.disabled = true;

  countUsers = document.querySelector("#countUsers");
  listUsers = document.querySelector("#listUsers");

  totalMale = document.querySelector("#totalMale");
  totalFemale = document.querySelector("#totalFemale");
  totalAge = document.querySelector("#totalAge");
  mediaAge = document.querySelector("#mediaAge");

 

  numberFormat = Intl.NumberFormat("pt-BR");

  fetchUsers();
});

async function fetchUsers() {
  const res = await fetch(
    "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo"
  );

  const json = await res.json();

  title.removeChild(loader);
  inputFind.disabled = false;
  contentResult.style.visibility='visible';

  allUsers = json.results.map((user) => {
    const { login, name, dob, gender, picture } = user;
    return {
      id: login.uuid,
      name: name.first + " " + name.last,
      age: dob.age,
      gender,
      picture: picture.large,
    };
  });

  countUsers.innerHTML = `${allUsers.length}`;

  render();
}

function render() {
  preventFormSubmit();

  if (!inputFind.value) {
    renderUsers(allUsers);
    renderStatistics(allUsers);
  }
}

function preventFormSubmit() {
  const handleFormSubmit = () => event.preventDefault();
  var form = document.querySelector("form");

  form.addEventListener("submit", handleFormSubmit);

  inputFind.addEventListener("keyup", handleVerifyValue);
  inputFind.focus();

  
  buttonFind.addEventListener("click", handleSearchButton);
}

function renderUsers(array) {
  let usersHTML = "<ul>";

  if (!inputFind.value) {
    array = allUsers;
  }

  countUsers.innerHTML = array.length;

  array.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  array.forEach((user) => {
    const { id, name, age, gender, picture } = user;
    const userHTML = `
      <li>
        <img src="${picture}" alt="${name}" />
        <span>${name}, ${age} anos.</span>
      </li>
    `;
    usersHTML += userHTML;
  });

  listUsers.innerHTML = usersHTML + "</ul>";
}

function renderStatistics(array) {
  if (!inputFind.value) {
    array = allUsers;
  }

  const arrayMale = array.filter((user) => user.gender === "male");
  const arrayFemale = array.filter((user) => user.gender === "female");

  totalMale.innerHTML = arrayMale.length;
  totalFemale.innerHTML = arrayFemale.length;

  const agesTotal = array.reduce((acc, current) => {
    return acc + current.age;
  }, 0);
  totalAge.innerHTML = array.length !== 0 ? formatNumber(agesTotal) : 0;

  const agesMedia =
    array.length !== 0 ? formatNumber(agesTotal / array.length) : 0;
  mediaAge.innerHTML = agesMedia;
}

function handleVerifyValue(event) {
  if (!inputFind.value) {
    buttonFind.disabled = true;
    renderUsers(allUsers);
    renderStatistics(allUsers);
  } else {
    buttonFind.disabled = false;
  }

  const filteredUsers = allUsers.filter((user) => {
    const normalizedName = user.name
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const normalizedInput = inputFind.value
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return normalizedName.includes(normalizedInput);
  });

  renderUsers(filteredUsers);
  renderStatistics(filteredUsers);
}

function formatNumber(number) {
  return numberFormat.format(number);
}

 function handleSearchButton(event) {
  if (!inputFind.value) {
    buttonFind.disabled = true;
  } else {
    buttonFind.disabled = false;
  }

  const filteredUsers = allUsers.filter((user) => {
    const normalizedName = user.name
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const normalizedInput = inputFind.value
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return normalizedName.includes(normalizedInput);
  });

  renderUsers(filteredUsers);
  renderStatistics(filteredUsers);

}
