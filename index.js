// path init
const path = require('path');

// express init
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// mongoose init
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelpcamp', {useUnifiedTopology: true, useNewUrlParser: true })

// mongoose error handiling
const db = mongoose.connection;
db.on('error', console.error.bind(console, '[Mongoose] Error:'));
db.once('open', () => { console.log('[Mongoose] Connection Sucess'); });

// misc init
const Campground = require('./models/campground')

// express routes
app.get('/', (req, res) => {
    res.render('home');
})

app.get('/makecampground', async (req, res) => {
    let newCamp;
    try
    {
        newCamp = new Campground({title: 'Backyard'});
        await newCamp.save()
    }
    catch (e)
    {
        console.log(`[Mongoose] Error creating campground ${newCamp}`)
        console.log(e)
        process.exit(1);
    }
    console.log('[YelpCamp] Campground Created');
    res.send(newCamp);
})

// express port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[Express] Listening on port: ${PORT}`)
})