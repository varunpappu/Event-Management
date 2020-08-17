# Event-Management
Simple Event Management application.  

## Languages:

Backend: Django Rest Framework(Python3)  
Frontend: React Js  

## Backend Setup:

1. Create a virtual Env (https://sourabhbajaj.com/mac-setup/Python/virtualenv.html)
2. Run pip -r install requirements.txt file to install Django dependency
3. Check Redis Server is up and running (redis-cli PING -> should receive PONG) (https://gist.github.com/tomysmile/1b8a321e7c58499ef9f9441b2faa0aa8)
4. Migrate the Models. python manage.py makemigration and python manage.py. migrate
5. Run Django Server -> python manage.py runserver
6. Server will be running in 127.0.0.1:8000

## Frontend Setup:

1. Navigate to frontend folder
2. Do npm install
3. Run npm run dev-client.
4. Server will be running in 127.0.0.1:8089


## Backend Models:
1. Event Creation Model -> Contains all relevant information related to the Event.  
2. Event Participants Model -> Store the Event Participants for the event along with necessary information.  
3. User Model -> Stores User Information.  
 
 
## API Documentation:
1. The endpoints are available at (https://documenter.getpostman.com/view/6807623/T1LQgRVH?version=latest)
  
## Task Completed:
1. User can register and Signup to the application. (endpoint -> 127.0.0.1:8089/register and 127.0.0.1:8089/login)
2. Create, View, Edit and Delete Events
3. Participate in an Event.
4. View all participants for an Event.
5. Get notified any changes made to an Event.


## Limitations:
1. The signals on Edit or Delete of an Event is forwarded to everyone. 
2. Authentication is done using Bearer Token and it doesnot add much or any security as such.

