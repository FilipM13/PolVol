import React, { useState } from "react";
import { API_ROOT } from "../../apiConfig";
import Form from "../shared/Form";
import H from "../shared/H";
import Error from "../shared/Error";
import Success from "../shared/Success";
import Button from "../shared/Button";
import Loading from "../shared/Loading";

const initialState = {
  first_name: "",
  middle_name: "",
  last_name: "",
  picture: null,
};

export default function CreatePerson() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // Prepare payload
    const payload = { ...form };
    payload.picture = null;
    console.log(form);
    try {
      const res = await fetch(`${API_ROOT}/persons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      if (form.picture) {
        var data = await res.json();
        const formData = new FormData();
        formData.append("file", form.picture);
        const res_pic = await fetch(
          `${API_ROOT}/persons/picture_upload/${data.id}`,
          {
            method: "POST",
            body: formData,
          },
        );
        if (!res_pic.ok) throw new Error(await res_pic.text());
      }
      setSuccess("Person created successfully!");
      setForm(initialState);
    } catch (err) {
      setError(err.message || "Failed to create person");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <H>Create Person</H>
        <input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          placeholder="First Name"
          required
          style={{
            padding: "0.7rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "1px solid #e0d7fa",
            fontSize: "1.1rem",
          }}
        />
        <input
          name="middle_name"
          value={form.middle_name}
          onChange={handleChange}
          placeholder="Middle Name"
          style={{
            padding: "0.7rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "1px solid #e0d7fa",
            fontSize: "1.1rem",
          }}
        />
        <input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          required
          style={{
            padding: "0.7rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "1px solid #e0d7fa",
            fontSize: "1.1rem",
          }}
        />
        <input
          type="file"
          name="picture"
          accept="image/png"
          onChange={(e) => setForm({ ...form, picture: e.target.files[0] })}
          style={{
            padding: "0.7rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "1px solid #e0d7fa",
            fontSize: "1.1rem",
          }}
        />
        <Button type="submit">Create</Button>
      </Form>
      {error && <Error message={error} />}
      {success && <Success message={success} />}
    </>
  );
}
