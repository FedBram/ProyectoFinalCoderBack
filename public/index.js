//------- LOGOUT REDIRECT ---------//
if(location.pathname == '/logout'){
    setTimeout(() => {
        window.location = '/'
    }, 3000)
}

//---- REGISTER ERROR REDIRECT ------//
if(location.pathname == '/registererror'){
    setTimeout(() => {
        window.location = '/login'
    }, 3000)
}