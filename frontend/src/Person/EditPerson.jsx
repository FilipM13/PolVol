import React, { useState, useEffect } from "react";
import { API_ROOT } from "../../apiConfig";
import H from "../shared/H";
import Form from "../shared/Form";
import Error from "../shared/Error";
import Success from "../shared/Success";
import Button from "../shared/Button";
import Loading from "../shared/Loading";

export default function EditPerson({ personId }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchPerson() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_ROOT}/persons/${personId}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setForm({
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          description_md: data.description_md,
          date_of_birth: data.date_of_birth,
        });
      } catch (err) {
        setError(err.message || "Failed to fetch person");
      } finally {
        setLoading(false);
      }
    }
    fetchPerson();
  }, [personId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const payload = { ...form };
    try {
      const res = await fetch(`${API_ROOT}/persons/${personId}`, {
        method: "PUT",
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
      setSuccess("Person updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update person");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!form) return null;

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <H>Edit Person</H>
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
          name="date_of_birth"
          value={form.date_of_birth}
          onChange={handleChange}
          type="date"
          placeholder="Date of Birth"
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
          name="description_md"
          value={form.description_md}
          onChange={handleChange}
          placeholder="Description"
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
        <Button type="submit">Update</Button>
      </Form>
      {error && <Error message={error} />}
      {success && <Success message={success} />}
    </>
  );
}
