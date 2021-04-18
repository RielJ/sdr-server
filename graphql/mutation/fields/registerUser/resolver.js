module.exports = async function (_, input, { dataSources }) {
  const { username, email, password, confirmPassword } = input
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
}