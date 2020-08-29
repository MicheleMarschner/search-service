const mongoose = require('mongoose');
const slugify = require('slugify');

const StorySchema = new mongoose.Schema({
    user_id: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
    title: {
        type: String,
        required: [true, 'Please add a title'],
        minlength: 8,
        maxlength: 100
    },
    slug: String,
    short_description: String,
    body: {
        type: String,
        required: [true, 'Please add a text'],
        minlength: 10
    },
    author_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'UserProfile',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    published_at: Date,
    status: {
        type: String,
        enum: ['draft', 'published', 'achieved']
    },
    comment_count: Number,
    comments: [{
        author_id: {
            type: mongoose.Schema.ObjectId,
            ref: 'UserProfile',
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        text: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            default: true
        }
    }],
    like_count: Number,
    //?? or reactions? or separate?
    likes: [
        {
            user_id: { 
                type: mongoose.Schema.ObjectId, 
                ref: 'UserProfile'
            },
            active: {
                type: Boolean,
                default: false
            }
        }
    ],
    category: {
        type: Array
    },
    media: String
});

// Create Story slug from the name
StorySchema.pre('save', function(next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

module.exports = mongoose.model('Story', StorySchema);