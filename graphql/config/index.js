const { ApolloServer } = require("apollo-server");
const mongoose = require('mongoose')
const fs = require('fs');


const { MONGODB } = require('../../config')
const resolvers = require('../resolvers')


const schema = fs.readFileSync(path.resolve('graphql/schema.graphql'), {
  encoding: 'utf-8',
});

const typeDefs = gql`${schema}`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {

  }
})


mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MONGODB CONNECTED: ')
    return server.listen({ port: '4000' })
  })
  .then(res => {
    console.log('Server Running at port: ', res.url)
  })
  .catch(err => {
    console.log('err: ', err)
  })