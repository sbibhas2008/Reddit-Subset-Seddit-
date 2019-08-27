import apiUrl from '/src/backend_url.js'



function handleSettingsModal() {

    if (document.getElementById("settingsModal") != null) {
      document.body.removeChild(document.getElementById("settingsModal"));
    }
     var settingsModal = document.createElement("div");
     settingsModal.classList.add("modal");
     settingsModal.style.minHeight = "200px";
     settingsModal.id = "settingsModal";
     var modalContent = document.createElement("div");
     modalContent.classList.add("modal-content");
     var modalHeading = document.createElement("div");
     modalHeading.classList.add("modal-header");
     var heading = document.createElement("h2");
     heading.innerText = "SETTINGS";
     modalHeading.appendChild(heading);
     modalContent.appendChild(modalHeading);
     var modalBody = document.createElement("div");
     modalBody.classList.add("post-container");
     modalBody.style.marginTop = "75px";
     var newPassword = document.createElement("input");
     newPassword.classList.add("post-field");
     newPassword.placeholder = "New Password"
     var confirm_password = document.createElement("input");
     confirm_password.classList.add("post-field");
     confirm_password.placeholder = "Confirm Password"
     var email = document.createElement("input");
     email.classList.add("post-field");
     email.placeholder="New email";
     var username = document.createElement("input");
     username.classList.add("post-field");
     username.placeholder = "New Name";
     var submitBtn = document.createElement("button");
     submitBtn.classList.add("post-field");
     submitBtn.innerText = "COMFIRM";
     submitBtn.classList.add("button_type_2");
     var error_text = document.createElement("p");
     error_text.style.color = "red";
     error_text.style.display = "none";

     modalBody.appendChild(newPassword);
     modalBody.appendChild(confirm_password);
     modalBody.appendChild(email);
     modalBody.appendChild(username);
     modalBody.appendChild(submitBtn);
     modalBody.appendChild(error_text);

     modalContent.appendChild(modalBody);

     var data;

     submitBtn.addEventListener("click", function() {
      if (newPassword.value != "" && confirm_password.value != "" && email.value != "" && username.value != "") {
        // edit all
        if (newPassword.value != confirm_password.value) {
          data = {
            "email" : email.value,
            "name" : username.value,
            "password" : newPassword.value
          }
        }
      }
      else if (newPassword.value != "" && confirm_password.value != "" && email.value != ""){
        if (newPassword.value == confirm_password.value) {
          data = {
            "email" : email.value,
            "password" : newPassword.value
          }
        }
        else {
          error_text.innerText = "Passwords do not match";
          error_text.style.display = "";
        }
      }
      else if (newPassword.value != "" && confirm_password.value != "" && username.value != "") {
        if (newPassword.value == confirm_password.value) {
          data = {
            "name" : username.value,
            "password" : newPassword.value
          }
        }
        else {
          error_text.innerText = "Passwords do not match";
          error_text.style.display = "";
        }
      }
      else if (username.value != "" && email.value != "") {
        data = {
          "name" : username.value,
          "email" : email.value
        }
      }
      else if (newPassword.value != "" && confirm_password.value != "") {
        if (newPassword.value == confirm_password.value) {
          data = {
            "password" : newPassword.value
          }
        }
        else {
          error_text.innerText = "Passwords do not match";
          error_text.style.display = "";
        }
      }
      else if (username.value != "") {
        data = {
          "name" : username.value
        }

      }
      else if (email.value != "") {
        data = {
          "email" : email.value
        }
      }
      // both passwords must be supplied error
      else if ((username.value != "" && email.value == "") || (username.value == "" && email.value != "")) {
          error_text.innerText = "Passwords do not match";
          error_text.style.display = "";
      }
      // throw an error
      else {
          error_text.innerText = "At least one field should be filled";
          error_text.style.display = "";
      }

      if (data != null) {
        var fetchData = {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token   " + localStorage.getItem("authToken")
          }
        }
        fetch(apiUrl  + "/user", fetchData)
        .then(function(response) {
        });

     }


    });


    settingsModal.appendChild(modalContent);
    document.body.appendChild(settingsModal);
    document.getElementById("settingsModal").style.display = "block";



     window.addEventListener("click", function(event) {
       if (event.target == settingsModal) {
         settingsModal.style.display = "none";
       }
     });


   }





export default handleSettingsModal