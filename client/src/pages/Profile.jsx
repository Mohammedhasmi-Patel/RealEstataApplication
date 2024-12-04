import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import axios from "axios"; // Import axios for handling uploads

export default function Profile() {
  const preset = import.meta.env.VITE_REACT_APP_PRESET;
  const CLOUDINARY_URI = import.meta.env.VITE_REACT_APP_CLOUDINARY_URL;

  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    username: currentUser.username || "",
    email: currentUser.email || "",
    password: "",
    avatar: currentUser.avatar || "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // File upload effect
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // File upload function using axios
  async function handleFileUpload(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", `${preset}`);

    try {
      // Use axios to upload with progress tracking
      const response = await axios.post(`${CLOUDINARY_URI}`, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total > 0) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`progress event is ${progress}`);
            setUploadProgress(progress); // Update the upload progress
          }
        },
      });

      if (response.status === 200) {
        setUploadProgress(100);
        setFormData((prevFormData) => ({
          ...prevFormData,
          avatar: response.data.secure_url,
        }));
      } else {
        throw new Error(response.data.error.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload Error:", error.message);
      setfileUploadError(true);
    }
  }

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4">
        <input
          onChange={handleFileChange}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || "defaultUserAvatar.png"}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        <p className="text-sm self-center">
          {fileUploadError ? (
            <p className="text-red-500">Upload failed. Try again.</p>
          ) : uploadProgress > 0 && uploadProgress < 100 ? (
            <span>{`Uploading ${uploadProgress}%`}</span>
          ) : uploadProgress === 100 ? (
            <span className="text-green-500">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="bg-slate-600 uppercase text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80"
        >
          Update
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-500 cursor-pointer">Delete account</span>
        <span className="text-red-500 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
