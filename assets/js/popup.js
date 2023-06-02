const endpoints = {
  login: "/session",
  register: "/users",

  credentials: "/credentials",
  profile: "/user/profile",
};

let headers = new Headers();

headers.append("Content-Type", "application/json");
headers.append("Access-Control-Allow-Accept", "*");
headers.append("Access-Control-Allow-Origin", "*");

const api = "https://password-manager-project.herokuapp.com";
var urlRegex = /^file:\/\/\/:?/;

/* A function creator for callbacks */
function doStuffWithDOM(element) {
  alert("I received the following DOM content:\n" + element);
}

const getAuthUserToken = () => {
  return localStorage.getItem("authToken");
};

const showRegister = (e) => {
  e.preventDefault();
  e.stopPropagation();

  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "flex";
};

const showLogin = (e) => {
  e.preventDefault();
  e.stopPropagation();

  document.getElementById("login-form").style.display = "flex";
  document.getElementById("register-form").style.display = "none";
};

const getUser = () => {
  const token = localStorage.getItem("authToken");

  fetch(`${api}${endpoints.profile}?session[token]=${token}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);

      document.getElementById("user_name").innerHTML =
        data.current_user.name + " " + data.current_user.surname;
    });
};

const getCredentials = () => {
  const token = localStorage.getItem("authToken");

  fetch(`${api}${endpoints.credentials}?session[token]=${token}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      document.getElementById("list").addEventListener();
    });
};

const login = (e) => {
  e.preventDefault();
  e.stopPropagation();

  fetch(
    `${api}${endpoints.login}?session[email]=${
      document.getElementById("email-input1").value
    }&session[password]=${document.getElementById("password-input2").value}`,
    {
      method: "POST",
      mode: "cors",
      headers: headers,
      referrerPolicy: "no-referrer",
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.token) {
        localStorage.setItem("authToken", data.token);

        document.getElementById("register").style.display = "none";
        document.getElementById("main").style.display = "block";
        getUser();
      } else {
        alert("Wrong login or password");
      }
    });
};

const register = (e) => {
  e.preventDefault();
  e.stopPropagation();
  fetch(
    `${api}${endpoints.register}?user[email]=${
      document.getElementById("email-input").value
    }&user[surname]=${
      document.getElementById("surname-input").value
    }&user[name]=${
      document.getElementById("name-input").value
    }&user[password]=${
      document.getElementById("password-input1").value
    }&user[date]=10/06/2001`,
    {
      method: "POST",
      mode: "cors",
      headers: headers,
      referrerPolicy: "no-referrer",
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.token) {
        localStorage.setItem("authToken", data.token);

        document.getElementById("register").style.display = "none";
        document.getElementById("main").style.display = "block";
        getUser();
      } else {
        alert("An error occured while processing your operation");
      }
    });
};

const logOut = (e) => {
  e.preventDefault();
  e.stopPropagation();

  fetch(`${api}${endpoints.login}`, {
    method: "DELETE",
    mode: "cors",
    headers: headers,
    referrerPolicy: "no-referrer",
  });
  localStorage.removeItem("authToken");
  document.getElementById("register").style.display = "block";
  document.getElementById("main").style.display = "none";
};

document.addEventListener("DOMContentLoaded", function (event) {
  document.getElementById("login-link").addEventListener("click", showLogin);
  document
    .getElementById("register-link")
    .addEventListener("click", showRegister);

  document.getElementById("register-btn").addEventListener("click", register);
  document.getElementById("login-btn").addEventListener("click", login);
  document.getElementById("log-out").addEventListener("click", logOut);
});

document.addEventListener("DOMContentLoaded", function (event) {
  if (getAuthUserToken()) {
    getUser();

    document.getElementById("register").style.display = "none";
    document.getElementById("main").style.display = "block";
  } else {
    document.getElementById("register").style.display = "block";
    document.getElementById("main").style.display = "none";
  }
});

chrome.browserAction.onClicked.addListener(function (tab) {
  if (urlRegex.test(tab.url)) {
    chrome.tabs.sendMessage(tab.id, { text: "report_back" }, doStuffWithDOM);
  }
});
