import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [uploads, setUploads] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  



  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/admin-login');

    axios.get('/api/auth/profile', { headers: { Authorization: token } })
      .then(res => setMessage(res.data.msg))
      .catch(() => navigate('/admin-login'));

    axios.get('/api/upload', { headers: { Authorization: token } })
      .then(res => setUploads(res.data))
      .catch(err => console.error(err));
  }, [navigate]);
  <option value="Certificate">Certificate</option>
  const certificateUploads = uploads?.filter(file => file.type === 'Certificate');
  // 🔄 Reset to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchTerm]);


  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('type', type);

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Authorization': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('✅ Upload successful');
      console.log(res.data);

      // ⏬ Update list immediately
      setUploads([res.data.upload, ...uploads]);
      setTitle('');
      setType('');
      setFile(null);
      setPreview(null);
    } catch (err) {
      alert('❌ Upload failed');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this file?");
    if (!confirm) return;

    const token = localStorage.getItem('token');

    try {
      await axios.delete(`/api/upload/${id}`, {
        headers: { Authorization: token }
      });

      setUploads(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      alert('❌ Delete failed');
      console.error(err.response?.data || err.message);
    }
  };


  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <p>{message}</p>

      <hr />
      <h4>Upload Poster, Video, or Document</h4>

      <form onSubmit={handleUpload}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          className="form-select mb-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="">Select File Type</option>
          <option value="Poster">Poster</option>
          <option value="Video">Video</option>
          <option value="Document">Document</option>
          <option value="PDF">PDF</option>
          <option value="Certificate">Certificate</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="file"
          className="form-control mb-2"
          accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
          onChange={handleFileChange}
          required
        />

        {preview && (
          file?.type?.startsWith('image') ? (
            <img src={preview} alt="preview" width="300" className="mb-3" />
          ) : file?.type?.startsWith('video') ? (
            <video src={preview} width="300" controls className="mb-3" />
          ) : (
            <p className="text-muted mb-3">📄 {file.name} selected</p>
          )
        )}

        <button type="submit" className="btn btn-success">Upload</button>
      </form>

      <hr />
      <h4>Uploaded Files</h4>

      {/* Search bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter dropdown */}
      <div className="mb-3">
        <label>Filter by Type:</label>
        <select
          className="form-select w-auto d-inline-block ms-2"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Poster">Poster</option>
          <option value="Video">Video</option>
          <option value="Document">Document</option>
          <option value="PDF">PDF</option>
          <option value="Certificate">Certificate</option> {/* ✅ */}
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Pagination Logic */}
      {(() => {
        const filteredUploads = uploads.filter(upload =>
          (filterType === 'All' || upload.type === filterType) &&
          upload.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const totalPages = Math.ceil(filteredUploads.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const currentItems = filteredUploads.slice(startIndex, startIndex + itemsPerPage);

        return (
          <>
            {/* File Table */}
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Preview / Link</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(upload => (
                  <tr key={upload._id}>
                    <td>{upload.title}</td>
                    <td>{upload.type}</td>
                    <td>
                      {upload.filename.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <img src={`/uploads/${upload.filename}`} alt="preview" width="100" />
                      ) : upload.filename.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video src={`/uploads/${upload.filename}`} width="150" controls />
                      ) : (
                        <a href={`/uploads/${upload.filename}`} target="_blank" rel="noreferrer">
                          📄 Open Document
                        </a>
                      )}

                      {/* ✅ Add download button */}
                      <br />
                      <a
                        href={`/uploads/${upload.filename}`}
                        download
                        className="btn btn-sm btn-outline-primary mt-2"
                      >
                        ⬇ Download
                      </a>
                    </td>

                    <td>{new Date(upload.createdAt).toLocaleString()}</td>

                    {/* ✅ Add this here */}
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(upload._id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button
                className="btn btn-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                ◀ Previous
              </button>

              <span>Page {currentPage} of {totalPages}</span>

              <button
                className="btn btn-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next ▶
              </button>
            </div>
          </>
        );
      })()}
    </div>
  );

};

export default AdminDashboard;
