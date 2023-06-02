



exports.otpsend = async (res,response) => {

try{
     const user = await user.create({
        username: response.body.username
     })
     const username =db.query("SELECT * FROM users WHERE username=?",

     [userEmail],(err,result)=>{
        if(err) console.log(err)
        else if(result.length!==0) return res.status(401).send('user already exist')
    })

}catch(err){



    

}


}