const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const UserProfileSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	name: {
		first: {
			type: String,
			required: [true, 'Please add a first_name']
		},
		last: {
			type: String,
			required: [true, 'Please add a last_name']
		}
	},
	phone: {
		type: Number,
		required: [true, 'Please add a phone']
	},
	address: String,
	location: {
		// GeoJSON Point
		type: {
			type: String,
			enum: ['Point']
		},
		coordinates: {
			type: [Number],
			index: '2dsphere'
		},
		formattedAddress: String,
		street_number: String,
		street_name: String,
		city: String,
		state: String,
		zipcode: String,
		country: String
	},
	dob: {
		type: Date,
		default: Date.now
	},
	short_profile: String,
	profile_picture: String,
	category: Array,
	friend_list: Array,
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user'
	},
	last_login: {
		type: Date,
		default: Date.now
	}
});

// Geocode & create location field
UserProfileSchema.pre('save', async function (next) {
	const loc = await geocoder.geocode(this.address);
	this.location = {
		type: 'Point',
		coordinates: [loc[0].longitude, loc[0].latitude],
		formattedAddress: loc[0].formattedAddress,
		street_number: loc[0].streetNumber,
		street_name: loc[0].streetName,
		city: loc[0].city,
		state: loc[0].stateCode,
		zipcode: loc[0].zipcode,
		country: loc[0].countryCode
	};

	// Do not save address in DB
	this.address = undefined;
	next();
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);