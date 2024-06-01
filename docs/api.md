## Auth
- POST === /auth/register
    Register a user
    ! password is hashed by the server before being stored in a database !

    Expected HTTP request
    ```
        POST http://localhost:8080/api/v1/auth/register
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
        POST http://localhost:8080/api/v1/auth/login
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
        GET http://localhost:8080/api/v1/auth/authorized
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
        GET http://localhost:8080/api/v1/auth/accessToken
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
        GET http://localhost:8080/api/v1/auth/refreshToken
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
        DELETE http://localhost:8080/api/v1/auth/logout

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

- POST === /auth/refreshPasswordCode
    Send refresh password code via email

    Expected HTTP request
    ```
        POST http://localhost:8080/api/v1/auth/refreshPasswordCode

        {
            "email": {email}
        }
    ```
    Responses
    ```
        --- 200 OK: email sent
         |- 400 Bad Request: invalid email
         \- 404 Not found: user not found
    ```

- POST === /auth/checkForgotPasswordCode
    Check forgot password code

    Expected HTTP request
    ```
        POST http://localhost:8080/api/v1/auth/checkForgotPasswordCode

        {
            "email": {EMAIL},
            "refreshCode": {REFRESH_CODE}
        }
    ```
    Responses
    ```
        --- 200 OK
         |- 400 Bad Request: invalid email or code
         |- 401 Unauthorized: code expired
         \- 404 Not found: no code generated
    ```

- PATCH === /auth/checkForgotPasswordCode
    Check forgot password code

    Expected HTTP request
    ```
        PATCH http://localhost:8080/api/v1/auth/updatePassword

        {
            "email": {EMAIL},
            "refreshCode": {REFRESH_CODE},
            "password": {PASSWORD},
            "confirmPassword" {CONFIRM_PASSWORD}
        }
    ```
    Responses
    ```
        --- 204 No Content: password updated
         |- 400 Bad Request: invalid email or code
         |- 401 Unauthorized: code expired
         \- 404 Not found: no code generated
    ```

## User
- GET === /user/@me
      Returns all current user info

      Expected HTTP request
    ```
        GET http://localhost:8080/api/v1/user/@me
        Authorization: Bearer {ACCESS_TOKEN}

        {
        }
    ```
  Responses
    ```
        --- 200 OK
         |- 401 Unauthorized: invalid token
         |- 404 Not Found: user not found
         \- 500 Internal Server Error
    ```
    200 response
    ```
        HTTP/1.1 200 OK

        {
            "id_user": {ID_USER},
            "username": {USERNAME},
            "firstName": {FIRSTNAME},
            "lastName": {LASTNAME},
            "email": {EMAIL},
            "role": {ROLE}
        }
    ```

- GET === /user/:id
      Returns all current user info

      Expected HTTP request
    ```
        GET http://localhost:8080/api/v1/user/:id

        {
        }
    ```
  Responses
    ```
        --- 200 OK
         |- 400 Bad Request: invalid id
         |- 404 Not Found: user not found
         \- 500 Internal Server Error
    ```
    200 response
    ```
        HTTP/1.1 200 OK

        {
            "id_user": {ID_USER},
            "username": {USERNAME},
            "firstName": {FIRSTNAME},
            "lastName": {LASTNAME},
            "email": {EMAIL},
            "role": {ROLE}
        }
    ```

- GET === /user/:username
      Returns all current user info via username

      Expected HTTP request
    ```
        GET http://localhost:8080/api/v1/user/:id

        {
        }
    ```
  Responses
    ```
        --- 200 OK
         |- 404 Not Found: user not found
         \- 500 Internal Server Error
    ```
    200 response
    ```
        HTTP/1.1 200 OK

        {
            "id_user": {ID_USER},
            "username": {USERNAME},
            "firstName": {FIRSTNAME},
            "lastName": {LASTNAME},
            "email": {EMAIL},
            "role": {ROLE}
        }
    ```

- PATCH === /user/@me
      Updates current user info

      Expected HTTP request
    ```
        PATCH http://localhost:8080/api/v1/user/@me
        Authorization: Bearer {ACCESS_TOKEN}

        {
        }
    ```
  Responses
    ```
        --- 200 OK
         |- 401 Unauthorized: invalid token
         |- 400 Bad Request: username already exists
         \- 500 Internal Server Error
    ```
    200 response
    ```
        HTTP/1.1 200 OK

        {
            "id_user": {ID_USER},
            "username": {USERNAME},
            "firstName": {FIRSTNAME},
            "lastName": {LASTNAME},
            "email": {EMAIL},
            "role": {ROLE},
        }
    ```

- PATCH === /user/@me/password
      Updates user password

      Expected HTTP request
    ```
        PATCH http://localhost:8080/api/v1/user/@me/password
        Authorization: Bearer {ACCESS_TOKEN}

        {
            "currentPassword": {CURRENT_PASSWORD},
            "password": {PASSWORD},
            "confirmPassword": {CONFIRM_PASSWORD}
        }
    ```
  Responses
    ```
        --- 204 No Content
         |- 401 Unauthorized: invalid token
         |- 400 Bad Request: invalid password || passwords dont match || passwords needs to be at least 8 characters long
         \- 500 Internal Server Error
    ```

- GET === /user/@me/avatar
      Returns current user's avatar

      Expected HTTP request
    ```
        GET http://localhost:8080/api/v1/user/@me/avatar
        Authorization: Bearer {ACCESS_TOKEN}

        {
        }
    ```
  Responses
    ```
        --- 200 OK: avatar sent
         |- 401 Unauthorized: invalid token
         \- 500 Internal Server Error
    ```

- PATCH === /user/@me/avatar
        Updates current user's avatar

        Expected HTTP request (with an image in formdata)
    ```
        PATCH http://localhost:8080/api/v1/user/@me/avatar
    ```
  Responses
    ```
        --- 200 OK: avatar uploaded
         |- 400 Bad Request: invalid file type || no file uploaded
         |- 401 Unauthorized: invalid token
         |- 404 Not Found: user not found
         \- 500 Internal Server Error
    ```

- GET === /user/:id/avatar
      Returns user's avatar

      Expected HTTP request
    ```
        GET http://localhost:8080/api/v1/user/:id/avatar

        {
        }
    ```
  Responses
    ```
        --- 200 OK: avatar sent
         \- 500 Internal Server Error
    ```

# Follows

- GET === /user/follow/:userId/following
      Returns users (Array), which specified user is following

      Expected HTTP request
    ```
        GET http://localhost:8080/api/v1/user/follow/:userId/following

        {
        }
    ```
  Responses
    ```
        --- 200 OK: followed users sent
         |- 400 Bad Request: invalid user id
         |- 404 Not Found: no followed users found
         \- 500 Internal Server Error
    ```

- GET === /user/follow/:userId/followers
      Returns users followers (Array)

      Expected HTTP request
    ```
        GET http://localhost:8080/api/v1/user/follow/:userId/followers

        {
        }
    ```
  Responses
    ```
        --- 200 OK: followers users sent
         |- 400 Bad Request: invalid user id
         |- 404 Not Found: no followers found
         \- 500 Internal Server Error
    ```

- POST === /user/follow
      Follow a user

      Expected HTTP request
    ```
        POST http://localhost:8080/api/v1/user/follow
        Authorization: Bearer {ACCESS_TOKEN}

        {
            followedId: {FOLLOWED_ID}
        }
    ```
  Responses
    ```
        --- 201 Created: successfully followed a user
         |- 400 Bad Request: invalid followed user id
         |- 401 Unauthorized: invalid access token
         |- 409 Conflict: already following this user
         \- 500 Internal Server Error
    ```

- DELETE === /user/follow/:followId
      Unfollow a user

      Expected HTTP request
    ```
        DELETE http://localhost:8080/api/v1/user/follow/:followId
        Authorization: Bearer {ACCESS_TOKEN}

        {
        }
    ```
  Responses
    ```
        --- 204 No Content: successfully unfollowed a user
         |- 400 Bad Request: invalid followed user id
         |- 401 Unauthorized: invalid access token
         \- 500 Internal Server Error
    ```

# Comments

- POST === /comment/add
      Post a comment

      Expected HTTP request
    ```
        POST http://localhost:8080/api/v1/comment/add
        Authorization: Bearer {ACCESS_TOKEN}

        {
            "postId": {POST_ID}
            "content": {CONTENT}
        }
    ```
  Responses
    ```
        --- 201 Created: successfully posted a comment
         |- 400 Bad Request: invalid followed user id
         |- 404 Not Found: user or blogpost not found
         \- 500 Internal Server Error
    ```

- GET === /comment/fromPost/:id
      Get all comments from a post

      Expected HTTP request
    ```
        GET http://localhost:8080/api/v1/comment/fromPost/:id

        {
        }
    ```
  Responses
    ```
        --- 200 OK: comments sent
         |- 404 Not Found: blogpost not found
         \- 500 Internal Server Error
    ```
# Blogpost
- GET === /blogPost
  Expected HTTP request
  ```
  GET http://localhost:8080/blogPost/mainPage

  {
  }
  ```
  Responses
  ```
    --- 200 OK
     |- 400 Bad Request
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
    |- 400 Bad Request
  ```
- GET === /blogPostUser/:user
  Expected HTTP request
  ```
    GET http://localhost:8080/blogPost/blogPostUser/:user

  {
  }
  ```
  Responses
  ```
    --- 200 OK
  |- 400 Bad Request
  ```

  - GET ===/blogPost/:id_blogpost
  Expected HTTP request
  ```
    GET http://localhost:8080/blogPost/blogPost/:id_blogpost

  {
  }
  ```
  Responses
  ```
    --- 200 OK
  |- 400 Bad Request
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
  ```
