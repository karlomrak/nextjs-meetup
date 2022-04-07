import { useEffect, useState } from "react";
import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";
// const DUMMY_MEETUPS = [
//   {
//     id: "m1",
//     title: "A first meetup",
//     image:
//       "https://www.ubm-development.com/magazin/wp-content/uploads/2020/03/kl-main-building-d-Kopie.jpg",
//     address: "Address 5, 12345 City",
//     description: "This is a description",
//   },
//   {
//     id: "m2",
//     title: "A second meetup",
//     image:
//       "https://www.sustainableplaces.eu/wp-content/uploads/2017/02/SmartBuilding.jpg",
//     address: "Address 5, 12345 City",
//     description: "This is a description of another meering",
//   },
// ];

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React meetups</title>
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
}
//renders page content while building
export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://database-admin:Password8131@cluster0.tkszk.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();
  client.close();
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    //updates data every 10 sec
    revalidate: 10,
  };
}

// //alternative to getStaticProps - always runs on the server for every incoming req
// export async function getServerSideProps(context) {
//   //if you need to use request that triggered rerendering
//   const req = context.req;
//   const res = context.res;

//   return {
//     props: { meetups: DUMMY_MEETUPS },
//   };
// }

export default HomePage;
