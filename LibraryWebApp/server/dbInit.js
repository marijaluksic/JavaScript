const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'LibraryDB';

let main = async () => {


    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);

    let usersData = [
        {
          _id: '63e194628ffa458848bf2eda',
          name:'Marija Lukšić',
          password:'$2a$10$pjljRGV76qjeh2ZaxgLlqOYPiCnatjU/g3jEq2/GuQ9O8gkXhpDAe', //123
          email:'mluksic@tvz.hr',
          address: 'Trg bana Josipa Jelačića 1',
          level: 1
        },
        {
          _id: '63e194628ffa458848bf2edb',
          name:'Ana Konjetić',
          password:'$2a$10$mOjUii6eDw1cQosU4sksl.GGgw0uVS6XVwlTxMLcR.ol2OVSBl60W', //345
          email:'akonjetic@tvz.hr',
          address: 'Trg Marka Marulića 1',
          level: 1
        },
      {
        _id: '63e1b08452c9ee1e1aaf77fa',
        name:'Ana Bunjevac',
        password:'$2a$10$mOjUii6eDw1cQosU4sksl.GGgw0uVS6XVwlTxMLcR.ol2OVSBl60W', //345
        email:'abunjevac@tvz.hr',
        address: 'Trg kralja Petra Krešimira 1',
        level: 2
      }
    ];

  let publishersData = [
    {
      _id: '63e194628ffa458848bf2edc',
      name: 'Harper & Row'
    },
    {
      _id: '63e194628ffa458848bf2edd',
      name: 'Mladinska knjiga'
    },
    {
      _id: '63e194628ffa458848bf2ede',
      name: 'Carlsen'
    },
    {
      _id: '63e194628ffa458848bf2edf',
      name: 'Gallimard'
    },
  ];
  let genresData = [
    {
      _id: '63e194628ffa458848bf2ee0',
      name: 'Romance Novel'
    },
    {
      _id: '63e194628ffa458848bf2ee1',
      name: 'Philosophical fiction'
    },
    {
      _id: '63e194628ffa458848bf2ee2',
      name: 'Biography'
    },
    {
      _id: '63e194628ffa458848bf2ee3',
      name: 'Picaresque novel'
    },
    {
      _id: '63e194628ffa458848bf2ee4',
      name: 'Essay'
    },
  ];

  let booksData = [
    {
      _id: '63e194628ffa458848bf2ee5',
      title: 'The Unbearable Lightness of Being',
      authorId: 'Milan Kundera',
      edition: 1,
      publisherId: '63e194628ffa458848bf2edc',
      genreId: '63e194628ffa458848bf2ee1',
    },
    {
      _id: '63e194628ffa458848bf2ee6',
      title: 'Plesala je jedno ljeto',
      authorId: 'Per Olof Ekström',
      edition: 3,
      publisherId: '63e194628ffa458848bf2edd',
      genreId: '63e194628ffa458848bf2ee0',
    },
    {
      _id: '63e194628ffa458848bf2ee7',
      title: 'Wir Kinder vom Bahnhof Zoo',
      authorId: 'Christiane F.',
      edition: 19,
      publisherId: '63e194628ffa458848bf2ede',
      genreId: '63e194628ffa458848bf2ee2',
    },
    {
      _id: '63e194628ffa458848bf2ee8',
      title: 'The Adventures of Huckleberry Finn',
      authorId: 'Mark Twain',
      edition: 12,
      publisherId: '63e194628ffa458848bf2edc',
      genreId: '63e194628ffa458848bf2ee3',
    },
    {
      _id: '63e194628ffa458848bf2ee9',
      title: 'L\' Art Du Roman',
      authorId: 'Milan Kundera',
      edition: 1,
      publisherId: '63e194628ffa458848bf2edf',
      genreId: '63e194628ffa458848bf2ee4',
    },
    {
      _id: '63e194628ffa458848bf2eea',
      title: 'The Stranger',
      authorId: 'Albert Camus',
      edition: 1,
      publisherId: '63e194628ffa458848bf2edf',
      genreId: '63e194628ffa458848bf2ee1',
    },
  ];
  let borrowedData = [
    {
      _id : '63e194628ffa458848bf2eeb',
      userId : '63e194628ffa458848bf2eda',
      bookId : '63e194628ffa458848bf2ee5',
      timeStamp : '1/15/2023, 12:28:18 PM',
      returnDate : '2/15/2023, 12:28:18 PM'
    },
    {
      _id : '63e194628ffa458848bf2eec',
      userId : '63e194628ffa458848bf2eda',
      bookId : '63e194628ffa458848bf2ee8',
      timeStamp : '1/25/2023, 12:28:18 PM',
      returnDate : '2/25/2023, 12:28:18 PM'
    },
    {
      _id : '63e194628ffa458848bf2eed',
      userId : '63e194628ffa458848bf2edb',
      bookId : '63e194628ffa458848bf2ee9',
      timeStamp : '1/10/2023, 12:28:18 PM',
      returnDate : '2/10/2023, 12:28:18 PM'
    },
    {
      _id : '63e194628ffa458848bf2eee',
      userId : '63e194628ffa458848bf2edb',
      bookId : '63e194628ffa458848bf2ee8',
      timeStamp : '12/29/2022, 12:28:18 PM',
      returnDate : '1/29/2023, 12:28:18 PM'
    },
    {
      _id : '63e194628ffa458848bf2eef',
      userId : '63e194628ffa458848bf2eda',
      bookId : '63e194628ffa458848bf2ee6',
      timeStamp : '1/5/2023, 12:28:18 PM',
      returnDate : '2/5/2023, 12:28:18 PM'
    }
  ];



    await db.collection('users').deleteMany({});
    await db.collection('users').insertMany(usersData);
  await db.collection('publishers').deleteMany({});
  await db.collection('publishers').insertMany(publishersData);
  await db.collection('genres').deleteMany({});
  await db.collection('genres').insertMany(genresData);
  await db.collection('books').deleteMany({});
  await db.collection('books').insertMany(booksData);
  await db.collection('borrowed').deleteMany({});
  await db.collection('borrowed').insertMany(borrowedData);




}


main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
