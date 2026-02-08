// const mongoose = require('mongoose');

// const rideSchema = new mongoose.Schema({

//     /* ----------------------------------
//        USER WHO CREATED JOURNEY REQUEST
//     ---------------------------------- */
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'user',
//         required: true
//     },

//     /* ----------------------------------
//        MATCHED COMPANION USER
//        (null until match happens)
//     ---------------------------------- */
//     matchedWith: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'user',
//         default: null
//     },

//     /* ----------------------------------
//        LOCATION DETAILS
//     ---------------------------------- */
//     pickup: {
//         type: String,
//         required: true,
//     },

//     destination: {
//         type: String,
//         required: true,
//     },

//     /* ----------------------------------
//        TRAVEL DETAILS
//     ---------------------------------- */
//     departureTime: {
//         type: Date,
//         required: true
//     },

//     mode: {
//         type: String,
//         enum: ['bus', 'metro', 'cab', 'walk', 'mixed'],
//         required: true
//     },

//     /* ----------------------------------
//        JOURNEY STATUS FLOW
//        pending → matched → ongoing → completed
//     ---------------------------------- */
//     status: {
//         type: String,
//         enum: ['pending', 'matched', 'ongoing', 'completed', 'cancelled'],
//         default: 'pending',
//     },

//     /* ----------------------------------
//        ROUTE ANALYTICS (OPTIONAL)
//        Future AI / safety scoring
//     ---------------------------------- */
//     duration: {
//         type: Number, // seconds
//     },

//     distance: {
//         type: Number, // meters
//     },

//     /* ----------------------------------
//        MEETING POINT OTP VERIFICATION
//        Used when companions meet physically
//     ---------------------------------- */
//     meetOtp: {
//         type: String,
//         select: false,
//     },

//     meetOtpExpiry: {
//         type: Date,
//         select: false,
//     },

//     meetVerified: {
//         type: Boolean,
//         default: false
//     },

//     /* ----------------------------------
//        JOURNEY SESSION TIMES
//     ---------------------------------- */
//     startedAt: {
//         type: Date
//     },

//     completedAt: {
//         type: Date
//     },

//     /* ----------------------------------
//        SAFETY / TRACKING FLAGS
//     ---------------------------------- */
//     liveTracking: {
//         type: Boolean,
//         default: false
//     },

//     anomalyDetected: {
//         type: Boolean,
//         default: false
//     },

//     /* ----------------------------------
//        FEEDBACK / TRUST SCORE
//        Future expansion
//     ---------------------------------- */
//     rating: {
//         type: Number,
//         min: 1,
//         max: 5
//     }

// }, { timestamps: true });

// module.exports = mongoose.model('ride', rideSchema);



//**********************************

const mongoose = require('mongoose')


const rideSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  source: {
    address: String,
    lat: Number,
    lng: Number
  },

  destination: {
    address: String,
    lat: Number,
    lng: Number
  },

  travelMode: {
    type: String,
    enum: ['bus', 'bike', 'car'],
    required: true
  },

  isVerified: {
    type: Boolean,
    default: true // for now, keep true
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true })

module.exports = mongoose.model('Ride', rideSchema)


//  */