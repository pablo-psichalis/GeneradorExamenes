# Generador web de exámenes

## URLs y protección
Endpoints del backend y si requieren autenticación (PROTECTED = SI) o no (PROTECTED = NO).

| MÉTODO | ENDPOINT                | PROTECTED |
|--------|-------------------------|-----------|
| POST | /users/register | NO
| POST | /login | NO
| Metodo | Endpoint | Protected

Para loguearse es necesario hacer un POST /login con un body que siga el siguiente patrón: 

    {
      "username": "nuevouser",
      "password": "1234"
    }

Body que devuelve el método POST de la petición anterior:

    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5 ... ",
        "user": {
            "_id": "5b1fd9b1fac6df1b10686788",
            "username": "nuevouser",
            "password": "1234",
            "__v": 0
        }
    }

Para las peticiones protegidas será necesario utilizar esta cabecera:

    x-access-token : eyJhbGciOiJIUzI1NiIsInR5 ...

