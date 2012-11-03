var signinLink = document.getElementById('signin');
if (signinLink) {
    signinLink.onclick = function(e) { e.preventDefault(); navigator.id.request(); };
};
 
var signoutLink = document.getElementById('signout');
if (signoutLink) {
    signoutLink.onclick = function(e) { e.preventDefault(); navigator.id.logout(); };
};

var accountMenu = document.getElementById('accountMenu');
var accountMenuGravatar = document.getElementById('accountMenuGravatar');
var accountMenuEmail = document.getElementById('accountMenuEmail');

function setUser(user) {
    if (user) {
        $(signinLink).addClass('hidden');
        $(accountMenu).removeClass('hidden');
        $(accountMenuGravatar).attr('src', '//www.gravatar.com/avatar/'+user.gravatarHash+'?s=16&d=mm');
        $(accountMenuEmail).text(user.email);
    } else {
        $(signinLink).removeClass('hidden');
        $(accountMenu).addClass('hidden');
    }
    
}

$.ajax({
    type:'GET', 
    url:'/auth/whoami',
    success:function(res, status, xhr) {
        var currentUser = null;
        if (xhr.status == 204) {
            currentUser = null;
        } else {
            currentUser = res;
        }
        console.log(currentUser);
        setUser(currentUser);
        establishWatch(currentUser);
    },
    error:function(xhr, status, err) {
        console.log('Error determining self: ', status, err);
    }
});

function establishWatch(currentUser) {
    navigator.id.watch({
        loggedInUser: currentUser,
        onlogin: function(assertion) {
            // A user has logged in! Here you need to:
            // 1. Send the assertion to your backend for verification and to create a session.
            // 2. Update your UI.
            $.ajax({ /* <-- This example uses jQuery, but you can use whatever you'd like */
                type: 'POST',
                url: '/auth/login', // This is a URL on your website.
                data: {assertion: assertion},
                success: function(res, status, xhr) { 
                    setUser(res);
                },
                error: function(xhr, status, err) { 
                    alert("login failure" + res); 
                    setUser(null);
                    navigator.id.logout();
                }
            });
        },
        onlogout: function() {
            // A user has logged out! Here you need to:
            // Tear down the user's session by redirecting the user or making a call to your backend.
            // Also, make sure loggedInUser will get set to null on the next page load.
            // (That's a literal JavaScript null. Not false, 0, or undefined. null.)
            $.ajax({
                type: 'POST',
                url: '/auth/logout', // This is a URL on your website.
                success: function(res, status, xhr) { 
                    setUser(null);
                    window.location = '/';
                },
                error: function(xhr, status, err) { 
                    alert("logout failure" + res); 
                    setUser(null);
                    navigator.id.logout();
                }
            });
        }
    });    
}
