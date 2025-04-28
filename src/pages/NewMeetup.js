import { useState } from "react";
import NewMeetupForm from "../components/meetups/NewMeetupForm";
import { useNavigate } from "react-router-dom";

function NewMeetupPage(){
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    function onAddMeetupHandler(meetupData){
        setIsSubmitting(true);
        setError(null);

        // Using relative URL that will be handled by Nginx proxy
        fetch('/api/meetups', {
            method: 'POST',
            body: JSON.stringify(meetupData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            setIsSubmitting(false);
            if (!response.ok) {
                throw new Error('Failed to create meetup');
            }
            return response.json();
        })
        .then(() => {
            navigate('/');
        })
        .catch(error => {
            setError(error.message || 'Something went wrong');
            setIsSubmitting(false);
        });
    }

    return (
        <section>
            <h1>Add New Meetup</h1>
            {error && <div className="error-message">{error}</div>}
            <NewMeetupForm 
                onAddMeetup={onAddMeetupHandler}
                disabled={isSubmitting}
            />
            {isSubmitting && <p>Submitting meetup data...</p>}
        </section>
    );
}

export default NewMeetupPage;