const collectionsController = require('../controllers/collections.controller');

let qTest;
let qShort;
let qLong;

let numQuestionPick;
let colCounts;

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

  numQuestionPick = [];
  colCounts = [];

  qTest = []; qShort = []; qLong = [];

  getCollectionCounts(collections).then(() => {

    const defaultPickTest = Math.floor(objQuery.test.count / collections.length);
    const defaultPickShort = Math.floor(objQuery.short.count / collections.length);
    const defaultPickLong = Math.floor(objQuery.long.count / collections.length);

    let totalPickTest = 0;
    let totalPickShort = 0;
    let totalPickLong = 0;

    for (let i = 0; i < collections.length; i += 1) {

      const testPick = (defaultPickTest > colCounts[i].count.test) ? colCounts[i].count.test : defaultPickTest;
      const shortPick = (defaultPickShort > colCounts[i].count.short) ? colCounts[i].count.short : defaultPickShort;
      const longPick = (defaultPickLong > colCounts[i].count.long) ? colCounts[i].count.long : defaultPickLong;

      numQuestionPick.push({ // Number of questions to pick from each collection
        test: testPick,
        short: shortPick,
        long: longPick,
      });

      totalPickTest += testPick;
      totalPickShort += shortPick;
      totalPickLong += longPick;
    }

    let i = 0;
    while (totalPickTest < objQuery.test.count) {
      if (i >= numQuestionPick.length) {
        i = 0;
      }
      if (numQuestionPick[i].test < colCounts[i].count.test) {
        numQuestionPick[i].test += 1;
        totalPickTest += 1;
      }
      i += 1;
    }

    i = 0;
    while (totalPickShort < objQuery.short.count) {
      if (i >= numQuestionPick.length) {
        i = 0;
      }
      if (numQuestionPick[i].short < colCounts[i].count.short) {
        numQuestionPick[i].short += 1;
        totalPickShort += 1;
      }
      i += 1;
    }

    i = 0;
    while (totalPickLong < objQuery.long.count) {
      if (i >= numQuestionPick.length) {
        i = 0;
      }
      if (numQuestionPick[i].long < colCounts[i].count.long) {
        numQuestionPick[i].long += 1;
        totalPickLong += 1;
      }
      i += 1;
    }
  }).catch((err) => {
    console.error(err);
  });



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
        statement: 'Enunciado de las preguntas Largas',
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
    console.log(err);
  });
}).catch((err) => {
  console.error(err);
});


function getCollectionCounts(collections) {
  let promises = [];
  collections.forEach((id) => {
    promises = promises.concat([
      collectionsController.getCollectionQuestionCount(id)
        .then(countObj => colCounts.push(countObj)),
    ]);
  });
  return Promise.all(promises);
}


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
