import React from 'react';
import img1 from '../../images/img1.png';
import img2 from '../../images/img2.jpg';

const MatchingPage = () => {
  const startMentorScript = async () => {
    try {
      const res = await fetch('http://localhost:8000/start-mentor');
      const data = await res.text();
      alert(data);
      window.open("http://localhost:8501", "_self"); // Open Streamlit
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='container text-center mt-5'>
      <h1 className='text-center' style={{ marginTop: "150px" }}>Mentor-Mentee Matching System</h1>
      <div id="carouselExampleControls" className="carousel slide mx-auto mt-4 rounded-lg" data-bs-ride="carousel" style={{ maxWidth: "800px" }} >
        <div className="carousel-inner rounded-sm" style={{ margin: "auto" }}>
          <div className="carousel-item active">
            <img src="https://guider-ai.com/wp-content/uploads/2024/02/Skills_Mentor_Matching_Banner-1.png" className="d-block w-100" alt="..."  style={{ height: '400px', objectFit: 'cover' }}/>
          </div>
          <div className="carousel-item">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH-FwJ1Cg2CpKzr2tcudqsQZ7LDTpKNThNBg&s" className="d-block w-100" alt="..."  style={{ height: '400px', objectFit: 'cover' }} />
          </div>
          <div className="carousel-item">
            <img src={img1} className="d-block w-100" alt="..." style={{ height: '400px', objectFit: 'cover' }} />
          </div>
          <div className="carousel-item">
            <img src={img2} className="d-block w-100" alt="..." style={{ height: '400px', objectFit: 'cover' }}  />
          </div>

        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <button className='btn btn-primary mt-3' onClick={startMentorScript}>Find Mentor</button>
    </div>
  );
};

export default MatchingPage;
