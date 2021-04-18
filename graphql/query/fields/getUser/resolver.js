module.exports = async function getUser (_, { input }, { dataSources }) {
  try {
    let { userId } = input
    const user = await dataSources.sdr.User.findById(userId);
    if (user) return user;
    else throw new Error("User not Found");
  } catch (error) {
    console.log("error: ", error);
    throw new Error(error);
  }
};
