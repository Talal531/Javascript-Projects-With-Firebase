var emailInput = document.getElementById("email");
var passwordInput = document.getElementById("password");
var nameInput = document.getElementById("name");
var database = firebase.database();
var auth = firebase.auth();

function signup() {
    var email = emailInput.value;
    var password = passwordInput.value;
    var name = nameInput.value;

    auth
        .createUserWithEmailAndPassword(email, password)
        .then(function (user) {
            var currentUser = {
                name: name,
                email: email
            }
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            location = 'login.html';
        })
        .catch(function (error) {
            console.log(error.message);
        })

}

function login() {
    var email = emailInput.value;
    var password = passwordInput.value;

    auth.signInWithEmailAndPassword(email, password).then(function (user) {
        localStorage.setItem("log",'1')
            location = 'home.html';
        })
        .catch(function (error) {
            alert(error.message);
        })
}
function checkLog() {
    if (localStorage.getItem('log') === '0') {

        alert("Login First")
        location = 'index.html';

    }
}

function logout() {
    // var email = emailInput.value;
    // var password = passwordInput.value;
    auth.signOut().then(function(){
        console.log("signout successfull");
        localStorage.setItem('log','0');
        location = "login.html";
    }).catch (function(error){
        console.log("Error Happend", error);
    });
}