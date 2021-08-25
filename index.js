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
app.get('/campgrounds', async (req, res) => {
    let allCampgrounds;
    try
    {
        allCampgrounds = await Campground.find({});
    }
    catch(e)
    {
        console.log('[Mongoose] Error getting all campgrounds');
        console.log(e);
    }
    res.render('campgrounds/index.ejs', { allCampgrounds });
})
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    let campground;
    try
    {
        campground = await Campground.findById(id);
    }
    catch (e)
    {
        console.log(`[Mongoose] Error finding campground with id ${id}`);
        res.send('404! We Couldn\'t Find That!')
    }
    res.render('campgrounds/details', { campground });
})

// app.get('/makecampground', async (req, res) => {
//     let newCamp;
//     try
//     {
//         newCamp = new Campground({title: 'Backyard'});
//         await newCamp.save()
//     }
//     catch (e)
//     {
//         console.log(`[Mongoose] Error creating campground ${newCamp}`)
//         console.log(e)
//         process.exit(1);
//     }
//     console.log('[YelpCamp] Campground Created');
//     res.send(newCamp);
// })

// express port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[Express] Listening on port: ${PORT}`)
})