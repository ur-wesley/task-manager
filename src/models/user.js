const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const Task = require("./task")

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid!")
        }
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
      validate(value) {
        if (value.includes("password")) {
          throw new Error('Password cant contain "password"!')
        }
      }
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number!")
        }
      }
    },
    tokens: [{
      token: {
        type: String,
        required: true
      }
    }],
    avatar: {
      type: Buffer
    }
  }, {
    timestamps: true
  })

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
})

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

//accessible on user - kleines u
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET)

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

//accessible on User - großes U
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error("Unable to login")
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error("Unable to login")
  }

  return user
}

// hash pw before saving, add middleware to work for user change and creation - udemy #104
userSchema.pre("save", async function (next) {
  const user = this

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10)
  }

  next()
})

// Delte user tasks when user is removed
userSchema.pre("remove", async function (next) {
  const user = this
  await Task.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model("User", userSchema)

module.exports = User
