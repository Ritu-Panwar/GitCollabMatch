import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaUniversity, FaEnvelope, FaGithub } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const form = {
      access_key: 'b0bdf867-2ee4-4d40-8162-b901e08d0bd3', // Replace with your actual Web3Forms access key
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="text-white text-center py-5"
        style={{ backgroundColor: '#212A31', marginTop: '62px' }}
        data-aos="fade-down"
      >
        <Container>
          <h1 className="display-4 fw-bold">Get in Touch</h1>
          <p className="lead mt-3">Have questions or feedback? —let's connect!</p>
        </Container>
      </section>

      {/* Contact Info Section */}
      <section className="py-5 bg-light" data-aos="fade-up">
        <Container>
          <Row className="justify-content-center g-4">
            <Col xs={12} md={4} data-aos="fade-right">
              <Card className="h-100 text-center p-4 shadow border-0 rounded-4">
                <FaUniversity size={40} className="text-primary mb-3" />
                <h5 className="fw-bold">University</h5>
                <p>Kuk University, Information Technology Department</p>
              </Card>
            </Col>
            <Col xs={12} md={4} data-aos="fade-up">
              <Card className="h-100 text-center p-4 shadow border-0 rounded-4">
                <FaEnvelope size={40} className="text-primary mb-3" />
                <h5 className="fw-bold">Email</h5>
                <p>panwarritu245@gmail.com || mahaksinghkhan@gmail.com</p>
              </Card>
            </Col>
            <Col xs={12} md={4} data-aos="fade-left">
              <Card className="h-100 text-center p-4 shadow border-0 rounded-4">
                <FaGithub size={40} className="text-primary mb-3" />
                <h5 className="fw-bold">GitHub</h5>
                <p>
                  <a href="https://github.com/Ritu-Panwar" target="_blank" rel="noopener noreferrer">
                    github.com/Ritu-Panwar
                  </a>
                  <br />
                  <a href="https://github.com/Mahak-Khan" target="_blank" rel="noopener noreferrer">
                    github.com/Mahak-Khan
                  </a>
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Form */}
      <section className="py-5" data-aos="fade-up">
        <Container style={{ maxWidth: '600px' }}>
          <h2 className="text-center mb-4">Send Me a Message</h2>
          {status === 'success' && <Alert variant="success">Your message has been sent!</Alert>}
          {status === 'error' && <Alert variant="danger">Failed to send message. Please try again.</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="contactName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="contactEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="contactMessage" className="mb-4">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="message"
                placeholder="Your message..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <div className="text-center">
              <Button variant="primary" type="submit" className="px-5 rounded-pill fw-semibold">
                Submit
              </Button>
            </div>
          </Form>
        </Container>
      </section>

      {/* Footer */}
      <footer className="text-center py-3 text-muted bg-light">
        <Container>
          <hr />
          <p className="mb-0">© 2025 MentorCollab. All rights reserved.</p>
          <p className="small mb-0">
            Connect: panwarritu245@gmail.com || mahaksinghkhan@gmail.com
          </p>
        </Container>
      </footer>
    </>
  );
};

export default ContactPage;