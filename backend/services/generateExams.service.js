const collectionsController = require('../controllers/collections.controller');

let qTest = [];
let qShort = [];
let qLong = [];

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

      // Add max_points field
      qTest.forEach((elem, i) => {
        qTest[i].max_points = 0;
      });
      qShort.forEach((elem, i) => {
        qShort[i].max_points = 0;
      });
      qLong.forEach((elem, i) => {
        qLong[i].max_points = 0;
      });

      // Shuffle test questions
      qTest.forEach((elem, i) => {
        qTest[i].options = shuffleTestQuestionOptions(qTest[i].options);
      });

      // Calculate points per question
      let sumDifficultyPointsTest = 0;
      qTest.forEach((elem) => {
        sumDifficultyPointsTest += (elem.difficulty === 0) ? 1 : elem.difficulty;
      });
      let sumDifficultyPointsShort = 0;
      qShort.forEach((elem) => {
        sumDifficultyPointsShort += (elem.difficulty === 0) ? 1 : elem.difficulty;
      });
      let sumDifficultyPointsLong = 0;
      qLong.forEach((elem) => {
        sumDifficultyPointsLong += (elem.difficulty === 0) ? 1 : elem.difficulty;
      });

      let k = (objQuery.test.points / sumDifficultyPointsTest);
      qTest.forEach((elem, i) => {
        qTest[i].max_points =
          Math.round((qTest[i].difficulty * k) * 100) / 100;
      });

      k = (objQuery.short.points / sumDifficultyPointsShort);
      qShort.forEach((elem, i) => {
        qShort[i].max_points =
          Math.round((qShort[i].difficulty * k) * 100) / 100;
      });

      k = (objQuery.long.points / sumDifficultyPointsLong);
      qLong.forEach((elem, i) => {
        qLong[i].max_points =
          Math.round(((qLong[i].difficulty * k) * 100) / 100);
      });

      // Generated exam data
      const examData = {
        title: 'Nuevo examen',
        date: new Date(),
        description: 'Descripción',
        subject: 'Nombre de la asignatura',
        school_name: 'Nombre de la escuela',
        sections: [
          {
            title: 'Preguntas de Test',
            statement: 'Enunciado de las preguntas de Test',
            questions: qTest,
          },
          {
            title: 'Preguntas Cortas',
            statement: 'Enunciado de las preguntas Cortas',
            questions: qShort,
          },
          {
            title: 'Preguntas Largas',
            statement: 'Enunciado de las preguntas de Largas',
            questions: qLong,
          },
        ],
        count: {
          test: qTest.length,
          short: qShort.length,
          long: qLong.length,
        },
      };
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
        collectionsController.getNumberOfQuestionsByType(id, 'test', numTest).then(res => qTest = qTest.concat(res)),
        collectionsController.getNumberOfQuestionsByType(id, 'short', numShort).then(res => qShort = qShort.concat(res)),
        collectionsController.getNumberOfQuestionsByType(id, 'long', numLong).then(res => qLong = qLong.concat(res)),
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

