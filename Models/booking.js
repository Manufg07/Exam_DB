const {Schema} = require('mongoose');
const { model} = require('mongoose');
const demo = new Schema({
    room: { type:String, required: true},
    name:    { type:String, required: true},
    checkIn:  { type:String, required: true},
    checkOut:  { type:String, required: true}
});

const sample = model('booking', demo);
module.exports=sample;