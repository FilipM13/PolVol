import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";
import CreatePerson from "./Person/CreatePerson.jsx";
import PersonList from "./Person/PersonList.jsx";
import EditPerson from "./Person/EditPerson.jsx";
import PersonDetails from "./Person/PersonDetails.jsx";
import CreateSpectrum from "./Spectrum/CreateSpectrum.jsx";
import EditSpectrum from "./Spectrum/EditSpectrum.jsx";
import SpectrumList from "./Spectrum/SpectrumList.jsx";
import SpectrumDetails from "./Spectrum/SpectrumDetails.jsx";
import CreateEvent from "./Event/CreateEvent.jsx";
import EditEvent from "./Event/EditEvent.jsx";
import EventList from "./Event/EventList.jsx";
import EventDetails from "./Event/EventDetails.jsx";
import Home from "./Home/Home.jsx";

import { useParams } from "react-router-dom";
import CreateStanceOnEvent from "./StanceOnEvent/CreateStanceOnEvent.jsx";
import EditStanceOnEvent from "./StanceOnEvent/EditStanceOnEvent.jsx";
import StanceOnEventList from "./StanceOnEvent/StanceOnEventList.jsx";
import StanceOnEventDetails from "./StanceOnEvent/StanceOnEventDetails.jsx";
import Login from "./User/Login.jsx";
import Register from "./User/Register.jsx";
import UserDetails from "./User/UserDetails.jsx";
import UserList from "./User/UserList.jsx";

import styles from "./App.module.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className={styles.appContainer}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user-details" element={<UserDetails />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-person" element={<CreatePerson />} />
          <Route path="/persons" element={<PersonList />} />
          <Route path="/edit-person/:id" element={<EditPersonWrapper />} />
          <Route path="/person/:id" element={<PersonDetailsWrapper />} />
          <Route path="/create-spectrum" element={<CreateSpectrum />} />
          <Route path="/spectra" element={<SpectrumList />} />
          <Route path="/edit-spectrum/:id" element={<EditSpectrumWrapper />} />
          <Route path="/spectrum/:id" element={<SpectrumDetailsWrapper />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/edit-event/:id" element={<EditEventWrapper />} />
          <Route path="/event/:id" element={<EventDetailsWrapper />} />
          <Route path="/create-stance" element={<CreateStanceOnEvent />} />
          <Route path="/stances" element={<StanceOnEventList />} />
          <Route
            path="/edit-stance/:id"
            element={<EditStanceOnEventWrapper />}
          />
          <Route path="/stance/:id" element={<StanceOnEventDetailsWrapper />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

function EditPersonWrapper() {
  const { id } = useParams();
  return <EditPerson personId={id} />;
}

function PersonDetailsWrapper() {
  const { id } = useParams();
  return <PersonDetails personId={id} />;
}

function EditSpectrumWrapper() {
  const { id } = useParams();
  return <EditSpectrum spectrumId={id} />;
}

function SpectrumDetailsWrapper() {
  const { id } = useParams();
  return <SpectrumDetails spectrumId={id} />;
}

function EditEventWrapper() {
  const { id } = useParams();
  return <EditEvent eventId={id} />;
}

function EventDetailsWrapper() {
  const { id } = useParams();
  return <EventDetails eventId={id} />;
}

function EditStanceOnEventWrapper() {
  const { id } = useParams();
  return <EditStanceOnEvent stanceId={id} />;
}

function StanceOnEventDetailsWrapper() {
  const { id } = useParams();
  return <StanceOnEventDetails stanceId={id} />;
}

export default App;
