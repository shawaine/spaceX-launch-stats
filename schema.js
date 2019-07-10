const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");
const Axios = require("axios");

// Rocket Type
const RocketType = new GraphQLObjectType({
  name: "Rocket",
  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString }
  })
});

// Launch Type
const LaunchType = new GraphQLObjectType({
  name: "Launch",
  fields: () => ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLString },
    launch_date_local: { type: GraphQLString },
    launch_success: { type: GraphQLBoolean },
    rocket: { type: RocketType }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // get all launches
    launches: {
      type: new GraphQLList(LaunchType),
      resolve(parentValue, args) {
        return Axios.get("https://api.spacexdata.com/v3/launches").then(
          res => res.data
        );
      }
    },
    // get a specific launch by id
    launch: {
      type: LaunchType,
      args: {
        flight_number: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        return Axios.get(
          "https://api.spacexdata.com/v3/launches/" + args.flight_number
        ).then(res => res.data);
      }
    },
    // get all rockets
    rockets: {
      type: new GraphQLList(RocketType),
      resolve(parentValue, args) {
        return Axios.get("https://api.spacexdata.com/v3/rockets").then(
          res => res.data
        );
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
