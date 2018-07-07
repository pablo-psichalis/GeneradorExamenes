const collectionsController = require('../controllers/collections.controller');

let qTest;
let qShort;
let qLong;

// Mock data
/*
  {
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
exports.generateExam = objQuery => new Promise((resolve, reject) => {
  const { collections } = objQuery;

  qTest = []; qShort = []; qLong = [];

  getQuestions(collections, objQuery).then(() => {

    qTest = removeExcessQuestions(qTest, objQuery.test.count);
    qShort = removeExcessQuestions(qShort, objQuery.short.count);
    qLong = removeExcessQuestions(qLong, objQuery.long.count);

    qTest.forEach((elem, i) => {
      qTest[i].options = shuffleTestQuestionOptions(qTest[i].options);
    });

    qTest = calculatePointsPerQuestion(qTest, objQuery.test.points);
    qShort = calculatePointsPerQuestion(qShort, objQuery.short.points);
    qLong = calculatePointsPerQuestion(qLong, objQuery.long.points);

    const sections = [];
    if (qTest.length > 0) {
      sections.push({
        title: 'Preguntas de Test',
        statement: 'Enunciado de las preguntas de Test',
        questions: qTest,
      });
    }
    if (qShort.length > 0) {
      sections.push({
        title: 'Preguntas Cortas',
        statement: 'Enunciado de las preguntas Cortas',
        questions: qShort,
      });
    }
    if (qLong.length > 0) {
      sections.push({
        title: 'Preguntas Largas',
        statement: 'Enunciado de las preguntas de Largas',
        questions: qLong,
      });
    }

    const examData = {
      title: 'Nuevo examen',
      date: new Date(),
      description: 'Descripción',
      subject: 'Nombre de la asignatura',
      school_name: 'Nombre de la escuela',
      sections,
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

function getQuestions(collections, objQuery) {
  if (collections.length > 0) {

    const numTest = Math.ceil(objQuery.test.count / collections.length);
    const numShort = Math.ceil(objQuery.short.count / collections.length);
    const numLong = Math.ceil(objQuery.long.count / collections.length);

    let promises = [];

    collections.forEach((id) => {
      promises = promises.concat([
        // TODO: Obtener el nº exacto de la BD (getNumberOfQuestionsByType)
        collectionsController.getQuestionsByType(id, 'test', numTest).then((res) => {
          qTest = qTest.concat(res);
        }),
        collectionsController.getQuestionsByType(id, 'short', numShort).then(res => qShort = qShort.concat(res)),
        collectionsController.getQuestionsByType(id, 'long', numLong).then(res => qLong = qLong.concat(res)),
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

function removeExcessQuestions(questionArr, maxLength) {
  while (questionArr.length > maxLength) {
    questionArr.splice((Math.floor(Math.random() * questionArr.length)), 1);
  }
  return questionArr;
}

function calculatePointsPerQuestion(qArray, totalPoints) {
  let sumDifficultyPoints = 0;
  qArray.forEach((elem, i) => {
    qArray[i].max_points = 0;
    sumDifficultyPoints += (elem.difficulty === 0) ? 1 : elem.difficulty;
  });
  qArray.forEach((elem, i) => {
    qArray[i].max_points =
      Math.round((qArray[i].difficulty * (totalPoints / sumDifficultyPoints)) * 100) / 100;
  });

  return qArray;
}
