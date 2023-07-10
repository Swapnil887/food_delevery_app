const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    user : { type:mongoose.Schema.ObjectId, ref: 'users' },
    restaurant : { type:mongoose.Schema.ObjectId, ref: 'restaurants' },
  items: [{
    name: String,
    price: Number,
    quantity: Number
  }],
  totalPrice: Number,
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zip: String
  },
  status: String // e.g, "placed", "preparing", "on the way", "delivered"
}
)


const Ordermodel = mongoose.model("orders",orderSchema)

module.exports = {Ordermodel}