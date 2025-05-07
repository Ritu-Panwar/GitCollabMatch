import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaUserFriends, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="text-white text-center py-5" style={{ backgroundColor: '#212A31', marginTop: "62px" }} data-aos="fade-down">
        <Container>
          <h1 className="display-4 fw-bold">Empowering Growth Through Mentorship & Collaboration</h1>
          <p className="lead mt-3">Connect. Collaborate. Create. Our platform helps mentors guide minds, and teammates edit files seamlessly.</p>
          <Button
            variant="outline-light"
            size="lg"
            className="mt-4 px-4 py-2 rounded-pill fw-semibold shadow-sm hover-effect"
            onClick={() => navigate('/match')}
          >
            Get Started
          </Button>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5" style={{ backgroundColor: '#f4f7f9' }}>
        <Container style={{ maxWidth: '2000px' }}>
          <Row className="justify-content-center g-4">
            <Col xs={12} md={6} lg={5} data-aos="fade-right">
              <Card className="h-100 shadow border-0 text-center p-4 rounded-4">
                <FaUserFriends size={50} className="text-primary mb-3" />
                <h4 className="fw-bold">Smart Mentor Matching</h4>
                <p>AI-driven matching connects you to mentors or mentees based on real-world compatibility.</p>
                <Button
                  variant="primary"
                  className="rounded-pill px-4 fw-medium shadow-sm hover-effect"
                  onClick={() => navigate('/match')}
                >
                  Explore Matching
                </Button>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={5} data-aos="fade-left" data-aos-delay="100">
              <Card className="h-100 shadow border-0 text-center p-4 rounded-4">
                <FaFileAlt size={50} className="text-primary mb-3" />
                <h4 className="fw-bold">Collaborative File Editing</h4>
                <p>Edit, comment, and collaborate on files in real-time — boosting team productivity.</p>
                <Button
                  variant="primary"
                  className="rounded-pill px-4 fw-medium shadow-sm hover-effect"
                  onClick={() => navigate('/edit')}
                >
                  Start Editing
                </Button>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-5 text-center bg-white" data-aos="fade-up">
        <Container>
          <h2 className="mb-5 fw-bold">How It Works</h2>
          <Row className="g-4">
            <Col md={3} data-aos="zoom-in-up">
              <Card body className="rounded-3 shadow-sm h-100">
                <h5 className="fw-bold">1. Create Profile</h5>
                <p>Set your preferences and goals for effective mentorship or teamwork.</p>
              </Card>
            </Col>
            <Col md={3} data-aos="zoom-in-up" data-aos-delay="100">
              <Card body className="rounded-3 shadow-sm h-100">
                <h5 className="fw-bold">2. Get Matched</h5>
                <p>Find your perfect mentor or teammate using our smart matching system.</p>
              </Card>
            </Col>
            <Col md={3} data-aos="zoom-in-up" data-aos-delay="200">
              <Card body className="rounded-3 shadow-sm h-100">
                <h5 className="fw-bold">3. Collaborate</h5>
                <p>Co-edit documents, give feedback, and work in real-time.</p>
              </Card>
            </Col>
            <Col md={3} data-aos="zoom-in-up" data-aos-delay="300">
              <Card body className="rounded-3 shadow-sm h-100">
                <h5 className="fw-bold">4. Track Growth</h5>
                <p>Stay aligned with shared goals and performance tracking tools.</p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-light py-5 text-center" data-aos="flip-left">
        <Container>
          <h2 className="mb-4 fw-bold">What Our Users Say</h2>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="p-4 shadow-sm border-0 rounded-3">
                <p className="fst-italic">"This platform matched me with a mentor who truly transformed my career path."</p>
                <b>- ritu S., Software Developer</b>
              </Card>
            </Col>
          </Row>
          
        </Container>
      </section>

      <section className="pt-2 text-white text-center" style={{ backgroundColor: '#212A31' }} data-aos="flip-up">
        <Container>
          <h2 className="fw-bold" style={{ color: '#ECF0F1' }}>Start Your Growth Journey Today</h2>
          <Button
            variant="outline-light"
            className="mt-3 px-4 py-2 rounded-pill fw-semibold shadow-sm no-hover"
            style={{ borderColor: '#ECF0F1', color: '#ECF0F1' }} // Lighter color for better contrast
            onClick={() => navigate('/register')}
          >
            Join Now
          </Button>
        </Container>
      </section>

      {/* Footer */}
      <footer className="text-white text-center py-3" style={{ backgroundColor: '#212A31' }}>

        <hr style={{ height: '4px' }} />
        <Container>
          <p className="mb-0" style={{ color: '#BDC3C7' }}>&copy; 2025 MentorCollab. All rights reserved.</p>
          <p className="small" style={{ color: '#BDC3C7' }}>Contact: panwarritu245@gmail.com || mahaksinghkhan@gmail.com</p>
        </Container>
      </footer>


    </>
  );
};

export default HomePage;
