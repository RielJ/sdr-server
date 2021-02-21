const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validator");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

function generateToken (user) {
  console.log('user: ', user)
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: '10h' }
  );
}

module.exports = {
  Query: {
    async getUser (_, { userId }, context, info) {
      try {
        const user = await User.findById(userId);
        if (user) return user;
        else throw new Error("User not Found");
      } catch (error) {
        console.log("error: ", error);
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async login (_, { username, password }, context, info) {
      const { valid, errors } = validateLoginInput(
        username,
        password
      )

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username })
      if (!user) {
        errors.general = 'User not Found'
        throw new UserInputError('User Not Found', { errors })
      }

      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        errors.general = 'Wrong login credentials'
        throw new UserInputError('Wrong login credentials', { errors })
      }
      const token = generateToken(user)

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register (
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      // TODO: Validate user data.
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      // TODO: Make Sure user doesn't already exists in db.
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is already taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const result = await newUser.save();

      const token = generateToken(result)

      return {
        ...result._doc,
        id: result._id,
        token,
      };
    },
  },
};
