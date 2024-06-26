const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const sample =  require('./Models/booking')
const PORT=3001;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dotenv.config();
const url = process.env.mongodb_uri;
mongoose.connect(
    url
);

const database = mongoose.connection;
database.on("error", (error) =>{
    console.log(error)
});
database.once("connected", () =>{
    console.log("Databse Connected");
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add.html'));
});

app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viewBooking.html'));
});

app.post('/submit-form',async(req, res) => {
    try{
        const data=req.body;
        console.log(data)
        const details=await sample.create(data);
        res.status(201).redirect('./success');
    }
    catch(error){
        console.log(error);
        res.status(500).json();
    }
});

app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});


app.get('/view/:room', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viewBooking.html'));
});


app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await sample.find();
        res.json(bookings);
        console.log(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

app.get('/update/:room', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'update.html'));
});



app.get('/api/view/:room', async (req, res) => {
    const room = req.params.room;
    try {
        const details = await sample.findOne({ room: room });
        console.log("details",details);
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});

app.put('/api/view/:room', async (req, res) => {
    const room = req.params.room;
    const { name, checkIn, checkOut } = req.body;
    try {
      const updatedBooking = await sample.findOneAndUpdate(
        { room: room },
        { name, checkIn, checkOut },
        { new: true }
      );
      if (!updatedBooking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update booking' });
    }
  });


app.delete('/api/view/:room', async (req, res) => {
    const room = req.params.room;
    try {
        const deletedBooking = await sample.findOneAndDelete({ room: room });
        if (!deletedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Failed to delete booking' });
    }
});


app.get('/view/:date', async (req, res) => {
    const date = req.params.date; 
    try {
        const bookings = await bookings.find({ checkIn: date }); 
        res.json(bookings); 
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Serve the new bookings by date page
app.get('/bookingsByDate', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bookingsByDate.html'));
});

app.get('/view/:date', async (req, res) => {
    const checkInDate = req.params.date;
    try {
        const bookings = await sample.find({ checkIn: checkInDate });
        res.json(bookings);
        console.log(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});