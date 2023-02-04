const crypto = require("crypto");
const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");
const sendEmail = require("../Utils/email");

//CREATE TOKEN
const signToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  //Create Cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true, //Will only run on httpS. Commented becoz we can't run in secure env while working in development mode.
    httpOnly: true,
  };

  // if ((process.env.NODE_ENV = "production")) cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status:"Success",
    token,
    data:{
      user,
    },
  });
}

//SIGNUP
exports.signup = catchAsync(async(req, res, next) => {
  const newUser = await User.create(req.body);

  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  // });

  createSendToken(newUser, 201, res);

  // const token = signToken(newUser._id);

  // res.status(201).json({
  //   status:"Success",
  //   token,
  //   data:{
  //     user:newUser,
  //   },
  // });
});

//LOGIN 
exports.login = catchAsync(async (req, res, next) => {
  const {email, password} = req.body;

  if(!email || !password) {
    return next(new AppError("Enter your Email and Password"));
  }

  const user = await User.findOne({email}).select("+password");

  if(!user || !(await user.correctPassword(password, user.password))){
    return next(new AppError("Incorrect Email and Password", 401));
  }

  createSendToken(user, 200, res);

  // const token = signToken(user.id);
  // res.status(200).json({
  //   status:"Success",
  //   token,
  // });
});

//PROTECTING DATA: Middleware to check whether user is logged in or not
exports.protect = catchAsync(async (req, res, next) => {
  //Checks to perform:
  // 1. Check token
  let token;
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if(!token){
    return next(new AppError("You  are not Logged In to get access",401));
  }
  //console.log(token);
  // 2. Validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //console.log(decoded);

  // 3. User exist (Sometime user account is deleted but token is still active)
  const currentUser = await User.findById(decoded.id);

  if(!currentUser){
    return next(
      new AppError("The user belonged to this token no longer exist",401)
      );
  }
  // 4. Change Password (Token is based on password)
  if (currentUser.changedPasswordAfter(decoded.iat)){
    return next(
      new AppError("User recently changed the password",401)
      );
  }

  //User will have access to protected data
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return(req, res, next) => {
    if(!roles.includes(req.user.role)){
      return next(
        new AppError("You do not have access to delete NFT",403)
      );
    }
    next();
  };
};

//FORGOT PASSWORD
exports.forgotPassword = catchAsync(async(req, res,next) => {
  // 1. Get user based on given email
  const user = await User.findOne({email: req.body.email});

  if (!user) {
    return next(new AppError("There is no user with this email",404));
  }
  // 2. Create a random Token
  const resetToken = user.createPasswordResetToken(); 
  await user.save({validateBeforeSave: false});

  // 3. Send Email back to user
  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a Update request with your new password and confirm password to: ${resetURL}.\n If 
  didn't forget your password, Ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Link vaild for 10 mins",
      message,
    });
  
    res.status(200).json({
      status: "Success",
      message: "Link send to email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({validateBeforeSave: false});

    return next(
      new AppError("There was an error while sending an email, Try Again Later",500)
    );
  }    
});

//RESET PASSWORD
exports.resetPassword = async(req, res,next) => {
  // 1. Get user based on token

  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {$gt: Date.now()},
  });

  // 2. If token is not expired and there is user, seth the new password

  if(!user){
    return next(new AppError("Token is invalid or has expired",400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3. Update changePassword for the user

  // 4. Log the user IN, sned JWT

  createSendToken(user, 200, res);

  // const token = signToken(user.id);
  // res.status(200).json({
  //   status:"Success",
  //   token,
  // });
};

//UPDATE PASSWORD

exports.updatePassword = catchAsync(async(req, res, next) => {
  // 1. Get user from database

  const user = await User.findById(req.user.id).select("+password");

  // 2. Check if posted current password is correct

  if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Password entered is wrong",401));
  }
  
  // 3. If so, update password
  
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4. Log User after password changed

  createSendToken(user, 200, res);

});