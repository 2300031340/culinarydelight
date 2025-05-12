import React, { useEffect } from 'react';
import './About.css';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'SANKU ARUN',
    role: 'FRONT END DEVELOPER',
    image: '/team/arun1.jpg',
    description: 'Experienced full-stack developer with a passion for creating innovative solutions. Specializes in React, Node.js, and MongoDB.'
  },
  {
    id: 2,
    name: 'MUPPALLA MEGHANA',
    role: 'UI/UX DESIGNER',
    image: '/team/meg4.jpg',
    description: 'Frontend specialist with expertise in React and modern UI/UX design principles.',
    imageClass: 'meghana-image'
  },
  {
    id: 3,
    name: 'MINNA MADHU SHALINI',
    role: 'BACK END DEVELOPER',
    image: '/team/colead2.jpg',
    description: 'Backend expert focusing on Spring Boot and database optimization.'
  }
];

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-container">
      <section className="about-project">
        <h1>About Culinary Delights</h1>
        <div className="project-content">
          <div className="project-text">
            <p>
              Welcome to Culinary Delights, your ultimate destination for exploring and sharing 
              delicious recipes from around the world. Our platform is designed to bring together 
              food enthusiasts, home cooks, and professional chefs in a vibrant culinary community.
            </p>
            <p>
              We believe that cooking is not just about preparing meals; it's about creating 
              experiences, sharing traditions, and bringing people together. Our mission is to 
              make cooking accessible, enjoyable, and inspiring for everyone, regardless of their 
              skill level or culinary background.
            </p>
            <p>
              With our extensive collection of recipes, detailed cooking instructions, and 
              helpful tips from experienced chefs, we're here to help you explore new flavors 
              and perfect your cooking skills.
            </p>
          </div>
          <div className="project-features">
            <h2>What We Offer</h2>
            <ul>
              <li>Diverse collection of international recipes</li>
              <li>Step-by-step cooking instructions</li>
              <li>Cooking tips from professional chefs</li>
              <li>Community recipe sharing</li>
              <li>Personalized recipe recommendations</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="team-section">
        <h2>MEET OUR TEAM</h2>
        <div className="team-grid">
          {TEAM_MEMBERS.map(member => (
            <div key={member.id} className="team-card">
              <div className={`member-image ${member.imageClass || ''}`}>
                <img src={member.image} alt={member.name} />
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <h4>{member.role}</h4>
                <p>{member.description}</p>
                <div className="social-links">
                  <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                  <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                  <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About; 