import { useState, useEffect } from "react";

import MeetupList from "../components/meetups/MeetupList";

function AllMeetupsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedMeetups, setLoadedMeetups] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    
    // Using relative URL that will be handled by Nginx proxy
    fetch("/api/meetups")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // MongoDB data already has the required structure with _id
        const meetups = data.map(meetup => ({
          id: meetup._id,  // Map MongoDB _id to id for frontend compatibility
          ...meetup
        }));
        
        setIsLoading(false);
        setLoadedMeetups(meetups);
      })
      .catch((error) => {
        console.error("Error fetching meetups:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section>
      <h1>All Meetups</h1>
      <MeetupList meetups={loadedMeetups} />
    </section>
  );
}

export default AllMeetupsPage;
