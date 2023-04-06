

module.exports=function(app, express, db, jwt, secret, bcrypt){



    let authRouter = express.Router();


    authRouter.post('/', async function(req,res){


            console.log(req.body.credentials);

            try{

                let rows = await db.collection('users').find({
                    username:req.body.username
                }).toArray();

                console.log(rows);


                if (rows.length==0)
                {
                  res.status(500).send({ message: err });
                  return;
                }
                else {

                  /* let  validPass = false;
                 bcrypt.genSalt().then(salt => {
                   bcrypt.hash(rows[0].password, salt).then(hash => {
                     bcrypt.compare(req.body.password, hash).then(result => {
                       validPass=result;
                       console.log(result);
                     })
                   });
                 })*/
                   let validPass = bcrypt.compareSync(req.body.password, rows[0].password);

                   // validPass=true;

                    if (rows.length > 0 && validPass) {

                        let token = jwt.sign({
                            _id : rows[0]._id,
                            username: rows[0].username,
                            password: rows[0].password,
                            name: rows[0].name,
                            email: rows[0].email
                        }, secret, {
                            expiresIn: 1440
                        });
                      let options = {
                        path:"/",
                        sameSite:true,
                        maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                        httpOnly: true, // The cookie only accessible by the web server
                      }

                      res.cookie('x-access-token',token, options);

                      res.status(200).send({
                        _id: rows[0]._id,
                        username: rows[0].username,
                        password: rows[0].password,
                        name: rows[0].name,
                        email: rows[0].email,
                        accessToken: token
                      });

                    } else {
                      res.status(500).send({ message: 'Wrong password' });
                    }




            }


            }

            catch (e) {
                console.log(e);
              res.status(500);
            }







    });


    return authRouter;

}
