const endpoints = {
  login: "/session",
  register: "/users",

  credentials: "/credentials",
  profile: "/user/profile",
};

const api = "https://password-manager-project.herokuapp.com";

document.getElementById("setPassword1").onclick = function () {
  let text = document.getElementById("passwordToStore");
  let username = document.getElementById("userName");
  let note = document.getElementById("note");

  StorePassword1(username.value, text.value, note.value);
};

function load() {
  let url;
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tabs) {
      url = tabs[0].url;
      let value = localStorage.getItem(url);
    }
  );
}

function store(inputUsername, encodedPassword, note) {
  if (typeof localStorage == "undefined") {
    alert("Your browser does not support HTML5 localStorage. Try upgrading.");
  } else {
    try {
      chrome.tabs.query(
        { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },

        function (tabs) {
          url = tabs[0].url;
          localStorage.setItem(url, inputUsername + "0+/" + encodedPassword);

          const token = localStorage.getItem("authToken");
          let headers = new Headers();

          headers.append("Content-Type", "application/json");
          headers.append("Access-Control-Allow-Accept", "*");
          headers.append("Access-Control-Allow-Origin", "*");

          fetch(
            `${api}${endpoints.credentials}?credential[website]=${url}&credential[login]=${inputUsername}&
			credential[password]=${encodedPassword}&
			credential[notes]=${note}&session[token]=${token}`,
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
              }
            });
        }
      );
    } catch (e) {
      console.log(e);
    }
  }
}

function StorePassword1(username, password, note) {
  let encrypted = CryptoJS.AES.encrypt(password, "Secret Passphrase");

  let url;
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tabs) {
      url = tabs[0].url;
    }
  );
  store(username, encrypted, note);
}
