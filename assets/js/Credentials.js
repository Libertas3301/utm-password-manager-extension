const endpoints = {
  login: "/session",
  register: "/users",

  credentials: "/credentials",
  profile: "/user/profile",
};

const api = "https://password-manager-project.herokuapp.com";

const getCredentials = () => {
  const token = localStorage.getItem("authToken");

  fetch(`${api}${endpoints.credentials}?session[token]=${token}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (!data?.credentials || data?.credentials.length <= 0) return;

      data?.credentials?.map((item, index) => {
        document.getElementById("list").innerHTML += `
        <div class="card">
            <h4 class="card__title">Website No ${index}</h4>
            <a href="https://www.example1.com" class="card__link">${
              item.website
            }</a>
            <p class="card__login">Username: ${item.login}</p>
            <p class="card__login">Note: ${item.notes ?? ""}</p>
        </div>`;
      });
    });
};

document.addEventListener("DOMContentLoaded", function (event) {
  getCredentials();
});
