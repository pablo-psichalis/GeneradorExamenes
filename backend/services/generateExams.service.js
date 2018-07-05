const collectionsController = require('../controllers/collections.controller');

const qTest = [];
const qShort = [];
const qLong = [];

exports.generateExam = (objQuery) => {
  return new Promise((resolve, reject) => {
    const { collections } = objQuery;

    // Mock data
    /*  {
       "collections": [
         "5b321756ba7376a704362f50",
         "5b321bc4ba7376a704362f58",
         "5b3259f84bd13d19bc69c2ae",
         "5b3a68abed273c24248af9cd"],
       "test":
           {
               "count": 5,
               "points": 3
           },
       "short":
           {
               "count": 2,
               "points": 3
           },
       "long":
           {
               "count": 1,
               "points": 4
           }
   }
  */
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

      // Shuffle test questions
      qTest.forEach((elem, i) => {
        qTest[i].options = shuffleTestQuestionOptions(qTest[i].question.options);
      });

      // Calculate points per question
      let sumDifficultyPointsTest = 0;
      qTest.forEach((elem) => {
        sumDifficultyPointsTest += (elem.question.difficulty === 0) ? 1 : elem.question.difficulty;
      });
      let sumDifficultyPointsShort = 0;
      qTest.forEach((elem) => {
        sumDifficultyPointsShort += (elem.question.difficulty === 0) ? 1 : elem.question.difficulty;
      });
      let sumDifficultyPointsLong = 0;
      qTest.forEach((elem) => {
        sumDifficultyPointsLong += (elem.question.difficulty === 0) ? 1 : elem.question.difficulty;
      });

      qTest.forEach((elem, i) => {
        const k = (objQuery.test.points / sumDifficultyPointsTest);
        qTest[i].points =
          Math.round((qTest[i].question.difficulty * k) * 100) / 100;
      });

      qShort.forEach((elem, i) => {
        const k = (objQuery.short.points / sumDifficultyPointsShort);
        qShort[i].points =
          Math.round((qShort[i].question.difficulty * k) * 100) / 100;
      });

      qLong.forEach((elem, i) => {
        const k = (objQuery.long.points / sumDifficultyPointsLong);
        qLong[i].points =
          Math.round(((qLong[i].question.difficulty * k) * 100) / 100);
      });

      // Generated exam data
      const examData = {
        test: qTest,
        short: qShort,
        long: qLong,
        count: {
          test: qTest.length,
          short: qShort.length,
          long: qLong.length,
        },
      };
      console.log(examData);
      resolve(examData);
    }).catch((err) => {
      reject(err);
    });
  });
};

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

function shuffleTestQuestionOptions(options) {
  const optionsArr = options;
  let counter = optionsArr.length;
  // Fisher-Yates Shuffle
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter -= 1;
    const temp = optionsArr[counter];
    optionsArr[counter] = optionsArr[index];
    optionsArr[index] = temp;
  }

  return optionsArr;
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

