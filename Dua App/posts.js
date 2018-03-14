var database = firebase
    .database()
    .ref();
var posts = document.getElementById("posts");
var currentUser = JSON.parse(localStorage.getItem('currentUser'));

database.child("posts").on("child_added", function (snapshot) {
        var obj = snapshot.val();
        obj.id = snapshot.key;
        render(obj);
    })
database
    .child("comments")
    .on("child_added", function (snapshot) {
        var obj = snapshot.val();
        renderComment(obj);
    })

function render(dua) {
    var mainDiv = document.createElement("DIV");
    mainDiv.setAttribute("id", dua.id);
    mainDiv.setAttribute("class", "card dua");
    mainDiv.style.marginBottom = "20px";
    mainDiv.style.boxShadow = "0px 0px 20px #ccc";
    mainDiv.style.maxWidth = "500px";

    var div = document.createElement("DIV");
    div.setAttribute("class", "card-body");

    var span = document.createElement("SPAN");

    var glyphUser = document.createElement("SPAN");
    glyphUser.setAttribute("class", "glyphicon glyphicon-user");

    var senderTag = document.createElement("H5");
   senderTag.appendChild(glyphUser);

    
    senderTag.setAttribute("class", "card-title");
    var sender = document.createTextNode(dua.sender);

    var hr = document.createElement("HR");

    senderTag.appendChild(sender);
    senderTag.appendChild(hr);

    var duaTag = document.createElement("H6");
    duaTag.setAttribute("class", "card-text");
    var duaText = document.createTextNode(dua.dua);
    duaTag.appendChild(duaText);

    span.appendChild(senderTag);
    span.appendChild(duaTag);
    div.appendChild(span);

    ////////////////// like Button
    var likeBtn = document.createElement("BUTTON");
    likeBtn.setAttribute("class", "btn btn-default");
    var likeBtnTxt = document.createTextNode("Like");

    likeBtn.onclick = function () {
        likePost(dua.id);

    };

    var likebadge = document.createElement("SPAN");
    likebadge.setAttribute("class", "badge badge-primary");
    likebadge.style.marginLeft = "5px";
    var spanText = document.createTextNode(" 1");

    likeBtn.appendChild(likeBtnTxt);
    likeBtn.appendChild(likebadge);
    likebadge.appendChild(spanText);
    div.appendChild(likeBtn);
    // end like button ///////////////////////////

    var commentBox = document.createElement("INPUT");
    commentBox.setAttribute("class", "form-control");
    commentBox.setAttribute("id", "comment" + dua.id);

    var btn = document.createElement("BUTTON");
    btn.setAttribute("class", "btn btn-primary");
    var btnText = document.createTextNode("Comment");
    btn.onclick = function () {
        submitComment(dua.id);
    }

    div.appendChild(commentBox);
    div.appendChild(btn);

    btn.appendChild(btnText);
    var commentsDiv = document.createElement("DIV");
    mainDiv.appendChild(commentsDiv);
    mainDiv.appendChild(div);
    posts.appendChild(mainDiv);

}
function submitComment(duaId) {
    var commentInput = document.getElementById("comment" + duaId);
    var commentObj = {
        sender: currentUser.name,
        comment: commentInput.value,
        duaId: duaId
    }
    database
        .child("comments")
        .push(commentObj);
    commentInput.value = '';
}
function renderComment(comment) {
    var duaDiv = document.getElementById(comment.duaId);
    var commentsDiv = duaDiv.lastElementChild;

    var card = document.createElement("DIV");
    card.setAttribute("class", "card");

    var cardBody = document.createElement("DIV");
    cardBody.setAttribute("class", "card-body");

    var senderTag = document.createElement("H5");
    senderTag.setAttribute("class", "card-title");
    var sender = document.createTextNode(comment.sender);
    senderTag.appendChild(sender);

    var commentTag = document.createElement("H6");
    commentTag.setAttribute("class", "card-text");
    var commentText = document.createTextNode(comment.comment);
    commentTag.appendChild(commentText);

    cardBody.appendChild(senderTag);
    cardBody.appendChild(commentTag);

    card.appendChild(cardBody);

    commentsDiv.appendChild(card);
}
///////////////////////////// likes code

function likePost(postID) {
    var userID;
    var username;
    var email;
    firebase
        .auth()
        .onAuthStateChanged(function (user) {
            if (user) {
                userID = user.uid;
                username = user.displayName;
                email = user.email;
            } else {
                console.log("Error");
            }
        });
    setTimeout(function () {
        likePost2(userID, postID, username, email);
    }, 0000)

}

function likePost2(userID, postID, username, email) {
    var likeFlag = false;
    database
        .child('likes/')
        .on("child_added", function (snapshot) {
            var demo = snapshot.val();
            demo.id = snapshot.key;

            if (demo.uid === userID && demo.pid === postID) {
                likeFlag = true;
            }

        });
    setTimeout(function () {
        likePost3(userID, postID, username, email, likeFlag);
    }, 0000)

}

function likePost3(userID, postID, username, email, likeFlag) {
    if (likeFlag === true) {
        delLike(postID, userID);
    } else {
        likeObj = {

            uid: userID,
            pid: postID,
            Email: email,
            User: username
        }

        database
            .child('likes')
            .push(likeObj);
        var a = document.getElementById(postID);
        var b = a.getElementsByTagName('button');
        var c = b[0].firstChild;
        var textnode = document.createTextNode("Unlike ");
        console.log(b[0].firstChild);
        b[0].replaceChild(textnode, c);

        var x = a.getElementsByClassName('card-body');
        var y = x[1];
        // y.childNodes[0].setAttribute('class', 'btn btn-primary');
        y.childNodes[0].onclick = function () {
            delLike(postID, userID);
        };

    }

}

// dislike

function delLike(postID, userID) {
    var arr1 = [];
    var arr2 = [];
    var id;

    database
        .child('likes/')
        .orderByChild('pid')
        .equalTo(postID)
        .on("value", function (snapshot) {
            console.log(snapshot.val());
            snapshot.forEach(function (data) {
                /*  console.log(data.key); */
                arr1.push(data.key);

            });
        });
    database
        .child('likes/')
        .orderByChild('uid')
        .equalTo(userID)
        .on("value", function (snapshot) {
            console.log(snapshot.val());
            snapshot.forEach(function (data) {
                /*  console.log(data.key); */
                arr2.push(data.key);

            });
        });

    var z = arr1.filter(function (val) {
        return arr2.indexOf(val) != -1;
    });

    database
        .child('likes/' + z[0])
        .remove();

    var a = document.getElementById(postID);
    var b = a.getElementsByTagName('button');
    var c = b[0].firstChild;
    var textnode = document.createTextNode("Like ");
    console.log(b[0].firstChild);
    b[0].replaceChild(textnode, c);

    // var x = a.getElementsByClassName('card-body'); var y = x[1];
    // y.childNodes[0].setAttribute('class', 'btn btn-outline-primary');
    // y.childNodes[0].onclick = function () { likePost(postID); }
}