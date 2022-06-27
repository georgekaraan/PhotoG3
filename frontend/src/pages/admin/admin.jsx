//Admin page logic and ui
import { useState } from "react";
import ImagesService from "../../services/ImagesService";
import "./admin.css";
const Admin = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [path, setPath] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [jsonData, setJsonData] = useState("");

  const [password, setPassword] = useState(
    localStorage.getItem("password") ?? ""
  );
  const ready = () => {
    if (jsonData) {
      try {
        const data = JSON.parse(jsonData);
        if (Array.isArray(data)) {
          const promises = data.map(
            async ({ name, description, image, attributes = [] }) => {
              try {
                const result = await ImagesService.AddImage({
                  name,
                  description,
                  image,
                  attributes,
                  password,
                });
                if (result?.error) {
                  throw new Error(result.error);
                }
                return result;
              } catch (er) {
                alert("Error happened with " + name + " image " + image);
              }
            }
          );
          Promise.all(promises)
            .then(() => alert("All have been uploaded correctly"))
            .catch((el) => {
              console.log(el);
            });
        } else {
          const { name, description, image, attributes = [] } = data;
          ImagesService.AddImage({
            name,
            description,
            image,
            attributes,
            password,
          }).then((el) => alert(JSON.stringify(el)));
        }
      } catch (error) {
        alert("There is an error with the pasted JSON");
      }
      return;
    }

    ImagesService.AddImage({
      name,
      description,
      image: path,
      attributes,
      password,
    })
      .then(({ error }) => (error ? alert(error) : alert("Succsesful")))
      .catch((err) => console.log(err));
  };

  return (
    <section id="admin-page">
      <img src={path} alt="Image will be displayed here" />
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        placeholder="name"
        value={name}
      />
      <input
        type="text"
        onChange={(e) => setDescription(e.target.value)}
        placeholder="description"
        value={description}
      />
      <input
        type="text"
        onChange={(e) => setPath(e.target.value)}
        placeholder="path"
        value={path}
      />
      <h3>Attibutes</h3>
      {attributes.map((el, i) => {
        const copy = i;
        return (
          <div key={copy}>
            <input
              type="text"
              value={el.trait_type}
              onChange={(e) => {
                attributes[copy].trait_type = e.target.value;
                setAttributes([...attributes]);
              }}
            />
            <input
              type="text"
              value={el.value}
              onChange={(e) => {
                attributes[copy].value = e.target.value;
                setAttributes([...attributes]);
              }}
            />
          </div>
        );
      })}
      <div className="controls">
        <button
          onClick={() =>
            setAttributes([
              ...attributes,
              { trait_type: "your key", value: "value" },
            ])
          }
        >
          Add new attribute
        </button>
        <button onClick={() => setAttributes([])}>Clear</button>
      </div>

      <label>
        Password for loading must be .env file in backend
        <br />
        <input
          type="text"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            localStorage.setItem("password", e.target.value);
          }}
          placeholder="password"
        />
      </label>

      <textarea
        placeholder="Place json here if there is any"
        value={jsonData}
        onChange={(e) => setJsonData(e.target.value)}
      ></textarea>
      <button className="ready-btn" onClick={ready}>
        Ready
      </button>
    </section>
  );
};

export default Admin;
