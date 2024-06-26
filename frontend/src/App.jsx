import "./App.css";
import { useState, useEffect, useRef } from "react";
import Album from "./Album";
import ReCAPTCHA from "react-google-recaptcha";

function App() {
  const [inputs, setInputs] = useState({});
  const [albums, setAlbums] = useState([]);
  const [album, setAlbum] = useState([]);

  const fileInput = useRef(null); // 1. this will hold a reference to our file input!

  const reCaptcha = useRef(null);

  useEffect(() => {
    getAlbums();
  }, [album]);

  async function getAlbums() {
    const response = await fetch(`${import.meta.env.VITE_API}/albums`, {
      method: "GET",
    });
    if (response.ok) {
      const data = await response.json();
      setAlbums(data);
    }
  }

  function handleChange(e) {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let reCaptchaValue = reCaptcha.current.getValue();

    if (!reCaptchaValue) {
      alert("Please confirm you are not a robot.");
      return;
    } else {
      const formData = new FormData();
      formData.append("title", inputs.title);
      formData.append("year", inputs.year);
      formData.append("artist", inputs.artist);
      formData.append("jacket", inputs.jacket);
      formData.append("reCaptchaValue", reCaptchaValue);

      setInputs({});
      fileInput.current.value = ""; // 3. this resets the file input value :)

      try {
        const response = await fetch(`${import.meta.env.VITE_API}/add`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setAlbum(data);
          alert(`added!`);
        } else throw new Error("something went wrong...");
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
      alert("form submitted");
      console.log ("este es el valor de recaptcha", reCaptcha.current.getValue());
    }

    reCaptchaValue = reCaptcha.current.reset();
    // console.log ("captcha reset", reCaptcha.current.getValue());
  }
  // function onRecaptchaChange(value) {
  //   console.log("Captcha value:", value);
  // }

  return (
    <>
      <h1>My Favorites</h1>
      <form 
      onSubmit={handleSubmit} 
      className="form"
      style={{display: "flex", flexDirection: "column", padding: "1rem", gap: ".8rem"}}>
        <input
          type="text"
          placeholder="artist"
          onChange={handleChange}
          value={inputs.artist || ""}
          name="artist"
        />
        <input
          type="text"
          placeholder="title"
          onChange={handleChange}
          value={inputs.title || ""}
          name="title"
        />
        <input
          type="text"
          placeholder="year"
          onChange={handleChange}
          value={inputs.year || ""}
          name="year"
        />
        <input
          type="file"
          ref={fileInput} // 2. this sets the reference to file input
          onChange={(e) => setInputs({ ...inputs, jacket: e.target.files[0] })}
          accept="image/*"
        />
        <button>Add</button>
        <ReCAPTCHA sitekey={import.meta.env.VITE_SITE} style={{display:"flex", justify: "center", alignContent: "center"}}  // this is our site key from .env file
        
        ref={reCaptcha}
        theme="dark" />
      </form>
      {!!albums.length &&
        albums.map((album) => (
          <Album
            key={album._id}
            album={album}
            getAlbums={getAlbums}
            inputs={inputs}
            setInputs={setInputs}
            setAlbum={setAlbum}
          />
        ))}
    </>
  );
}

export default App;
