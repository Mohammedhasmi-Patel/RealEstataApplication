import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const preset = import.meta.env.VITE_REACT_APP_PRESET;
  const CLOUDINARY_URI = import.meta.env.VITE_REACT_APP_CLOUDINARY_URL;

  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);

  const [formData, setFormData] = useState({
    username: currentUser.username || "",
    email: currentUser.email || "",
    password: "",
    avatar: currentUser.avatar || "",
  });

  const dispatch = useDispatch();
  const naviagte = useNavigate();
  console.log(userListing);

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

  // form submit for update api
  async function handleUpdateUser(e) {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  // function for deleting the user
  async function handleDeleteUser() {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
      naviagte("/sign-in");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  async function handleSignOut() {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data));
      naviagte("/sign-in");
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  // function for handling listing views

  async function handleShowListing() {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      // if everything is okay then just set the data
      setUserListing(data);
    } catch (error) {
      setShowListingError(true);
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center my-7">Profile</h1>

      <form onSubmit={handleUpdateUser} className="flex flex-col gap-4">
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
          onChange={handleInputChange}
          value={formData.password}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-600 uppercase text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading" : "Update"}
        </button>

        <Link
          className="bg-green-600 p-3 rounded-lg text-center text-white uppercase hover:opacity-95 "
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-500 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-500 cursor-pointer">
          Sign out
        </span>
      </div>

      <p className="text-red-500 ">{error ? error : ""}</p>
      <p className="text-green-500">
        {updateSuccess ? "user updated successfully" : ""}
      </p>
      <button onClick={handleShowListing} className="text-green-600 w-full">
        Show Listing
      </button>
      <p>{showListingError && "error in showlistings"}</p>

      <p>
        {userListing && userListing.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-3xl font-semibold">
              Your Listings
            </h1>
            {userListing.map((listing) => (
              <div
                className="border p-3 rounded-lg flex justify-between items-center gap-4"
                key={listing._id}
              >
                <Link to={`listings/${listing._id}`}>
                  <img
                    className="h-16 w-16 object-contain rounded-lg"
                    src={`${listing.imageUrls[0]}`}
                    alt="listing covers"
                  />
                </Link>
                <Link
                  className="text-slate-700 font-semibold flex-1 hover:underline "
                  to={`listings/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col items-center">
                  <button className="text-red-600 uppercase">Delete</button>
                  <button className="text-green-600 uppercase">Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </p>
    </div>
  );
}
