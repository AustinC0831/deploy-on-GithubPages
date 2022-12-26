//import { GraphQLServer, PubSub } from 'graphql-yoga';
import * as fs from 'fs'
import { createServer } from 'node:http'
import { WebSocketServer } from 'ws'
import { createPubSub, createSchema, createYoga } from 'graphql-yoga'
import { useServer } from 'graphql-ws/lib/use/ws'
//import db from './db';
import ChatBoxModel from './models/chatbox'
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
// import User from './resolvers/User';
// import Post from './resolvers/Post';
// import Comment from './resolvers/Comment';
import ChatBox from './resolvers/ChatBox';

const pubsub = createPubSub();

const yoga = createYoga({
  schema: createSchema({
    typeDefs: fs.readFileSync(
      './src/schema.graphql',
      'utf-8'
      ),
    resolvers: {
      Query,
      Mutation,
      Subscription,
      ChatBox,
    }
  }),
  context: {
    ChatBoxModel,
    pubsub,
  },
  graphiql: {
    subscriptionsProtocol: 'WS',
  }
});
const httpServer = createServer(yoga)

const wsServer = new WebSocketServer({
  server: httpServer,
  path: yoga.graphqlEndpoint,
})

useServer(
  {
  execute: (args) => args.rootValue.execute(args),
  subscribe: (args) => args.rootValue.subscribe(args),
  onSubscribe: async (ctx, msg) => {
    const { schema, execute, subscribe, contextFactory, parse, validate } = yoga.getEnveloped({
      ...ctx,
      req: ctx.extra.request,
      socket: ctx.extra.socket,
      params: msg.payload
    })

    const args = {
      schema,
      operationName: msg.payload.operationName,
      document: parse(msg.payload.query),
      variableValues: msg.payload.variables,
      contextValue: await contextFactory(),
      rootValue: {
        execute,
        subscribe
    }}
    const errors = validate(args.schema, args.document)
    if (errors.length) return errors
      return args
    },
    },
    
    wsServer,)
// server.listen({ port: process.env.PORT | 5000 }, () => {
//  console.log(`The server is up on port ${process.env.PORT | 5000}!`);
// });
export default httpServer