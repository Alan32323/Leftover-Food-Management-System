const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    foodName: {
      type: String,
      required: true
    },

    foodType: {
      type: String,
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    remainingQuantity:{
      type:Number,
      default:0
    },

    unit: {
      type: String,
      default: "Plates"
    },

    location: {
      type: String,
      required: true
    },

    googleMapLink: {
      type: String,
      required: true
    },

    providerId:{
      type:String,
      required:true
    },
    providerName: {
      type: String,
      required: true
    },

    providerType: {
      type: String,
      required: true
    },

    contactNo:{
      type:String,
      required:true
      
    },

    expiryTime: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: [
        "available",
        "requested",
        "delivered",
        "expired",
        "unavailable"
      ],
      
      default: "available",
    },
requests: [
  {
    userId: String,
    userName: String,
    requestedQuantity: Number,

    status: {
      type: String,
      default: "requested",
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },
  },
],
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Food", foodSchema);
