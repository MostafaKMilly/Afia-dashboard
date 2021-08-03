How to run

- run this command to install dependencies ```npm install```

- make sure that database name is correct in ```config/config.json```

- run this command to initialize schemas ```npx sequelize-cli db:migrate``` 

- move shared folder to your backend folder after that uncomment USERS,APPOINTMENTS,DOCTORS objects in the ``main.js`` file

- make request to ```localhost:5000/api/addMockData``` with GET method in Postman to add mock data in the database

- finally run this command in frontend directory ```npm start```