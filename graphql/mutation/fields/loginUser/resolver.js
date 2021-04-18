module.exports = async function (_, input, { dataSources }) {
  const { username, password } = input
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
}