let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let webpush = require('web-push');
let app = express();

console.log("Server running");

app.use(bodyParser.urlencoded({
    extended : false
}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {
    res.send("This is a push notification server use port 3000");
});

app.post('/subscribe', (req,res) => {
    let sub = req.body;
    res.set('Content-Type', 'application/json');

    

    webpush.setVapidDetails(
        "mailto:umarbasha007@gmail.com",
        "BHQ9VtddLfH4PYY7rZ7NwXysfNe-SCO14WoXS0PIPaFkMIjJZFQiKgT0wzV3LWo3e0rj_C4CHuJDQ-j1UrCeN58",
        "Y7N2jljcil3PQNK_-_itOGFRAyMsIFD4JxoFOY_Kfxk"
    );

    

    let payload = JSON.stringify({
        "notification" : {
            "title" : "Umar Basha",
            "body" : "Thanks for subscribing to our website",
            "icon" : "src/assets/icons/icon-96x96.png"
        }
    });

    

    Promise.resolve(webpush.sendNotification(sub,payload))
        .then(() => res.status(200).json({
            messaga : 'Notification sent'
        }))
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });

     console.log("Notification is sent");      
});

app.listen(3000, () => {
    console.log(`Server started on port : 3000`);
});