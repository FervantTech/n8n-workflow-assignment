import "./App.css";
import { useState } from "react";

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const feedback = {
      studentName: formData.get("studentName").trim(),
      email: formData.get("email").trim(),
      courseName: formData.get("courseName").trim(),
      rating: Number(formData.get("rating")),
      feedbackMessage: formData.get("feedbackMessage").trim(),
    };

    setMessage("");
    setIsError(false);

    if (
      !feedback.studentName ||
      !feedback.email ||
      !feedback.courseName ||
      !feedback.feedbackMessage ||
      !Number.isInteger(feedback.rating) ||
      feedback.rating < 1 ||
      feedback.rating > 5
    ) {
      setIsError(true);
      setMessage("Please complete all fields and choose a rating from 1 to 5.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://fervanttech.app.n8n.cloud/webhook/student-feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(feedback),
        },
      );

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Could not submit your feedback.");
      }

      setMessage(result.message);
      form.reset();
    } catch (error) {
      setIsError(true);
      setMessage(
        "We couldn't confirm your submission. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <main className="page">
      <section className="feedback-card">
        <h1>Course Feedback</h1>
        <p>Tell us about your learning experience.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="studentName">Student Name</label>
          <input
            id="studentName"
            name="studentName"
            type="text"
            autoComplete="name"
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />

          <label htmlFor="courseName">Course Name</label>
          <input id="courseName" name="courseName" type="text" required />

          <label htmlFor="rating">Rating</label>
          <select id="rating" name="rating" defaultValue="" required>
            <option value="" disabled>
              Choose a rating
            </option>
            <option value="1">1 — Very dissatisfied</option>
            <option value="2">2 — Dissatisfied</option>
            <option value="3">3 — Neutral</option>
            <option value="4">4 — Satisfied</option>
            <option value="5">5 — Very satisfied</option>
          </select>

          <label htmlFor="feedbackMessage">Feedback Message</label>
          <textarea
            id="feedbackMessage"
            name="feedbackMessage"
            rows={5}
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Submit Feedback"}
          </button>
          {message && (
            <p
              className={isError ? "message error" : "message success"}
              role={isError ? "alert" : "status"}
            >
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

export default App;
