import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,  
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],     
    },
    phno: {
        type: String,
        required: true,
        unique: true,
        minlength: 10, 
        maxlength: 10,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        // enum: [ "Event Manager" ,"Event Coordinator","Production Head","Production Volunteers","Logistics Head","Logistics Volunteer","Shadow","F&B Coordinator","RSVP","Hospitality" ] ,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    cv: String,
    rating: {
        type: Number,
        default: 0,
        min: 0,  
        max: 5,  
    },
    location: String,
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    friendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    avatar: {
        type: String,
    },
    experience: {
        type: Number,
        default: 0
    }
    
}, { timestamps: true });

UserSchema.pre('save', function(next) {
    if (this.isModified('email')) {
      this.email = this.email.toLowerCase();
    }
    if (this.isModified('role')){
      this.role = this.role.toLowerCase()
    }
    next();
  });

const User = mongoose.model('User', UserSchema); 

export default User;
