// ScenarioSelection.jsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #1a1c2c 0%, #4a4e69 100%);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: url('/path-to-pattern.svg') repeat;
    opacity: 0.05;
    pointer-events: none;
  }
`;

const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  margin-bottom: 2rem;
  animation: ${fadeIn} 1s ease-out;
`;

const Title = styled.h1`
  color: white;
  font-size: 3.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 3rem;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  width: 100%;
  padding: 1rem;
  animation: ${fadeIn} 1s ease-out;
`;

const ScenarioCard = styled.div`
  position: relative;
  height: 420px;
  background: ${props => props.background};
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0) 0%,
      rgba(0,0,0,0.8) 100%
    );
    z-index: 1;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 65%;
  object-fit: cover;
  transition: all 0.5s ease;
  filter: brightness(0.9);
  
  ${ScenarioCard}:hover & {
    transform: scale(1.05);
    filter: brightness(1);
  }
`;

const CardContent = styled.div`
  padding: 2rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  color: white;
`;

const CardTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const CardDescription = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const RoleOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.show ? 1 : 0};
  transform: ${props => props.show ? 'translateY(0)' : 'translateY(100%)'};
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 3;
`;

const RoleButton = styled.button`
  padding: 1rem 2.5rem;
  margin: 0.7rem;
  border: none;
  border-radius: 30px;
  background: ${props => props.selected ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(255, 255, 255, 0.9)'};
  color: ${props => props.selected ? '#1a1c2c' : '#333'};
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    background: ${props => props.selected ? 'linear-gradient(135deg, #FFD700, #FFA500)' : '#ffffff'};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255,255,255,.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin: 20px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ScenarioSelection = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null initially to indicate loading
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/check-login/', { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
        if (!response.data.isAuthenticated) {
          navigate('/login', { state: { from: '/scenario-selection' } });
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate('/login', { state: { from: '/scenario-selection' } });
      }
    };
    checkLoginStatus();
  }, [navigate]);

  const [selectedScenario, setSelectedScenario] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const scenarios = [
    {
      id: 'teacher-student',
      name: 'Teacher & Student',
      description: 'Practice classroom interactions and educational scenarios',
      image: 'https://cdn.britannica.com/94/216094-050-DE56809C/teacher-at-chalkboard.jpg',
      background: 'linear-gradient(45deg, #2c3e50, #3498db)',
      roles: ['teacher', 'student'],
    },
    {
      id: 'interview',
      name: 'Interview Scenario',
      description: 'Master professional interviews and improve your career prospects',
      image: '/img/stage1_5.png',
      background: 'linear-gradient(45deg, #2c3e50, #27ae60)',
      roles: ['interviewer', 'interviewee'],
    },
    {
      id: 'podcast',
      name: 'Podcast Scenario',
      description: 'Learn the art of engaging conversations and storytelling',
      image: 'https://www.atulhost.com/wp-content/uploads/2019/12/podcast.jpg',
      background: 'linear-gradient(45deg, #2c3e50, #e74c3c)',
      roles: ['host', 'guest'],
    },
    {
      id: 'single-model',
      name: 'Single Model',
      description: 'Practice solo presentations and monologues',
      image: '/img/sin.png',
      background: 'linear-gradient(45deg, #2c3e50, #9b59b6)',
      roles: ['solo'],
    }
  ];

  const scenarioRedirects = {
    'teacher-student': {
      teacher: '/stage1_4',
      student: '/stage1_4',
    },
    'interview': {
      interviewer: '/stage1_5',
      interviewee: '/stage1_5',
    },
    'podcast': {
      host: '/stage1_3',
      guest: '/stage1_3',
    },
    'single-model': {
      solo: '/stage1_1',
    }
  };

  const handleScenarioClick = (scenarioId) => {
    setSelectedScenario(scenarioId);
    setSelectedRole(''); // reset role on new scenario selection
  };

  const handleRoleSelect = (scenarioId, role) => {
    setSelectedRole(role);
    const redirectUrl = scenarioRedirects[scenarioId][role];
    axios.post('http://localhost:8000/api_tts/set-language/', { language: role }, { withCredentials: true })
      .then(response => {
        console.log('Role received: ', response.data.language);
        window.location.href = redirectUrl;
      })
      .catch(error => console.log('Error posting role:', error));
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <Container>
      <Header>
        <Title>Communication Scenarios</Title>
        <Subtitle>
          Choose your preferred scenario and role to enhance your communication skills
          through interactive practice sessions.
        </Subtitle>
      </Header>
      <CardsContainer>
        {scenarios.map((scenario) => (
          <ScenarioCard 
            key={scenario.id}
            background={scenario.background}
            onClick={() => handleScenarioClick(scenario.id)}
          >
            <CardImage src={scenario.image} alt={scenario.name} />
            <CardContent>
              <CardTitle>{scenario.name}</CardTitle>
              <CardDescription>{scenario.description}</CardDescription>
            </CardContent>
            <RoleOverlay show={selectedScenario === scenario.id}>
              <CardTitle>Select Your Role</CardTitle>
              {scenario.roles.map((role) => (
                <RoleButton
                  key={role}
                  selected={selectedRole === role}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelect(scenario.id, role);
                  }}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </RoleButton>
              ))}
            </RoleOverlay>
          </ScenarioCard>
        ))}
      </CardsContainer>
    </Container>
  );
};

export default ScenarioSelection;
