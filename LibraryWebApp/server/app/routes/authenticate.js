module.exports=function(app, express, db, jwt, secret, bcrypt){

    let authRouter = express.Router();

    authRouter.post('/login', async function(req,res){

            try{

                let rows = await db.collection('users').find({
                    email:req.body.email
                }).toArray();

                if (rows.length==0)
                {
                  res.json({ status: 500, message: "Username doesn\'t exist!" });
                  return;
                }
                else {

                   let validPass = bcrypt.compareSync(req.body.password, rows[0].password);

                    if (rows.length > 0 && validPass) {

                        let token = jwt.sign({
                            _id : rows[0]._id,
                            name: rows[0].name,
                            password: rows[0].password,
                            email: rows[0].email,
                          address: rows[0].address,
                          level: rows[0].level
                        }, secret/*, {
                            expiresIn: 1440
                        }*/);
                      let options = {
                        path:"/",
                        sameSite:true,
                        maxAge: 1000 * 60 * 30,
                        httpOnly: true, // The cookie only accessible by the web server
                      }

                      res.cookie('x-access-token',token, options);
                      res.status(200)

                      //res.json({accessToken:token});
                      res.send({
                        user:{
                          _id: rows[0]._id,
                          name: rows[0].name,
                          password: rows[0].password,
                          email: rows[0].email,
                          address: rows[0].address,
                          level: rows[0].level},
                        accessToken: token
                      });

                    } else {
                      res.json({ status: 500, message: "Wrong password!" });
                    }
                }
            } catch (e) {
              console.log(e);
              res.status(500);
            }
    });

  authRouter.post('/register', async function(req,res){

    require('bcryptjs').genSalt().then(salt => {
      require('bcryptjs').hash(req.body.password, salt).then(hash => {
        let user = {
          name : req.body.name,
          password : hash,
          email : req.body.email,
          address : req.body.address,
          level: req.body.level
        };

        db.collection('users').insertOne(user, function(err, data){
          //console.log(data);

          if (!err){
            res.json({status: 200, message: "Registration successful!", insertedId: user._id});
          }

          else
            res.json({status: 500, message: "Registration unsuccessful!"});

        });
      });
    })
  });
    return authRouter;
}
