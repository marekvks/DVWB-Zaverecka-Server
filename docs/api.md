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
         \- 400 Bad Request: username or email is already   used || invalid email || invalid data
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
        HTTP/1.1 200 OK
        Set-Cookie: refreshToken={REFRESH_TOKEN}; Path=/; HttpOnly, accessToken={ACCESS_TOKEN}; Path=/

        {
            "AccessTokenExpiresIn": "{EXPIRATION}"
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
     \- 401 Unauthorized: invalid token
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
         |- 403 Forbidden: invalid refresh token
         \- 500 Internal Server Error
    ```
    200 response
    ```
        HTTP/1.1 200 OK
        Set-Cookie: accessToken={ACCESS_TOKEN}; Path=/;

        {
            "accessToken": "{ACCESS_TOKEN}",
            "expiresIn": "{EXPIRATION}"
        }
    ```
- DELETE === /auth/logout
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
         |- 401 Unauthorized: invalid token
         \- 404 Not Found: token not found
    ```
## User
- GET === /getUser
      returns all user info
      Expected HTTP request
  ```
        GET http://localhost:8080/user/getUser
        Authorization: Bearer {ACCESS_TOKEN}

        {
        }
    ```
  Responses
    ```
        --- 400 Bad Request: invalid token
        \-- 404 Not Found: user not found
         \- 500 Server Error
    ```
- POST === /updateUser
      updates user in db by the values
      Expected HTTP request
   ```
        POST http://localhost:8080/user/updateUser
        Content-Type: application/json
        Authorization: Bearer {ACCESS_TOKEN}
        {
            "firstName": "{FIRSTNAME}",
            "username": "{USERNAME}"
        }
    ```
   Responses
  ```
        --- 400 Bad Request: invalid token
        \-- 404 Not Found: user not found
         \- 500 Server Error
    ```
