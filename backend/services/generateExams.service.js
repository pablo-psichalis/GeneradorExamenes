const collectionsController = require('../controllers/collections.controller');

const qTest = [];
const qShort = [];
const qLong = [];

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
      count: 5,
      points: 2.5,
      // 4, 3
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

    let sumDifficultyPointsTest = 0;
    qTest.forEach((elem) => {
      sumDifficultyPointsTest += (elem.question.difficulty === 0) ? 1 : elem.question.difficulty; // TODO: check after BD fix
    });
    let sumDifficultyPointsShort = 0;
    qTest.forEach((elem) => {
      sumDifficultyPointsShort += (elem.question.difficulty === 0) ? 1 : elem.question.difficulty;
    });
    let sumDifficultyPointsLong = 0;
    qTest.forEach((elem) => {
      sumDifficultyPointsLong += (elem.question.difficulty === 0) ? 1 : elem.question.difficulty;
    });

    const k = (objQuery.test.points / sumDifficultyPointsTest);
    qTest.forEach((elem, i) => {
      qTest[i].points =
        ((qTest[i].question.difficulty === 0) ? 1 : qTest[i].question.difficulty) * k;
    });

    qShort.forEach((elem, i) => {
      qShort[i].points =
        qShort[i].question.difficulty * (objQuery.short.points / sumDifficultyPointsShort);
    });

    qLong.forEach((elem, i) => {
      qLong[i].points =
        qLong[i].question.difficulty * (objQuery.long.points / sumDifficultyPointsLong);
    });


    // Generated exam
    const examen = {
      test: qTest,
      short: qShort,
      long: qLong,
    };
    console.log(examen);
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
        collectionsController.getNumberOfQuestionsByType(id, 'test', numTest).then((res) => { res.map((question) => { qTest.push({ question, points: 0 }); }); }),
        collectionsController.getNumberOfQuestionsByType(id, 'short', numShort).then((res) => { res.map((question) => { qShort.push({ question, points: 0 }); }); }),
        collectionsController.getNumberOfQuestionsByType(id, 'long', numLong).then((res) => { res.map((question) => { qLong.push({ question, points: 0 }); }); }),
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

