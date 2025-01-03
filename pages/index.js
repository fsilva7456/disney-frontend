import { useState } from "react";

export default function Home() {
  // State variables for form inputs
  const [travelDates, setTravelDates] = useState("");
  const [numberOfAdults, setNumberOfAdults] = useState(2);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState("");
  const [preferences, setPreferences] = useState("");

  // State variable for the result
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Your FastAPI endpoint (replace with your actual Railway URL)
  const BACKEND_URL = "https://my-railway-app.up.railway.app"; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setItinerary("");

    // Convert comma-separated ages into an array of ints
    let childrenAgesArray: number[] = [];
    if (childrenAges.trim().length > 0) {
      childrenAgesArray = childrenAges
        .split(",")
        .map((age) => parseInt(age.trim(), 10))
        .filter((num) => !isNaN(num));
    }

    // Build the request body
    const requestBody = {
      travel_dates: travelDates,
      number_of_adults: numberOfAdults,
      number_of_children: numberOfChildren,
      children_ages: childrenAgesArray,
      preferences: preferences,
    };

    try {
      const response = await fetch(`${BACKEND_URL}/generate-itinerary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      setItinerary(data.itinerary_text || "No itinerary text returned.");
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <h1>Disney Trip Planner</h1>
      <p>Enter your trip details to generate an AI-powered itinerary.</p>

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="travelDates">Travel Dates:</label><br />
          <input
            id="travelDates"
            type="text"
            value={travelDates}
            onChange={(e) => setTravelDates(e.target.value)}
            placeholder="e.g. June 14 - June 17"
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="adults">Number of Adults:</label><br />
          <input
            id="adults"
            type="number"
            value={numberOfAdults}
            onChange={(e) => setNumberOfAdults(Number(e.target.value))}
            min={1}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="children">Number of Children:</label><br />
          <input
            id="children"
            type="number"
            value={numberOfChildren}
            onChange={(e) => setNumberOfChildren(Number(e.target.value))}
            min={0}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="childrenAges">Children Ages (comma-separated):</label><br />
          <input
            id="childrenAges"
            type="text"
            value={childrenAges}
            onChange={(e) => setChildrenAges(e.target.value)}
            placeholder="e.g. 5, 9"
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="preferences">Preferences:</label><br />
          <textarea
            id="preferences"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g. Minimize wait times, loves princesses, etc."
            rows={3}
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>
      </form>

      {errorMessage && (
        <p style={{ color: "red", marginTop: "1rem" }}>
          Error: {errorMessage}
        </p>
      )}

      {itinerary && (
        <div style={{ marginTop: "2rem", whiteSpace: "pre-wrap" }}>
          <h2>Your Itinerary</h2>
          <p>{itinerary}</p>
        </div>
      )}
    </div>
  );
}
