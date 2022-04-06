
const getRegister = (req, res) => {
    try{
        res.render('register')
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }    
}

const getRegisterErr = (req, res) => {
    try{
        res.render('registererror')
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }
}

const getLogin = (req, res) => {
    try{
        res.render('login')
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }
}

const getLoginErr = (req, res) => {
    try{
         res.render('loginerror')
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }
}

const getLogout = (req, res) => {
    try{
        let name = req.session.passport.user.name
        req.logOut()
        req.session.destroy((err) =>{
            if(err){
                console.log(err)
            }
            res.clearCookie('connect.sid');
            res.render('logout', {name: name})
        })
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }
}

const getUserHome = (req, res) => {
    try{
        res.render('homeuser', {user: req.session.passport.user})
    }catch(error){
        const err = {
            name: error.name,
            message: error.message
        }
        res.send(err)
    }
}

export { getRegister, getRegisterErr, getLogin, getLoginErr, getLogout, getUserHome }