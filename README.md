# advent-calendar-meter

Visual presentation of Korven Koukkaajat advent calendar sales.

### Set up 
* In project root set up firebase  
`yarn install -g firebase-tools`  
`firebase login`  
`firebase init` (hosting & functions, NO overwrite to all)  

* Add config 

Run `firebase functions:config:set calendarservice.googlekey="<THE API KEY>"` <- insert key with double slashed \\n

Add this to firebase database:
```
{
  "config" : {    
    "googleClientEmail" : "ilmoittautumiset@koukkaajat-lol.iam.gserviceaccount.com",
    "spreadsheetId" : "11DOyxi8xM7VkP-1oBv_Qvy3PoSfqN0NrGhooQsTt0Fo"
  }
}
```

* Add googleClientEmail to google sheet as reader

### Run locally
`firebase serve --only functions` 
`yarn start`

### Deploy to firebase
`yarn run fb-deploy` to deploy all  
OR
`yarn build`  
`firebase deploy --only hosting`

See app running here https://koukkaaja-kalenterit.firebaseapp.com 