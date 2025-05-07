import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaEdit, FaKey, FaRocket } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        className="text-white text-center py-5"
        style={{ backgroundColor: '#212A31', marginTop: '62px' }}
        data-aos="fade-down"
      >
        <Container>
          <h1 className="display-4 fw-bold">About GitCollab</h1>
          <p className="lead mt-3">
            A seamless platform for mentorship, collaboration, and file editing—all in your browser.
          </p>
          <Button
            variant="outline-light"
            size="lg"
            className="mt-4 px-4 py-2 rounded-pill fw-semibold shadow-sm hover-effect"
            onClick={() => navigate('/')}
          >
            Home
          </Button>
        </Container>
      </section>

      {/* About & Security Section */}
      <section className="container mt-5 text-dark" data-aos="fade-up">
        <Row>
          <Col md={6} className="mb-4">
            <Card className="h-100 shadow border-0 rounded-4 p-4">
              <h3 className="fw-bold mb-3">What We Do</h3>
              <p>
                MentorCollab empowers individuals and teams by providing smart mentor matching,
                collaborative file editing, and real-time feedback—all without needing local setups.
              </p>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="h-100 shadow border-0 rounded-4 p-4">
              <h3 className="fw-bold mb-3">🔒 Security First</h3>
              <p>
                We store tokens only in your browser session. All file operations use secure API calls,
                ensuring your data and credentials never leave your device.
              </p>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Features Grid */}
      <section className="py-5 bg-light" data-aos="fade-up">
        <Container>
          <Row className="justify-content-center g-4">
            <Col xs={12} md={4} data-aos="fade-right">
              <Card className="h-100 shadow border-0 text-center p-4 rounded-4">
                <FaEdit size={40} className="text-primary mb-3" />
                <h5 className="fw-bold">Collaborative Editing</h5>
                <p>Edit and review files in real time with your team.</p>
              </Card>
            </Col>
            <Col xs={12} md={4} data-aos="fade-up">
              <Card className="h-100 shadow border-0 text-center p-4 rounded-4">
                <FaKey size={40} className="text-warning mb-3" />
                <h5 className="fw-bold">Secure Token Handling</h5>
                <p>Your PAT stays local—never sent to our servers.</p>
              </Card>
            </Col>
            <Col xs={12} md={4} data-aos="fade-left">
              <Card className="h-100 shadow border-0 text-center p-4 rounded-4">
                <FaRocket size={40} className="text-success mb-3" />
                <h5 className="fw-bold">One-Click Commit</h5>
                <p>Push changes back to GitHub instantly with version control.</p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-5 text-center" data-aos="fade-up">
        <Container>
          <h2 className="mb-5 fw-bold">How It Works</h2>
          <Row className="g-4">
            {[
              { step: 1, title: 'Enter Token', desc: 'Provide your GitHub Personal Access Token safely.' },
              { step: 2, title: 'Select Repo & File', desc: 'Enter the repo path and filename.' },
              { step: 3, title: 'Edit', desc: 'Use our in-browser editor with syntax highlighting.' },
              { step: 4, title: 'Commit', desc: 'Save back to GitHub with one click.' },
            ].map(({ step, title, desc }) => (
              <Col key={step} md={3} data-aos="zoom-in" data-aos-delay={step * 100}>
                <Card body className="rounded-3 shadow-sm h-100">
                  <div className="circle bg-dark text-white rounded-circle mb-3 p-3 d-inline-block">
                    {step}
                  </div>
                  <h5 className="fw-bold">{title}</h5>
                  <p>{desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section
        className="pt-3 text-white text-center"
        style={{ backgroundColor: '#212A31' }}
        data-aos="fade-up"
      >
        <Container className='py-3'>
          <h2 className="fw-bold mb-3">Ready to Collaborate?</h2>
          <Button
            variant="outline-light"
            className="px-4 py-2 rounded-pill fw-semibold shadow-sm"
            onClick={() => navigate('/register')}
          >
            Join Now
          </Button>
        </Container>
      </section>

      {/* Footer */}
      <footer className="text-center py-3 text-muted bg-light">
        <Container>
          <hr />
          <p className="mb-0">© 2025 MentorCollab. All rights reserved.</p>
          <p className="small mb-0">Contact: panwarritu245@gmail.com || mahaksinghkhan@gmail.com</p>
        </Container>
      </footer>
    </>
  );
};

export default AboutPage;
