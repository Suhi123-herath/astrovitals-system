
import { useRef, useState } from 'react';

export default function ProfilePhoto({ name = 'Astronaut', size = 100 }) {
  const [photo, setPhoto] = useState(
    () => localStorage.getItem('astrovitals.profilePhoto') || ''
  );

  const inputRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Please select an image smaller than 2 MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = reader.result;
      try {
        localStorage.setItem('astrovitals.profilePhoto', image);
        setPhoto(image);
      } catch {
        alert('Unable to save this image. Try a smaller photo.');
      }
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removePhoto = () => {
    localStorage.removeItem('astrovitals.profilePhoto');
    setPhoto('');
  };

  return (
    <div className="profile-photo-wrapper">
      <button
        type="button"
        className="profile-photo"
        style={{ width: size, height: size }}
        onClick={() => inputRef.current?.click()}
        aria-label="Upload profile photo"
      >
        {photo ? (
          <img src={photo} alt="Profile" />
        ) : (
          <span className="profile-default-icon">👨‍🚀</span>
        )}
        <span className="profile-camera">📷</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleUpload}
      />

      {photo && (
        <button
          type="button"
          className="profile-remove"
          onClick={removePhoto}
        >
          Remove photo
        </button>
      )}
    </div>
  );
}
