to see api documentation, open [swagger editor](https://editor.swagger.io) and paste the text from [api.yaml](https://github.com/marekvks/DVWB-Zaverecka-Server/blob/main/docs/api.yaml) in the editor

# Endpoints
> This will be transfered to swagger eventually
## Auth
- POST === /auth/register
    Register a user
    ! password is hashed by the server before being stored in a database !

    Expected HTTP request
    ```
        POST http://localhost:8080/auth/register
        Content-Type: application/json

        {
            "username": "{USERNAME}",
            "email": "{EMAIL}",
            "password": "{PASSWORD}"
        }
    ```
    Responses
    ```
        --- 201 Created
         \- 400 Bad Request: username or email is already used || invalid email
    ```
    201 response body
    ```
        None
    ```
- POST === /auth/login
    Log-in as a user

    Expected HTTP request
    ```
        POST http://localhost:8080/auth/login
        Content-Type: application/json

        {
            "email": "{EMAIL}",
            "password": "{PASSWORD}"
        }
    ```
    Responses
    ```
        --- 200 OK
         \- 400 Bad Request: invalid email or password
    ```
    200 response
    ```
        TTP/1.1 200 OK
        Set-Cookie: refreshToken={REFRESH_TOKEN}; Path=/; HttpOnly

        {
            "accessToken": "{ACCESS_TOKEN}",
            "expiresIn": "{EXPIRATION}"
        }
    ```
- GET === /auth/loggedIn
    Expected HTTP request
    ```
        GET http://localhost:8080/auth/loggedIn
        Authorization: Bearer {ACCESS_TOKEN}

        {
        }
    ```
    Responses
    ```
    --- 200 OK
     |- 400 Bad Request: no token
     \- 403 Forbidden: invalid token
    ```
    200 response body
    ```
        None
    ```
- GET === /auth/token
    Expected HTTP request
    ```
        POST http://localhost:8080/auth/token
        Cookie: refreshToken={REFRESH_TOKEN}; Path=/; HttpOnly

        {
        }
    ```
    Responses
    ```
        --- 200 OK
         |- 400 Bad Request: no token
         \- 403 Forbidden: invalid refresh token
    ```
    200 response body
    ```
        {
            "accessToken": "{ACCESS_TOKEN}",
            "expiresIn": "{EXPIRATION}"
        }
    ```
- DELETE === /auth/token
    Expected HTTP request
    ```
        POST http://localhost:8080/auth/token
        Cookie: refreshToken={REFRESH_TOKEN}; Path=/; HttpOnly

        {
        }
    ```
    Responses
    ```
        --- 204 No Content: deleted
         |- 400 Bad Request: invalid token
         \- 404 Not Found: token not found
    ```

## Blogpost
- GET === /mainPage
  Expected HTTP request
  ```
  GET http://localhost:8080/blogPost/mainPage

  {
  }
  ```
  Responses
  ```
    --- 200 OK
    |- 400 Bad Request: no token
    \- 403 Forbidden: invalid refresh token
  ```
- GET === /blogPostTitle/:title
  Expected HTTP request
  ```
    GET http://localhost:8080/blogPost/blogPostTitle/:title

  {
  }
  ```
  Responses
  ```
    --- 200 OK
    |- 400 Bad Request: no token || invalid title
    \- 403 Forbidden: invalid refresh token
  ```
- PATCH === /blogPost/:id
  Expected HTTP request
   ```
  PATCH http://localhost:8080/blogPost/blogPost:id
    Content-Type: application/json

    {    
        "title": "{TITLE}",
        "content": "{CONTENT}",
        "id_author": {ID_AUTHOR}
    }
  ```
  Responses
  ```
    --- 200 OK
    |- 400 Bad Request: no token || invalid id || invalid body
    \- 403 Forbidden: invalid refresh token
  ```
- POST === /blogPost
   Expected HTTP request
   ```
  POST http://localhost:8080/blogPost/blogPost
    Content-Type: application/json

    {
        "title": "TITLE",
        "content": "{CONTENT}",
        "id_author": {ID_AUTHOR}
    }
  ```
   Responses
  ```
    --- 200 OK
    |- 400 Bad Request: no token || invalid id || invalid body
    \- 403 Forbidden: invalid refresh token
  ```
- DELETE === /blogPost
  Expected HTTP request
  ```
  DELETE http://localhost:8080/blogPost/blogPost:id

    {
    }
  ```
   Responses
  ```
    --- 200 OK
    |- 400 Bad Request: no token || invalid id
    \- 403 Forbidden: invalid refresh token
  ```
