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
- GET === /auth/authorized
    Check if user is authorized
    
    Expected HTTP request
    ```
        GET http://localhost:8080/auth/authorized
        Authorization: Bearer {ACCESS_TOKEN}

        {
        }
    ```
    Responses
    ```
    --- 200 OK
     \- 401 Unauthorized: invalid token
    ```
- GET === /auth/accessToken
    Get new access token

    Expected HTTP request
    ```
        GET http://localhost:8080/auth/accessToken
        Cookie: refreshToken={REFRESH_TOKEN}; Path=/; HttpOnly

        {
        }
    ```
    Responses
    ```
        --- 200 OK
         |- 401 Unauthorized: invalid refresh token
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
- GET === /auth/refreshToken
    Get new refresh token

    Expected HTTP request
    ```
        GET http://localhost:8080/auth/refreshToken
        Cookie: refreshToken={REFRESH_TOKEN}; Path=/; HttpOnly

        {
        }
    ```
    Responses
    ```
        --- 200 OK: current refresh token is still valid
         |- 201 Created: new refresh token
         |- 401 Unauthorized: invalid refresh token
         \- 500 Internal Server Error
    ```
    200 response
    ```
        HTTP/1.1 200 OK

        {
            "message": "refresh token is still valid."
        }
    ```
    201 response
    ```
        HTTP/1.1 200 Created
        Set-Cookie: refreshToken={REFRESH_TOKEN}; Path=/;

        {
            "refreshToken": {REFRESH_TOKEN}
            "expiresIn": {EXPIRATION}
        }
    ```
- DELETE === /auth/logout
    Logout

    Expected HTTP request
    ```
        DELETE http://localhost:8080/auth/logout

        {
        }
    ```
    Responses
    ```
        --- 204 No Content: deleted
    ```
    204 response
    ```
        HTTP/1.1 200 Created
        Set-Cookie: refreshToken=null; Path=/; accessToken=null; Path=/;

        {
        }
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
