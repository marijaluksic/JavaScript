const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'ForumDB';

let main = async () => {


    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);

    let usersData = [
        {username:'mluksic', password:'$2a$10$pjljRGV76qjeh2ZaxgLlqOYPiCnatjU/g3jEq2/GuQ9O8gkXhpDAe', name: 'Marija', email:'mluksic@tvz.hr'},//123
        {username:'akonjetic', password:'$2a$10$mOjUii6eDw1cQosU4sksl.GGgw0uVS6XVwlTxMLcR.ol2OVSBl60W', name:'Ana', email:'akonjetic@tvz.hr'}//345
    ];

    let postsData = [
        {
            "userId": "63d2620af2f0f2526e8a1aa4",
            "timeStamp": "1/23/2023, 12:28:18 PM",
            "comment": "Zelena je najbolja boja."
        },
        {
            "userId": "63d2620af2f0f2526e8a1aa5",
            "timeStamp": "1/15/2023, 12:28:18 PM",
            "comment": "Žuta je najbolja boja"
        },
        {
            "userId": "63d2620af2f0f2526e8a1aa4",
            "timeStamp": "1/26/2023, 12:28:18 PM",
            "comment": "Ajde, ni plava nije tako loša..."
        },
    ];



    await //db.collection('users').deleteMany({});
    await //db.collection('users').insertMany(usersData);
    await db.collection('posts').deleteMany({});
    await db.collection('posts').insertMany(postsData);




}


main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
