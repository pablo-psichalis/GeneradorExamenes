# Generador web de exámenes

## Modelos
### Colección
        {
            title: String,
            description: String,
            questions: Array,
            count: {
                test: Number,   // preguntas de tipo Test
                short: Number,  // preguntas cortas
                long: Number,   // preguntas largas
            }
        }
### Examen
        {
            title: String,
            date: Date,
            description: String,
            subject: String,
            school_name: String,
            sections: Array
            count: {
                test: Number,   // preguntas de tipo Test
                short: Number,  // preguntas cortas
                long: Number,   // preguntas largas
            }
        }

#### Apartado de examen (section)
Cada una de los apartados/secciones que forman el examen.

    {
        title: String,
        statement: String,  // enunciado
        questions: Array,   // preguntas
    }

#### Questions (preguntas)
Se trata de un objeto con el contenido de la sección, es decir, las preguntas de examen. Todas las preguntas contienen los campos difficulty (dificultad de la pregunta) y type (tipo de pregunta: test, short, o long).

Para las preguntas tipo Test, se almacena un array de objetos opción: `{ option: String }` y el id de la opción correcta (correct_option).

    {
        test: [
            {
                statement: String,      // enunciado de la pregunta
                options: Array 
                    [
                        { option: String },    // opción 0
                        { option: String },    // opción 1
                            ...
                    ],
                correct_option: Number
            } ,
            { otra pregunta },
            { otra pregunta },
                        ...
        ],
        difficulty: Number,
        type: 'test',
        max_points: Number       // opcional: Se retorna al [generar exámenes](#generación-de-exámenes)
    }

Para las preguntas de tipo short o long, simplemente se almacena el texto insertado a través del editor.

        {
            text: String,        // texto de la pregunta
            solution: String,    // texto con la solución
            difficulty: Number,
            type: 'short' / 'long',
            max_points: Number  // opcional: Se retorna al [generar exámenes](#generación-de-exámenes)
        }

### Ejemplos
Examen de ejemplo.

Nota: La puntuación de cada pregunta/apartado se añade al objeto Examen ya que el peso que se le asigne depende del examen; de esta forma, la puntuación no forma parte de los objetos Pregunta de la base de datos.

        {
        "title": "Examen sobre arroces",
        "date": "1/07/2018",
        "description": 
            "En esta primera parte del examen (Test) que se entrega en una hoja aparte y se recogerá transcurridos 30 minutos del comienzo del examen. No está permitido el uso de apuntes ni libros. En la segunda parte (Ejercicios) con una duración de 100 minutos, sí podrás utilizar libros, soluciones de exámenes, apuntes y una calculadora. La duración máxima del examen es de 3 horas",
        "subject": "Paella orientada a objetos (POO)",
        "school_name": "E.T.N.O.N.O. - UPM",
        "sections": 
            [
                {
                    "title": "Parte de Test",
                    "statement": "Parte de test. Una única opción correcta",
                    "questions":
                        [               
                            {
                                "statement": "El mejor arroz es...",
                                "options": 
                                    [
                                        { "option": "Arroz blanco" },    
                                        { "option": "Arroz negro" },    
                                        { "option": "Ninguno de esos" }
                                    ],
                                "correct_option": 2,
                                "max_points": 0.5
                            },
                            {
                                "statement": "Tiempo de cocción de la paella",
                                "options": 
                                    [
                                        { "option": "Depende" },        
                                        { "option": "50 parsecs" },      
                                        { "option": "99 nanosegundos" } 
                                    ],
                                "correct_option": 0,
                                "max_points": 0.5
                            },   
                            {
                                "statement": "De donde es originaria la paella?",
                                "options": 
                                    [
                                        { "option": "Zamora" },
                                        { "option": "Valencia" },
                                        { "option": "Shandong" }
                                    ],
                                "correct_option": 1,                                "max_points": 0.5
                            }
                        ],
                            },
				{
					"title": "Parte de Disertación" ,
					"statement": "Argumente a favor o en contra de la paella como desayuno regular",
					"questions": [ 
						{
							question: {
                                "text": "",
                                "solution": "Texto con la posible solución por aquí, bla bla bla bla bla bla bla.",
                                "type": "long",
                                "max_points": 4
						}
					],
				},                    
				{
					"title": "Parte de Problemas",
					"statement": "Si tenemos una rica paella de 16 bits: 0111 0100 0010 0101" ,
					"questions": {
						"short": {
							"text":
								"a) Calcular el tiempo estimado de deglución. Dato: Masa atómica del Hidrógeno = 1,00794u b) Estimar el tiempo perfecto de cocción. c) Si una comadreja camina sobre la paellera a fuego lento, calcular gráficamente la masa del Sol.",
							"solution":"a) ~30 min   b) Depende    c) [imagen]"  
                            "max_points": 3
						}
					},
				}
			],
        "count": 
			{
                "test": 1,   
                "short": 1,
                "long": 1
			}
    }


## URLs y protección
Endpoints del backend y si requieren autenticación (PROTECTED = SI) o no (PROTECTED = NO).

| MÉTODO | ENDPOINT                | PROTECTED | NOTAS                 |
|--------|-------------------------|-----------|---------------------------------|
| GET | /users/:id | SI | Utilizar _id de Mongo
| POST | /users/register | NO
| POST | /login | NO 
| GET | /exams | SI | Get todas las colecciones
| GET | /exams/:id | SI | Utilizar _id de Mongo
| POST | /exams/generate | SI | [Ver detalles](#generación-de-exámenes)
| POST | /exams | SI 
| DELETE | /exams/:id | SI | Utilizar _id de Mongo
| PUT | /exams/:id | SI | Utilizar _id de Mongo
| GET | /collections | SI | Get todas las colecciones
| GET | /collections/:id | SI | Utilizar _id de Mongo
| POST | /collections | SI 
| DELETE | /collections/:id | SI | Utilizar _id de Mongo
| PUT | /collections/:id | SI | Utilizar _id de Mongo

### Login
Para loguearse es necesario hacer un POST /login con un body que siga el siguiente patrón: 

    {
      "username": "nuevouser",
      "password": "1234"
    }

Body que devuelve el método POST de la petición anterior:

    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5 ... ",
        "user": {
            "_id": "5b213bf1dfa68d2214923639",
            "username": "nuevouser",
            "password": "1234",
            "__v": 0
        }
    }

Para las peticiones protegidas será necesario utilizar esta cabecera:

    x-access-token : eyJhbGciOiJIUzI1NiIsInR5 ...

### Registro

Para registrarse es necesario hacer un POST /users/register con un body que siga el siguiente patrón: 

    {
      "username": "nuevouser",
      "password": "1234"
    }

Body que devuelve el método POST de la petición anterior:

    {
        "_id": "5b213bf1dfa68d2214923639",
        "username": "nuevouser",
        "password": "1234",
        "__v": 0
    }

## Generación de exámenes
### Petición
Para la generación de exámenes, se envía por POST un JSON con la configuración de la generación del examen:

        {
            "collections": Array,
            "test":
                {
                    "count": Number,
                    "points": Number
                },
            "short":
                {
                    "count": Number,
                    "points": Number
                },
            "long":
                {
                    "count": Number,
                    "points": Number
                },
        }

Este JSON incluirá en el campo `collections` un array con las _ids de las colecciones de las que se extraerán las preguntas para generar el examen, y un objeto cada tipo de pregunta (`test`: tipo test, `short`: preguntas cortas,`long`: preguntas largas) con sus parámetros de generación:
* `count`: Cantidad de preguntas de ese tipo
* `points`: Total de puntos de ese tipo, a distribuir proporcionalmente entre todas las preguntas de dicho tipo (en función de su dificultad asignada)

### Respuesta
Se devolverá como respuesta un [objeto de examen](#examen). 