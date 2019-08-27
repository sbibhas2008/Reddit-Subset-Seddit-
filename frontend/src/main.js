
import apiUrl from '/src/backend_url.js';
import {getPosts, handleUserProfile} from '/src/posts.js';
import handleSettingsModal from '/src/settingsModal.js';



function handle_index() {
  if (document.getElementById("profile_badge") != null) {
    document.getElementById("profile_badge").style.display = "none";
  }
  document.getElementById("loginNav").style.display = "";
  document.getElementById("search").style.display = "none";
  document.getElementById("search1").style.display = "";
  document.getElementById("signupNav").style.display = "";
  getPosts();
}


function getProfileBadge() {

  if (document.getElementById("profile_badge") != null) {
    document.getElementById("fixed_nav").removeChild(document.getElementById("profile_badge"));
  }

  var fetchData = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': "Token   " + localStorage.getItem("authToken")
    }
  }
  fetch(apiUrl  + "/user/?username=" + sessionStorage.getItem("username"), fetchData)
  .then(response => response.json())
  .then(data => {
    var profileli = document.createElement("li");
    profileli.classList.add("nav-item");
    profileli.id = "profile_badge";
    var profileDropdown = document.createElement("div");
    profileDropdown.classList.add("profile-div");
    var profileImg = document.createElement("i");
    profileImg.classList.add("profile-div-item");
    profileImg.classList.add("material-icons");
    profileImg.innerText = "account_box";
    profileImg.classList.add("profile-icon");
    var user_name = document.createElement("p");
    user_name.classList.add("profile-div-item");
    user_name.innerText = data.username;
    user_name.classList.add("profile-div-uname");
    var posts_upvotes_div = document.createElement("div");
    posts_upvotes_div.classList.add("profile-div-posts-upvotes");
    var posts = document.createElement("p");
    posts.innerText = data.posts.length + " posts";
    posts.classList.add("profile-div-p");
    var upvotes = document.createElement("p");
    // get number of upvotes
    for (var post of data.posts) {
      fetchData = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': "Token   " + localStorage.getItem("authToken")
        }
      }
      fetch(apiUrl  + "/post/?id=" + post, fetchData)
      .then(response => response.json())
      .then(data1 => {
        var votes = 0;
        if (localStorage.getItem("totalUpvotes") != null) {
          votes = parseInt(localStorage.getItem("totalUpvotes"));
        }
        votes += data1.meta.upvotes.length;
        localStorage.setItem("totalUpvotes", String(votes));
        upvotes.innerText = String(localStorage.getItem("totalUpvotes")) + " upvotes";
      });
    }

    localStorage.removeItem("totalUpvotes");
    upvotes.classList.add("profile-div-p");
    posts_upvotes_div.appendChild(posts);
    posts_upvotes_div.appendChild(upvotes);
    var arrow = document.createElement("i");
    arrow.classList.add("material-icons");
    arrow.innerText = "arrow_drop_down";
    arrow.classList.add("profile-div-item");
    arrow.style.cssFloat = "right";


    // the menu part
    var menu = document.createElement("div");
    menu.classList.add("dropdown-content");
    var profileBtn = document.createElement("div");
    profileBtn.innerText = "Profile";
    var settingsBtn = document.createElement("div");
    settingsBtn.innerText = "User Settings";
    var logoutBtn = document.createElement("div");
    logoutBtn.innerText = "Log Out";
    logoutBtn.id = "logOutNav";

    profileBtn.addEventListener("click", function() {
      handleUserProfile(sessionStorage.getItem("username"));
    });

    logoutBtn.addEventListener("click", function(){
      sessionStorage.clear();
      localStorage.clear();
      handle_index();
    });

    settingsBtn.addEventListener("click", function() {
      handleSettingsModal();

    });

    settingsBtn.id = "settingaNav";
    menu.appendChild(profileBtn);
    menu.appendChild(settingsBtn);
    menu.appendChild(logoutBtn);


    profileDropdown.appendChild(posts_upvotes_div);
    profileDropdown.appendChild(profileImg);
    profileDropdown.appendChild(user_name);
    profileDropdown.appendChild(arrow);
    profileDropdown.appendChild(menu);
    profileli.appendChild(profileDropdown);
    document.getElementById("fixed_nav").appendChild(profileli);
  })
}

function validate_login() {

localStorage.clear();

  var uname, pwd, username, password, error_text;

  if (sessionStorage.getItem("username") != null && sessionStorage.getItem("password") != null) {
    uname = sessionStorage.getItem("username");
    pwd = sessionStorage.getItem("password");
    username = document.getElementById("login_username");
    password = document.getElementById("login_password");
    error_text = document.getElementById("error_field");
  }
  else {
    uname = document.getElementById("login_username").value;
    pwd = document.getElementById("login_password").value;
    username = document.getElementById("login_username");
    password = document.getElementById("login_password");
    error_text = document.getElementById("error_field");
  }
  if (uname == "" || pwd == "") {

    error_text.innerText = "Fields cannot be empty";
  }
  else {
    error_text.innerText = "";
    username.value = "";
    password.value = "";
    const url = apiUrl  + "/auth/login";

    var data = {
      "username": String(uname),
      "password": String(pwd)
    }

    var fetchData = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    fetch(url, fetchData)
    .then(function(response) {
      if (response.status !== 200) {
          error_text.innerText =  "Invalid Username or Password";
      }else if (response.status == 200) {
        document.getElementById("contact").style.display = "none";

        var login_button_nav = document.getElementById("loginNav");
        var signupButton_nav = document.getElementById("signupNav");
        login_button_nav.style.display = "none";
        signupButton_nav.style.display = "none";
        document.getElementById("search1").style.display = "none";
        document.getElementById("search").style.display = "";
        sessionStorage.setItem("username", String(uname));
        sessionStorage.setItem("password", String(pwd));


        getProfileBadge();
        fetch(url, fetchData)
        .then(response => response.json())
        .then(data => {
          localStorage.setItem("authToken", JSON.stringify(data));
        });
        getPosts();

      }
    });
  }
}

function validate_signUp(uname, pwd, pwd_check, email, name, error_text_signup) {
  if (uname == "" || pwd == "" || pwd_check == "") {
    error_text_signup.innerText =  "Fields cannot be empty";
  }
  else if (pwd != pwd_check) {
    error_text_signup.innerText =  "Passwords dont match";
  }
  // https://www.w3resource.com/javascript/form/email-validation.php for regex
  else if (! (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
    error_text_signup.innerText = "Invalid Email";
  }
  // send to server
  else {
    const url = apiUrl  + "/auth/signup";

    var data = {
      "username": String(uname),
      "password": String(pwd),
      "email": String(email),
      "name": String(name)
    }

    var fetchData = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    fetch(url, fetchData)
    .then(function(response) {
      if (response.status == 409) {
          error_text_signup.innerText =  "Username Taken";
      }else if (response.status == 200) {
        // do something instead of returning successful
        document.getElementsByClassName("box")[1].style.display = "none";
        getPosts();

      }
    });
  }
}


function initApp(apiUrl) {

  localStorage.removeItem("postIndex");
  var head = document.createElement("header");
  head.classList.add("banner");
  head.id = "nav";
  var heading = document.createElement("h1");
  heading.classList.add("flex-center");
  heading.id = "logo";
  var node = document.createTextNode("Seddit");
  heading.appendChild(node);
  head.appendChild(heading);
  var nav = document.createElement("ul");
  nav.classList.add("nav");
  nav.id = "fixed_nav";
  var list_item0  = document.createElement("li");
  list_item0.classList.add("nav-item");
  var input0 = document.createElement("input");
  input0.id = "search1";
  input0.setAttribute("data-id-search", "");
  input0.placeholder = "Search Seddit";
  input0.type = "search";
  list_item0.appendChild(input0);
  nav.appendChild(list_item0);
  var list_item1  = document.createElement("li");
  list_item1.classList.add("nav-item");
  var input = document.createElement("input");
  input.id = "search";
  input.setAttribute("data-id-search", "");
  input.placeholder = "Search Seddit";
  input.type = "search";
  list_item1.appendChild(input);
  nav.appendChild(list_item1);
  var list_item2 = document.createElement("li");
  list_item2.classList.add("nav-item");
  list_item2.id = "li2";
  var bt_root_login = document.createElement("button");
  bt_root_login.id = "loginNav";
  bt_root_login.setAttribute("data-id-login", "");
  bt_root_login.classList.add("button_type_1");
  var name = document.createTextNode("Log In");
  bt_root_login.appendChild(name);
  list_item2.appendChild(bt_root_login);
  nav.appendChild(list_item2);
  var list_item3 = document.createElement("li");
  list_item3.id = "li3";
  list_item3.classList.add("nav-item");
  var bt_root_signup = document.createElement("button");
  bt_root_signup.id = "signupNav";
  bt_root_signup.setAttribute("data-id-signup", "");
  bt_root_signup.classList.add("button_type_2");
  name = document.createTextNode("Sign Up");
  bt_root_signup.appendChild(name);
  list_item3.appendChild(bt_root_signup);
  nav.appendChild(list_item3);
  head.appendChild(nav);
  document.body.appendChild(head);

  // Login Part handled here

  var login_box = document.createElement("div");
  login_box.classList.add("box");
  login_box.id = "contact";
  var username = document.createElement("input");
  username.placeholder = "Username";
  username.classList.add("input-field");
  username.id = "login_username";
  var password = document.createElement("input");
  password.placeholder = "Password";
  password.classList.add("input-field");
  password.type = "password";
  password.id = "login_password";
  var bt1 = document.createElement("button");
  var bt_desc = document.createTextNode("Login");
  bt1.classList.add("button_type_1");
  bt1.appendChild(bt_desc);
  bt1.setAttribute("data-id-login", "");
  var bt2 = document.createElement("button");
  bt_desc = document.createTextNode("Signup");
  bt2.classList.add("button_type_1");
  bt2.appendChild(bt_desc);
  bt2.setAttribute("data-id-signup", "");
  login_box.appendChild(username);
  login_box.appendChild(password);
  var error_text = document.createElement("p");
  error_text.style.color = "red";
  error_text.id = "error_field"
  login_box.appendChild(error_text);
  login_box.appendChild(bt1);
  login_box.appendChild(bt2);
  var cross_icon = document.createElement("a");
  cross_icon.href = "index.html";
  cross_icon.classList.add("close");
  login_box.appendChild(cross_icon);
  document.body.appendChild(login_box);

  // SignUp part handled here

  var signup_box = document.createElement("div");
  signup_box.classList.add("box");
  signup_box.id = "contact";
  var new_username = document.createElement("input");
  new_username.placeholder = "Enter a username";
  new_username.classList.add("input-field");
  var new_password = document.createElement("input");
  new_password.placeholder = "Create a password";
  new_password.classList.add("input-field");
  new_password.type = "password";
  var confirm_password = document.createElement("input");
  confirm_password.placeholder = "Confirm Password";
  confirm_password.classList.add("input-field");
  confirm_password.type = "password";
  var name = document.createElement("input");
  name.placeholder = "Full Name";
  name.classList.add("input-field");
  var email = document.createElement("input");
  email.placeholder = "Email Address";
  email.classList.add("input-field");
  var bt3 = document.createElement("button");
  bt_desc = document.createTextNode("Register");
  bt3.classList.add("button_type_1");
  bt3.appendChild(bt_desc);
  bt3.setAttribute("data-id-signup", "");
  var bt4 = document.createElement("button");
  bt_desc = document.createTextNode("Cancel");
  bt4.classList.add("button_type_1");
  bt4.appendChild(bt_desc);
  signup_box.appendChild(new_username);
  signup_box.appendChild(new_password);
  signup_box.appendChild(confirm_password);
  signup_box.appendChild(name);
  signup_box.appendChild(email);
  var error_text_signup = document.createElement("p");
  error_text_signup.style.color = "red";
  signup_box.appendChild(error_text_signup);
  signup_box.appendChild(bt3);
  signup_box.appendChild(bt4);
  document.body.appendChild(signup_box);


  document.getElementById("loginNav").addEventListener("click", function() {
    document.getElementById("feedDiv").style.display = "none";
    signup_box.style.display = "none";
    login_box.style.display = "block";

  });

  bt_root_signup.addEventListener("click", function() {
    document.getElementById("feedDiv").style.display = "none";
    login_box.style.display = "none";
    signup_box.style.display = "block";

  });

  bt1.addEventListener("click", function() {

    var u = username.value;
    var p = password.value;
    validate_login(u,p, username, password, error_text);

  });

  bt3.addEventListener("click", function() {
    validate_signUp(new_username.value, new_password.value, confirm_password.value, email.value, name.value, error_text_signup);

  });

  bt2.addEventListener("click", function() {
    document.getElementById("feedDiv").style.display = "none";
    login_box.style.display = "none";
    signup_box.style.display = "block";
  });

  bt4.addEventListener("click", function() {
    document.getElementById("feedDiv").style.display = "block";
    login_box.style.display = "none";
    signup_box.style.display = "none";
  });

  if (sessionStorage.getItem("username") != null){
    validate_login();

  }
  else {
    handle_index();
  }
}

export default initApp;
