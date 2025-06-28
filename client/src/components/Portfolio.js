import React, { useRef, useEffect, useState } from 'react';
import './Portfolio.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import htmlDocx from 'html-docx-js/dist/html-docx';
import html2pdf from 'html2pdf.js';
import axios from 'axios';

// ...[imports stay the same]...

const Portfolio = () => {
    const componentRef = useRef();
    const [darkMode, setDarkMode] = useState(false);
    const [certificates, setCertificates] = useState([]);
    const [previewCert, setPreviewCert] = useState(null);

    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const certificateFiles = certificates.filter(file => file.type === 'Certificate');
    const otherFiles = certificates.filter(file => file.type !== 'Certificate');

    const totalPages = Math.ceil(certificateFiles.length / itemsPerPage);
    const paginatedCertificates = certificateFiles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        AOS.init({ duration: 1000 });
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const res = await axios.get('/api/upload');
            setCertificates(res.data);
        } catch (err) {
            console.error('❌ Failed to fetch certificates:', err);
        }
    };

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const handleAutoDownloadPDF = () => {
        const element = componentRef.current;
        html2pdf().set({
            margin: 0.5,
            filename: 'Kotha_Dinesh_Venkata_Gopi_Sai_Resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }).from(element).save();
    };

    const handleDownloadDocx = () => {
        const content = componentRef.current.innerHTML;
        const converted = htmlDocx.asBlob(content);
        const url = window.URL.createObjectURL(converted);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Kotha_Dinesh_Resume.docx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className={`container mt-4 portfolio ${darkMode ? 'dark-mode' : ''}`}>
            <div ref={componentRef} className="bg-glass p-4 rounded shadow mb-4 animated-border">
                <div className="text-center mb-4" data-aos="fade-down">
                    <img
                        src="/images/profile.png"
                        alt="Profile"
                        className="rounded-circle shadow-lg animate-float"
                        style={{
                            width: '150px',
                            height: '150px',
                            objectFit: 'cover',
                            border: '4px solid #3f51b5'
                        }}
                    />
                    <h1 className="mt-3 text-gradient">KOTHA DINESH VENKATA GOPI SAI</h1>
                    <p className={`contact-info ${darkMode ? 'text-light' : 'text-muted'}`}>
                        📧 2100030843cseh@gmail.com | 📞 +91-7286037358<br />
                        <a href="https://github.com/DINESH041103" target="_blank" rel="noreferrer">GitHub</a> |
                        <a href="https://www.linkedin.com/in/kotha-dinesh-venkata-gopi-sai-779742226/" target="_blank" rel="noreferrer"> LinkedIn</a>
                    </p>
                </div>

                <div className="section-card animate-slide-up" data-aos="fade-up">
                    <h3 className="section-title">🎯 Career Objective</h3>
                    <p>To contribute to an organization by leveraging my technical expertise and problem-solving skills in a global
                        recognized institution. Eager to drive innovation, support growth, and develop high-quality solutions across
                        Corporate and Institutional Banking, Investment Solutions, and Retail Banking. Committed to explore new things
                        in a collaborative setting while enhancing my knowledge and skills within an organization known for its
                        international reach and impact.</p>
                </div>

                <section className="section-card animate-slide-left">
                    <h3 className="section-title">🎓 Education</h3>
                    <ul>
                        <li>
                            <strong>Bachelor of Technology (B.Tech), Computer Science and Engineering</strong><br />
                            Koneru Lakshmaiah Education Foundation (KLU University), Green Fields, Vaddeswaram, Guntur, Andhra Pradesh – <em>CGPA: 9.23 (2021 – 2025)</em>
                        </li>
                        <li>
                            <strong>Intermediate (MPC), Board of Intermediate Education, Andhra Pradesh</strong><br />
                            Chaitanya IIT–NEET Academy, Nandigama, NTR District – <em>Marks: 921/1000</em>
                        </li>
                        <li>
                            <strong>Secondary School Certificate (SSC), Board of Secondary Education, Andhra Pradesh</strong><br />
                            Sri Chaitanya Techno School, Nandigama, NTR District – <em>GPA: 9.8</em>
                        </li>
                    </ul>
                </section>


                <section className="section-card animate-slide-right">
                    <h3 className="section-title">🧠 Skills</h3>
                    <ul>
                        <li>Languages: Java, Python, C, SQL, HTML</li>
                        <li>Technologies: Generative AI, ServiceNow</li>
                        <li>Soft Skills: : Communication, People Skills, Time Management, Collaboration</li>
                    </ul>
                </section>

                <section className="section-card animate-slide-up">
                    <h3 className="section-title">💼 Projects</h3>
                    <ul>
                        <li>
                            <strong>Intelligent Customer Support Chatbot</strong>
                            <ul>
                                <li>Developed an AI-powered chatbot for real-time customer issue resolution using fine-tuned LLMs on historical support data.</li>
                                <li>Built a responsive chat interface with automated escalation to human agents based on query complexity and intent analysis.</li>
                                <li>Enhanced response accuracy and reduced average resolution time through intelligent query handling and adaptive learning.</li>
                            </ul>
                        </li>

                        <li className="mt-3">
                            <strong>Interactive Developer Portfolio Website</strong>
                            <ul>
                                <li>Designed and built a responsive personal portfolio showcasing education, skills, certifications, and project highlights using React.</li>
                                <li>Implemented an admin-only upload system for certificates with real-time previews, type-based filtering (Certificate, Video, Document, etc.), and pagination.</li>
                                <li>Integrated RESTful APIs built with Node.js and MongoDB to dynamically manage and display uploaded content securely.</li>
                            </ul>
                        </li>
                    </ul>
                </section>


                {/* Certificates */}
                <section data-aos="fade-up-right" className="section-card">
                    <h3 className="section-title">📜 Certifications</h3>
                    <div className="row">
                        {paginatedCertificates.map((file, i) => (
                            <div key={file._id} className="col-md-4 mb-3" data-aos="zoom-in" data-aos-delay={i * 100}>
                                <div className="card h-100">
                                    <div className="card-body text-center">
                                        <h6 className="card-title">{file.title}</h6>
                                        {file.filename.match(/\.(png|jpg|jpeg)$/i) ? (
                                            <img
                                                src={`/uploads/${file.filename}`}
                                                alt={file.title}
                                                className="img-fluid rounded shadow-sm"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setPreviewCert(`/uploads/${file.filename}`)}
                                            />
                                        ) : (
                                            <a href={`/uploads/${file.filename}`} target="_blank" rel="noreferrer">
                                                📄 View Certificate
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-3">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`btn btn-sm mx-1 ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                {/* Social */}
                <section className="section-card animate-slide-left">
                    <h3 className="section-title">🤝 Social Engagement</h3>
                    <ul>
                        <li>
                            <strong>Hackathon Participant:</strong> Developed a real-time collaborative coding platform using React and Django during a 36-hour hackathon with a team of 4.
                        </li>
                        <li>
                            <strong>Learnathon Participant:</strong> Engaged in a 24-hour Learnathon focused on mastering full-stack development skills.
                        </li>
                        <li>
                            <strong>Event Organizer:</strong> Led the organization of <em>#include</em>, fostering peer collaboration, coding challenges, and hands-on learning experiences.
                        </li>
                    </ul>
                </section>


                {/* Other Files */}
                <section data-aos="fade-up" className="section-card">
                    <h3 className="section-title">📂 Files</h3>
                    <div className="row">
                        {otherFiles.length === 0 && <p className="text-muted">No other files uploaded.</p>}
                        {otherFiles.map((file, i) => (
                            <div key={file._id} className="col-md-4 mb-3" data-aos="fade-up" data-aos-delay={i * 100}>
                                <div className="card h-100">
                                    <div className="card-body text-center">
                                        <h6 className="card-title">{file.title}</h6>
                                        {file.filename.match(/\.(png|jpg|jpeg)$/i) ? (
                                            <img src={`/uploads/${file.filename}`} className="img-fluid rounded" alt={file.title} />
                                        ) : file.filename.match(/\.(mp4|webm)$/i) ? (
                                            <video src={`/uploads/${file.filename}`} width="100%" controls />
                                        ) : (
                                            <a href={`/uploads/${file.filename}`} target="_blank" rel="noreferrer">
                                                📄 View File
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="d-flex justify-content-center gap-3 mb-5 animate-fade-in">
                <button className="btn btn-gradient" onClick={handleAutoDownloadPDF}>⬇ Download PDF</button>
                <button className="btn btn-gradient-green" onClick={handleDownloadDocx}>📄 Download .DOCX</button>
                <button className="btn btn-outline-dark" onClick={toggleDarkMode}>
                    {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
                </button>
            </div>

            {previewCert && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Certificate Preview</h5>
                                <button type="button" className="btn-close" onClick={() => setPreviewCert(null)}></button>
                            </div>
                            <div className="modal-body text-center">
                                <img src={previewCert} alt="Preview" className="img-fluid" style={{ maxHeight: '70vh' }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Portfolio;
