import apiUrl from '/src/backend_url.js'


function handleUserProfile(username) {
    if (document.getElementById("profileModal" + String(username)) != null) {
      document.body.removeChild(document.getElementById("profileModal" + String(username)));
    }

    var loggedin = false;
    if (username == sessionStorage.getItem("username")) {
      loggedin = true;
    }

    var profileModal = document.createElement("div");
    profileModal.classList.add("modal-profile");
    profileModal.id = "profileModal" + String(username);
    var modalContent = document.createElement("div");
    modalContent.classList.add("modal-content-profile");
    var modalHeading = document.createElement("div");
    modalHeading.classList.add("modal-header-profile");
    var heading = document.createElement("h2");
    heading.innerText = "@" + username;
    modalHeading.appendChild(heading);
    modalContent.appendChild(modalHeading);
    var modalBody = document.createElement("div");
    modalBody.classList.add("post-container");


    // get user posts
    var feed_interface = document.createElement("div");
    feed_interface.id = "feedDivProfile";
    var feed_list = document.createElement("ul");
    feed_list.id = "feed-profile";
    feed_list.setAttribute("data-id-feed", "");
    var feed_head = document.createElement("div");
    feed_head.classList.add("feed-header");
    var heading = document.createElement("h3");
    heading.classList.add("feed-title");
    heading.classList.add("alt-text");
    var desc = document.createTextNode("User Posts");
    heading.appendChild(desc);
    var follow_button = document.createElement("button");
    follow_button.classList.add("button_type_2");
    desc = document.createTextNode("FOLLOW");
    follow_button.appendChild(desc);
    follow_button.id = "followBtn";
    follow_button.style.cssFloat = "right";
    var unfollow_button = document.createElement("button");
    unfollow_button.classList.add("button_type_2");
    desc = document.createTextNode("UNFOLLOW");
    unfollow_button.appendChild(desc);
    unfollow_button.id = "unfollowBtn";
    feed_head.appendChild(heading);
    if (!loggedin) {
      feed_head.appendChild(follow_button);
      feed_head.appendChild(unfollow_button);
    }
    feed_list.appendChild(feed_head);
    var fetchData, fetchURL;
    fetchData = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': "Token   " + localStorage.getItem("authToken")
      }
    }
    fetchURL = apiUrl + "/user/?username=" + username;

    fetch(fetchURL, fetchData)
    .then(response => response.json())
    .then(data => {
      if (data.posts.length == 0) {
      var noPosts = document.createElement("p");
      noPosts.innerText = "No Posts Yet";
      var post_item = document.createElement("li");
      post_item.appendChild(noPosts);
      feed_list.appendChild(post_item);

      feed_interface.appendChild(feed_list);

      modalBody.appendChild(feed_interface);
      modalContent.appendChild(modalBody);
      profileModal.appendChild(modalContent);
      document.body.appendChild(profileModal);
      profileModal.style.display = "block";

      if (!loggedin) {
        follow_button.addEventListener("click", function() {
          var fetchData = {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': "Token   " + localStorage.getItem("authToken")
            }
          }
          fetch(apiUrl  + "/user/follow/?username=" + username, fetchData)
          .then(function(response) {
            // getPosts();
          })
        });

        unfollow_button.addEventListener("click", function() {
          var fetchData = {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': "Token   " + localStorage.getItem("authToken")
            }
          }
          fetch(apiUrl  + "/user/unfollow/?username=" + username, fetchData)
        });
       }
     }
      else {
        for (const post of data.posts) {
          fetchData = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
                'Authorization': "Token   " + localStorage.getItem("authToken")
            }
          }
          fetchURL = apiUrl + "/post/?id=" + post;
          fetch(fetchURL, fetchData)
          .then(response => response.json())
          .then(data => {
            var post_item = document.createElement("li");
            post_item.classList.add("post");
            var div_upvotes = document.createElement("div");
            div_upvotes.id = "upVotesDiv" + String(data.id);
            div_upvotes.classList.add("vote");
            var upvoteButton = document.createElement("i");
            upvoteButton.classList.add("material-icons");
            upvoteButton.classList.add("item-1");
            upvoteButton.id = "upvotes_btn" + String(data.id);
            upvoteButton.innerText = "arrow_upward";
            div_upvotes.appendChild(upvoteButton);


            var gap = document.createElement("p");
            gap.classList.add("upvotes-size-maintain");
            var upVotes = document.createElement("p");
            upVotes.classList.add("upvote");
            var btId = "upvotes" + String(data.id);
            upVotes.id = btId;
            // get number of upvotes
            var totalUpVotes = data.meta.upvotes.length;

            desc = document.createTextNode(totalUpVotes);
            upVotes.appendChild(desc);
            div_upvotes.appendChild(upVotes);
            var downVoteButton = document.createElement("i");
            downVoteButton.classList.add("material-icons");
            downVoteButton.classList.add("item-2");
            downVoteButton.innerText = "arrow_downward";
            downVoteButton.id = "downvote_btn" + String(data.id);
            div_upvotes.appendChild(downVoteButton);
            post_item.appendChild(div_upvotes);
            var div_content = document.createElement("div");
            div_content.classList.add("content");
            var post_title = document.createElement("h4");
            post_title.classList.add("post-title");
            post_title.classList.add("alt-text");
            desc = document.createTextNode(data.title);
            post_title.appendChild(desc);
            var post_content = document.createElement("p");
            desc = document.createTextNode(data.text);
            post_content.appendChild(desc);
            var noComments = document.createElement("p");
            noComments.classList.add("comments");
            desc = document.createTextNode(data.comments.length  +" Comments");
            noComments.appendChild(desc);
            var post_date = new Date(parseInt(data.meta.published, 10));
            var post_author = document.createElement("p");
            post_author.classList.add("post-author");
            desc = document.createTextNode(".      Posted by @" + data.meta.author + " on " + post_date.toUTCString());
            post_author.appendChild(desc);
            var subsedit = document.createElement("p");
            subsedit.classList.add("post-subsedit");
            desc = document.createTextNode(".      " + data.meta.subseddit);
            subsedit.appendChild(desc);
            var image = document.createElement("img");
            image.classList.add("img");
            image.src = "data:image/png;base64," + data.image;
            var commentDiv = document.createElement("div");
            commentDiv.classList.add("comment-div");
            commentDiv.id = "comment" + String(data.id);
            var commentButton = document.createElement("i");
            commentButton.classList.add("material-icons");
            commentButton.classList.add("comment_btn");
            commentButton.id = "cmt_btn";
            commentButton.innerText = "comment";
            commentDiv.appendChild(commentButton);
            commentDiv.appendChild(noComments);
            div_content.appendChild(post_title);
            div_content.appendChild(post_author);
            div_content.appendChild(subsedit);
            div_content.appendChild(post_content);

            if (data.image != null && data.image != "") {
              div_content.appendChild(image);
            }
            div_content.appendChild(commentDiv);

            div_upvotes.appendChild(gap);
            post_item.appendChild(div_content);
            feed_list.appendChild(post_item);

            feed_interface.appendChild(feed_list);

            modalBody.appendChild(feed_interface);
            modalContent.appendChild(modalBody);
            profileModal.appendChild(modalContent);
            document.body.appendChild(profileModal);
            profileModal.style.display = "block";

            if (!loggedin) {
              follow_button.addEventListener("click", function() {
                var fetchData = {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': "Token   " + localStorage.getItem("authToken")
                  }
                }
                fetch(apiUrl  + "/user/follow/?username=" + username, fetchData)
                .then(function(response) {
                })
              });

              unfollow_button.addEventListener("click", function() {
                var fetchData = {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': "Token   " + localStorage.getItem("authToken")
                  }
                }
                fetch(apiUrl  + "/user/unfollow/?username=" + username, fetchData)
              });

            }
          });
        }
      }
    });
    window.addEventListener("click", function(event) {
      if (event.target == profileModal) {
        getPosts();
        profileModal.style.display = "none";
      }
    });
}


function handledownVoteButton(postID) {
    var fetchData = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': "Token   " + localStorage.getItem("authToken")
      }
    }
    fetch(apiUrl  + "/post/vote/?id=" + postID, fetchData)
    .then(function() {
        getPosts();
    });
  }


function handleUpvotesModal (post_upvotes, postID) {

    if (document.getElementById("upvotes_model" + String(postID)) != null) {
      document.body.removeChild(document.getElementById("upvotes_model" + String(postID)));
    }
    // Upvotes Modal handled here
    var upVotesModal = document.createElement("div");
    upVotesModal.classList.add("modal");
    var upVotesContent = document.createElement("div");
    var upVotesContent1 = document.createElement("div");
    upVotesContent1.classList.add("modal-content1");
    upVotesContent.classList.add("modal-content");
    upVotesModal.id = "upvotes_model" + String(postID);
    var upVotesHeader = document.createElement("div");
    upVotesHeader.classList.add("modal-header");
    var close_modal = document.createElement("span");
    close_modal.classList.add("close-button");
    close_modal.classList.add("material-icons");
    var desc = document.createTextNode("clear");
    close_modal.appendChild(desc);
    var modalHeading = document.createElement("h2");
    desc = document.createTextNode("UPVOTES");
    modalHeading.appendChild(desc);
    upVotesHeader.appendChild(close_modal);
    upVotesHeader.appendChild(modalHeading);

    var upVotesUl = document.createElement("ul");
    upVotesUl.id = "upVotesModalID";
    // get the name of users who upvoted and put it as a li
    for (var user of post_upvotes) {
        // get another fetch from the api
        var fetchData = {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token   " + localStorage.getItem("authToken")
            }
        }
        fetch(apiUrl  + "/user/?id=" + user, fetchData)
        .then(response => response.json())
        .then(data1 => {
            var voterli = document.createElement("li");
            voterli.classList.add("modal_list");
            var voterName = document.createElement("p");
            voterName.classList.add("upVotes-voter");
            voterName.innerText = data1.username;
            voterName.addEventListener("click", function() {
                handleUserProfile(data1.username);
            });
            voterli.appendChild(voterName);
            upVotesUl.appendChild(voterli);
        })
    }
    upVotesContent1.appendChild(upVotesHeader);
    upVotesContent.appendChild(upVotesUl);
    upVotesModal.appendChild(upVotesContent1);
    upVotesModal.appendChild(upVotesContent);

    document.body.appendChild(upVotesModal);

    close_modal.addEventListener("click", function() {
        upVotesModal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target == upVotesModal) {
            upVotesModal.style.display = "none";
        }
    });

}


function handlePostButton() {
    var postModal = document.createElement("div");
    postModal.classList.add("modal");
    postModal.id = "postModal";
    var postContent = document.createElement("div");
    postContent.classList.add("modal-content-post");
    var postBody = document.createElement("div");
    postBody.classList.add("post-container");
    var postHeader = document.createElement("div");
    postHeader.classList.add("modal-header-post");
    var close_modal = document.createElement("span");
    close_modal.classList.add("close-button");
    close_modal.classList.add("material-icons");
    var desc = document.createTextNode("clear");
    close_modal.appendChild(desc);
    var modalHeading = document.createElement("h2");
    desc = document.createTextNode("Add a post");
    modalHeading.appendChild(desc);
    postHeader.appendChild(close_modal);
    postHeader.appendChild(modalHeading);

    // body
    var title = document.createElement("input");
    title.placeholder = "Add title here";
    title.id = "postTitle";
    title.classList.add("post-field");
    var labelTitle = document.createElement("p");
    labelTitle.classList.add("label");
    var desc = document.createTextNode("Title *");
    labelTitle.appendChild(desc);
    var text = document.createElement("textarea");
    text.style.minHeight = "200px";
    text.placeholder = "Write a post";
    text.classList.add("post-field");
    var labelText = document.createElement("p");
    labelText.classList.add("label");
    var desc = document.createTextNode("Text *");
    labelText.appendChild(desc);
    var subsedit = document.createElement("input");
    subsedit.classList.add("post-field");
    subsedit.placeholder = "Subsedit category";
    var labelSubsedit = document.createElement("p");
    labelSubsedit.classList.add("label");
    var desc = document.createTextNode("Subseddit *");
    labelSubsedit.appendChild(desc);
    var image= document.createElement("input");
    image.placeholder = "Browse";
    image.type = "file";
    image.accept = "image/png";

    image.classList.add("post-field");
    var img = document.createElement("img");
    img.id = "img";
    document.body.appendChild(img);
    localStorage.setItem("imgBase64", "");

    //convert image to base64
    function readFile() {
      var base64;
      if (this.files && this.files[0]) {

        var FR= new FileReader();

        FR.addEventListener("load", function(e) {
          document.getElementById("img").src = e.target.result;
          base64 = e.target.result.replace(/^data:image\/png;base64,/, "");
          localStorage.setItem("imgBase64", base64);
        });

        FR.readAsDataURL( this.files[0] );
      }

    }

    image.addEventListener("change", readFile);
    var labelImage = document.createElement("p");
    labelImage.classList.add("label");
    var desc = document.createTextNode("Image (.png only)");
    labelImage.appendChild(desc);
    var postBtn = document.createElement("button");
    postBtn.classList.add("button_type_2");
    desc = document.createTextNode("Post");
    postBtn.appendChild(desc);
    var empty_text = document.createElement("p");
    empty_text.style.color = "red";

    //handle post Button
    postBtn.addEventListener("click", function() {

      if (title.value == "" || text.value == "" || subsedit.value == "") {
        empty_text.innerText = "* Marked Fields cannot be empty";
      }
      else {
        var data = {
          "title" : title.value,
          "text" : text.value,
          "subseddit" : subsedit.value,
          "image" : localStorage.getItem("imgBase64")
        }

        var fetchData = {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token   " + localStorage.getItem("authToken")
          }
        }
        fetch(apiUrl + "/post", fetchData)
        .then(function(response) {
          if (response.status == 200) {
            postModal.style.display = "none";
            getPosts();
          }
        });
      }
    });

    postContent.appendChild(postHeader);
    postBody.appendChild(labelTitle);
    postBody.appendChild(title);
    postBody.appendChild(labelText);
    postBody.appendChild(text);
    postBody.appendChild(labelSubsedit);
    postBody.appendChild(subsedit);
    postBody.appendChild(labelImage);
    postBody.appendChild(image);
    postBody.appendChild(postBtn);
    postBody.appendChild(empty_text);
    postContent.appendChild(postBody);
    postModal.appendChild(postContent);
    document.body.appendChild(postModal);

    close_modal.addEventListener("click", function() {
      postModal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
      if (event.target == postModal) {
        postModal.style.display = "none";
      }
    });
}

function handleupVotesButton(postID) {
    var fetchData = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': "Token   " + localStorage.getItem("authToken")
      }
    }
    fetch(apiUrl  + "/post/vote/?id=" + postID, fetchData)
    .then(function() {
        getPosts();
    });
}


function handleCommentsModal(postID) {
    if (document.getElementById("commentsModal" + String(postID)) != null) {
      document.body.removeChild(document.getElementById("commentsModal" + String(postID)));
    }

    var commentsModal = document.createElement("div");
    commentsModal.classList.add("modal");
    commentsModal.id = "commentsModal" + String(postID);
    var commentsContent = document.createElement("div");
    var commentsContent1 = document.createElement("div");
    commentsContent1.classList.add("modal-content1");
    commentsContent.classList.add("modal-content");
    var commentsHeader = document.createElement("div");
    commentsHeader.classList.add("modal-header");
    var close_modal = document.createElement("span");
    close_modal.classList.add("close-button");
    close_modal.classList.add("material-icons");
    var desc = document.createTextNode("clear");
    close_modal.appendChild(desc);
    var modalHeading = document.createElement("h2");
    desc = document.createTextNode("COMMENTS");
    modalHeading.appendChild(desc);
    commentsHeader.appendChild(close_modal);
    commentsHeader.appendChild(modalHeading);
    commentsContent1.appendChild(commentsHeader);
    var commentsUl = document.createElement("ul");
    var commentli = document.createElement("li");
    var commentDiv = document.createElement("div");
    commentDiv.classList.add("cmt_div");
    var comment = document.createElement("input");
    comment.placeholder = "Add a comment..."
    comment.classList.add("post-field");
    var cmtBtn = document.createElement("button");
    cmtBtn.disabled = true;
    cmtBtn.innerText = "COMMENT";
    cmtBtn.classList.add("button_type_2");
    comment.onkeyup = function() {
        if (comment.value != "") {
            cmtBtn.disabled = false;
        }
        else {
            cmtBtn.disabled = true;
        }
    }
    cmtBtn.addEventListener("click", function() {
        var data = {
            "comment" : String(comment.value)
        }

        var fetchData = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Token   " + localStorage.getItem("authToken")
            }
        }

        fetch(apiUrl  + "/post/comment/?id=" + String(postID), fetchData)
        .then(function () {
            getPosts();
            handleCommentsModal(postID);
            document.getElementById("commentsModal" + String(postID)).style.display = "block";
        });
    });
    commentDiv.appendChild(comment);
    commentDiv.appendChild(cmtBtn);
    commentli.appendChild(commentDiv);
    commentsUl.appendChild(commentli);
    var fetchData = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': "Token   " + localStorage.getItem("authToken")
        }
    }
    fetch(apiUrl  + "/post/?id=" + postID, fetchData)
    .then(response => response.json())
    .then(data => {
        // get each individual comment as a div and add it to the ul
        for (var cmt of data.comments) {
            commentli = document.createElement("li");
            commentDiv = document.createElement("div");
            commentDiv.classList.add("cmt_div");
            var comment = document.createElement("p");
            var desc = document.createTextNode(cmt.comment);
            comment.appendChild(desc);
            var cmt_author = document.createElement("p");
            cmt_author.classList.add("post-subsedit");
            var post_date = new Date(parseInt(cmt.published, 10));
            desc = document.createTextNode("Posted by @" + cmt.author + " on " +  post_date.toUTCString());
            cmt_author.appendChild(desc);
            commentDiv.appendChild(comment);
            commentDiv.appendChild(cmt_author);
            commentli.appendChild(commentDiv);
            commentsUl.appendChild(commentli);
        }
    });
    commentsContent.appendChild(commentsUl);
    commentsModal.appendChild(commentsContent1);
    commentsModal.appendChild(commentsContent);
    document.body.appendChild(commentsModal);
    close_modal.addEventListener("click", function() {
        commentsModal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target == commentsModal) {
            commentsModal.style.display = "none";
        }
    });
}



function getFeed() {
    var index = 0;
    if (localStorage.getItem("postIndex") != null) {
      var index = parseInt(localStorage.getItem("postIndex"));
    }
    localStorage.setItem("postIndex", String(index+5));
    var logged_in = false;
    if (sessionStorage.getItem("username") != null) {
      logged_in = true;
    }
    var fetchData, fetchURL;

    if (logged_in) {
      fetchData = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
           'Authorization': "Token   " + localStorage.getItem("authToken")
        }
      }
      fetchURL = apiUrl  + "/user/feed/?p=" + index;
    }
    else {
      fetchData = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
      fetchURL = apiUrl  + "/post/public";
    }
    fetch(fetchURL, fetchData)
    .then(response => response.json())
    .then(data => {
      for (const post of data.posts) {
        var post_item = document.createElement("li");
        post_item.classList.add("post");
        post_item.setAttribute("data-id-post", "");
        post_item.id = "postLI";
        var div_upvotes = document.createElement("div");
        div_upvotes.id = "upVotesDiv" + String(post.id);
        div_upvotes.classList.add("vote");
        var upvoteButton = document.createElement("i");
        upvoteButton.classList.add("material-icons");
        upvoteButton.classList.add("item-1");
        upvoteButton.id = "upvotes_btn" + String(post.id);
        upvoteButton.innerText = "arrow_upward";
        div_upvotes.appendChild(upvoteButton);


        var gap = document.createElement("p");
        gap.classList.add("upvotes-size-maintain");
        var upVotes = document.createElement("p");
        upVotes.classList.add("upvote");
        var btId = "upvotes" + String(post.id);
        upVotes.id = btId;
        upVotes.setAttribute("data-id-upvotes", "");
        // get number of upvotes
        var totalUpVotes = post.meta.upvotes.length;

        var desc = document.createTextNode(totalUpVotes);
        upVotes.appendChild(desc);
        div_upvotes.appendChild(upVotes);
        var downVoteButton = document.createElement("i");
        downVoteButton.classList.add("material-icons");
        downVoteButton.classList.add("item-2");
        downVoteButton.innerText = "arrow_downward";
        downVoteButton.id = "downvote_btn" + String(post.id);
        div_upvotes.appendChild(downVoteButton);
        post_item.appendChild(div_upvotes);
        var div_content = document.createElement("div");
        div_content.classList.add("content");
        var post_title = document.createElement("h4");
        post_title.classList.add("post-title");
        post_title.classList.add("alt-text");
        post_title.setAttribute("data-id-title", "");
        desc = document.createTextNode(post.title);
        post_title.appendChild(desc);
        var post_content = document.createElement("p");
        post_content.setAttribute("data-id-post", "");
        desc = document.createTextNode(post.text);
        post_content.appendChild(desc);
        var noComments = document.createElement("p");
        noComments.classList.add("comments");
        desc = document.createTextNode(post.comments.length  +" Comments");
        noComments.appendChild(desc);
        var post_date = new Date(parseInt(post.meta.published, 10));
        var post_author = document.createElement("p");
        post_author.classList.add("post-author");
        post_author.setAttribute("data-id-author", "");
        desc = document.createTextNode(".      Posted by @" + post.meta.author + " on " + post_date.toUTCString());
        post_author.appendChild(desc);
        var subsedit = document.createElement("p");
        subsedit.classList.add("post-subsedit");
        desc = document.createTextNode(".      " + post.meta.subseddit);
        subsedit.appendChild(desc);
        var image = document.createElement("img");
        image.classList.add("img");
        image.src = "data:image/png;base64," + post.image;
        var commentDiv = document.createElement("div");
        commentDiv.classList.add("comment-div");
        commentDiv.id = "comment" + String(post.id);
        var commentButton = document.createElement("i");
        commentButton.classList.add("material-icons");
        commentButton.classList.add("comment_btn");
        commentButton.id = "cmt_btn";
        commentButton.innerText = "comment";
        commentDiv.appendChild(commentButton);
        commentDiv.appendChild(noComments);
        div_content.appendChild(post_title);
        div_content.appendChild(post_author);
        div_content.appendChild(subsedit);
        div_content.appendChild(post_content);

        if (post.image != null && post.image != "") {
          div_content.appendChild(image);
        }
        div_content.appendChild(commentDiv);

        div_upvotes.appendChild(gap);
        post_item.appendChild(div_content);
        document.getElementById("feed").appendChild(post_item);

        if (logged_in) {
          upVotes.addEventListener("click", function() {
            handleUpvotesModal(post.meta.upvotes, post.id);
            document.getElementById("upvotes_model" + String(post.id)).style.display = "block";
          });

          commentDiv.addEventListener("click", function() {
            handleCommentsModal(post.id);
            document.getElementById("commentsModal" + String(post.id)).style.display = "block";
          });

          upvoteButton.addEventListener("click", function() {
            handleupVotesButton(post.id);
          });

          downVoteButton.addEventListener("click", function() {
            handledownVoteButton(post.id);
          });

          post_author.addEventListener("click", function() {
            handleUserProfile(post.meta.author);
          });

        }

      }
    });
}

function getPosts() {
    localStorage.removeItem("postIndex");

    if (document.getElementById("feedDiv") != null) {
        document.body.removeChild(document.getElementById("feedDiv"));
    }

    var logged_in = false;
    if (sessionStorage.getItem("username") != null) {
        logged_in = true;
    }

    // Feed Interface handled here
    var feed_interface = document.createElement("main");
    feed_interface.setAttribute("role", "main");
    feed_interface.id = "feedDiv";
    var feed_list = document.createElement("ul");
    feed_list.id = "feed";
    feed_list.setAttribute("data-id-feed", "");
    var feed_head = document.createElement("div");
    feed_head.classList.add("feed-header");
    var heading = document.createElement("h3");
    heading.classList.add("feed-title");
    heading.classList.add("alt-text");
    var desc = document.createTextNode("Popular Posts");
    heading.appendChild(desc);
    var post_button = document.createElement("button");
    post_button.classList.add("button_type_2");
    desc = document.createTextNode("Post");
    post_button.appendChild(desc);
    post_button.id = "postBtn";
    feed_head.appendChild(heading);
    feed_head.appendChild(post_button);
    feed_list.appendChild(feed_head);

    getFeed();

    feed_interface.appendChild(feed_list);
    document.body.appendChild(feed_interface);

    if (logged_in) {
        //wait for 2 secs
        stateChange();

        function stateChange(newState) {
            setTimeout('', 2000);
            if(newState == -1) {
                alert('VIDEO HAS STOPPED');
            }
        }

        window.addEventListener("scroll", function scrolled()
        {

            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight)
            {
                getFeed();
            }
        });


        post_button.addEventListener("click", function() {

        handlePostButton();
        document.getElementById("postModal").style.display = "block";
        });
    }

}

export {getPosts, handleUserProfile};




