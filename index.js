// path init
const path = require('path');

// method override init
const methodOverride = require('method-override');


// express init
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// mongoose init
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelpcamp', {useUnifiedTopology: true, useNewUrlParser: true})

// mongoose error handiling
const db = mongoose.connection;
db.on('error', console.error.bind(console, '[Mongoose] Error:'));
db.once('open', () => { console.log('[Mongoose] Connection Sucess'); });

// misc init
const Campground = require('./models/campground');
const { urlencoded } = require('express');

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

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
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

app.get('/campgrounds/:id/edit', async (req, res) => 
{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    console.log(campground.title)

    res.render('campgrounds/edit', { campground });
})

app.post('/campgrounds', async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();

    res.redirect(`/campgrounds/${newCampground._id}`);
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const updatedCamp = await Campground.findOneAndUpdate(id, {...req.body.campground}, {runValidators: true});

    res.redirect(`/campgrounds/${updatedCamp._id}`);
})

app.delete('/campgrounds/:id', async (req, res) =>
{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    res.redirect('/campgrounds');
})

// express port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[Express] Listening on port: ${PORT}`)
})