const collectionsController = require('../controllers/collections.controller');

let qTest = [];
let qShort = [];
let qLong = [];

generateExam();

function generateExam() {

  // Mock data
  const collections = [
    '5b3259f84bd13d19bc69c2ae',
    '5b321bc4ba7376a704362f58',
    '5b321756ba7376a704362f50',
  ];

  const objQuery = {
    test: {
      count: 4,
      points: 3,
    },
    short: {
      count: 3,
      points: 3,
    },
    long: {
      count: 2,
      points: 4,
    },
  };

  getQuestions(collections, objQuery).then(() => {
    // Randomly remove excess questions from the arrays
    while (qTest.length > objQuery.test.count) {
      qTest.splice((Math.floor(Math.random() * qTest.length)), 1);
    }
    while (qShort.length > objQuery.short.count) {
      qShort.splice((Math.floor(Math.random() * qShort.length)), 1);
    }
    while (qLong.length > objQuery.long.count) {
      qLong.splice((Math.floor(Math.random() * qLong.length)), 1);
    }

    // TODO: Assign points to each question

    // Generated exam
    const examen = {
      test: qTest,
      short: qShort,
      long: qLong,
    };
    console.log(examen.test);
  });
}

function getQuestions(collections, objQuery) {
  if (collections.length > 0) {
    const numTest = Math.ceil(objQuery.test.count / collections.length);
    const numShort = Math.ceil(objQuery.short.count / collections.length);
    const numLong = Math.ceil(objQuery.long.count / collections.length);

    let promises = [];

    collections.forEach((id) => {
      promises = promises.concat([
        collectionsController.getNumberOfQuestionsByType(id, 'test', numTest).then((res) => { res.map((question) => { qTest.push({ question, points: null }); }); }),
        collectionsController.getNumberOfQuestionsByType(id, 'short', numShort).then((res) => { res.map((question) => { qShort.push({ question, points: null }); }); }),
        collectionsController.getNumberOfQuestionsByType(id, 'long', numLong).then((res) => { res.map((question) => { qLong.push({ question, points: null }); }); }),
      ]);
    });
    return Promise.all(promises);
  }
  return null;
}


/* function generateExam() {
  getAllQuestions([
    '5b3a68abed273c24248af9cd',
    '5b321756ba7376a704362f50',
  ]).then(() => {
    console.log(qTest);
  });
} */

/* function getAllQuestions(arrCollectionIds) {

  let promises = [];

  arrCollectionIds.forEach((id) => {
    promises = promises.concat([
      collectionsController.getQuestionsByType(id, 'test').then((res) => { qTest = qTest.concat(res); }),
      collectionsController.getQuestionsByType(id, 'short').then((res) => { qShort = qShort.concat(res); }),
      collectionsController.getQuestionsByType(id, 'long').then((res) => { qLong = qLong.concat(res); }),
    ]);
  });

  return Promise.all(promises);
} */

