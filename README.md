# Generador web de exámenes

## Modelos
### Colección
        {
            title: String,
            description: String,
            questions: Array
        }
### Examen
        {
            title: String,
            date: Date,
            description: String,
            subject: String,
            school_name: String,
            questions: Array
        }
#### Pregunta de examen (question)
Cada una de las preguntas (apartados) que forman el examen.

        {
            title: String,
            statement: String,  // enunciado
            content: Object,    // contenido (libre)
        }

#### Contenido (content)
Se trata del texto que complementa al enunciado de cada una de las preguntas de examen (opcional).

Para las preguntas tipo Test, se almacena un array de objetos opción: `{ content: String }` y el id de la opción correcta.

        {
            statement: String,      // enunciado de la pregunta
            options: Array 
                [
                    { option: String },    // opción 0
                    { option: String },    // opción 1
                          ...
                ],
            correct_option: Number
        }

Para las preguntas de tipo libre, simplemente se almacena el texto insertado a través del editor.
    
    {
        text: String        // texto de la pregunta
        solution: String    // texto con la solución 
    }

#### 

### Ejemplos
Examen de ejemplo.

Nota: La puntuación de cada pregunta/apartado se añade al objeto Examen ya que el peso que se le asigne depende del examen; de esta forma, la puntuación no forma parte de los objetos Pregunta de la base de datos.

        {
            title: "Examen sobre arroces",
            date: 1/07/2018,
            description: 
                "En esta primera parte del examen (Test) que se entrega
                en una hoja aparte y se recogerá transcurridos 30 minutos del comienzo
                del examen. No está permitido el uso de apuntes ni libros. 
                En la segunda parte (Ejercicios) con una duración de 100 minutos, 
                sí podrás utilizar libros, soluciones de exámenes, apuntes y una calculadora. 
                La duración máxima del examen es de 3 horas",
            subject: "Paella orientada a objetos (POO)",
            school_name: "E.T.N.O.N.O. - UPM",
            questions: 
                [
                    { // Preg 0
                        title: "Parte de Test",
                        statement: "Parte de test. Una única opción correcta" ,
                        content:
                            {               
                                {
                                    statement: "El mejor arroz es..."
                                    options: 
                                        [
                                            { option: "Arroz blanco" },    // opción 0
                                            { option: "Arroz negro" },     // opción 1
                                            { option: "Ninguno de esos" }, // opcion 2
                                        ],
                                    correct_option: 2,
                                },
                                {
                                    statement: "Tiempo de cocción de la paella"
                                    options: 
                                        [
                                            { option: "Depende" },         // opción 0
                                            { option: "50 parsecs" },      // opción 1
                                            { option: "99 nanosegundos" }, // opcion 2
                                        ],
                                    correct_option: 0,
                                },   
                                {
                                    statement: "De donde es originaria la paella?"
                                    options: 
                                        [
                                            { option: "Zamora" },       // opción 0
                                            { option: "Valencia" },     // opción 1
                                            { option: "Shandong" },     // opcion 2
                                        ],
                                    correct_option: 1,
                                }, 
                            },
                        max_points: 3,
                    },
                    { // Preg 1 
                        title: "Parte de Disertación" ,
                        statement: "Argumente a favor o en contra de la paella como desayuno regular",
                        content: 
                            {
                                text: "",
                            },
                        solution: "Texto con la posible solución por aquí, bla bla bla bla bla bla bla."
                        max_points: 4,    
                    },                    
                    { // Preg 2
                        title: "Parte de Problemas",
                        statement: "Si tenemos una rica paella de 16 bits: 0111 0100 0010 0101" ,
                        content:
                            {
                                text:
                                    "
                                        a) Calcular el tiempo estimado de deglución.
                                        Dato: Masa atómica del Hidrógeno = 1,00794u

                                        b) Estimar el tiempo perfecto de cocción.

                                        c) Si una comadreja camina sobre la paellera a fuego lento, 
                                        calcular gráficamente la masa del Sol.
                                    "
                                solution:"a) ~30 min   b) Depende    c) [imagen]"  
                            },
                        max_points: 3,
                    }
                ]
        }


## URLs y protección
Endpoints del backend y si requieren autenticación (PROTECTED = SI) o no (PROTECTED = NO).

| MÉTODO | ENDPOINT                | PROTECTED | NOTAS                 |
|--------|-------------------------|-----------|---------------------------------|
| GET | /users/:id | SI | Utilizar _id de Mongo
| POST | /users/register | NO
| POST | /login | NO 
| GET | /exams | SI
| POST | /exams | SI
| PUT | /exams | SI
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