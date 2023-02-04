const crypto = require("crypto"); 
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

//name, email, photo, password, passwordConfirmed

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, "Tell us your Good Name"]
  },
  email:{
    type: String,
    required: [true, "Tell us your Email Id"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"]
  },
  photo: String,

  role:{
    type: String,
    enum: ["user", "creator", "admin", "guide"],
    default: "user"
  },

  password:{
    type: String,
    required: [true, "Enter Password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm:{
    type: String,
    required: [true, "Confirm Password"],
    validate: {
      //THIS CAN ONLY WORK AT THE TIME OF CREATE not UPDATE
      validator: function(el){
        return el === this.password //abc===abc true, abc===acb false
      },
      message: "Password is not the same"
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// To display user's password update time
userSchema.pre("save", function(next){
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//To get only all the users whose active state is true
userSchema.pre(/^find/, function(next){
  this.find({active: {$ne:false}});
  next();
});


//To encrypt the user's password before storing it in DB
userSchema.pre("save", async function (next) {
  // Password Modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12); //HASH PW 12
  this.passwordConfirm = undefined; //To not store passwordConfirm param in database
  next();
});

//Decrypt password and compare to validate the user identity.
userSchema.methods.correctPassword = async function (candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp){
  if(this.passwordChangedAt){
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp; //300<200
    
    //console.log(changedTimeStamp, JWTTimestamp);
  }

  // By default we return False, means NO CHANGE
  return false;
};

//Method to create token to reset password
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  console.log({resetToken}, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //Link expires in 10 mins

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;