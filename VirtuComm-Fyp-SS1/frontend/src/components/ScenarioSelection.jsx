// ScenarioSelection.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Styled Components (unchanged)
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
`;

const Title = styled.h1`
  color: white;
  font-size: 3rem;
  margin-bottom: 3rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  animation: fadeIn 1s ease-in;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
`;

const ScenarioCard = styled.div`
  position: relative;
  height: 400px;
  background: ${props => props.background};
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 60%;
  object-fit: cover;
  transition: all 0.3s ease;
  
  ${ScenarioCard}:hover & {
    height: 65%;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: white;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
`;

const LanguageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.show ? 1 : 0};
  transform: ${props => props.show ? 'translateY(0)' : 'translateY(100%)'};
  transition: all 0.5s ease;
`;

const LanguageButton = styled.button`
  padding: 0.8rem 2rem;
  margin: 0.5rem;
  border: none;
  border-radius: 25px;
  background: ${props => props.selected ? '#ffd700' : 'white'};
  color: ${props => props.selected ? '#333' : '#666'};
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    background: ${props => props.selected ? '#ffd700' : '#f0f0f0'};
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
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const scenarios = [
    {
      id: 'teacher-student',
      name: 'Teacher & Student',
      image: 'https://cdn.britannica.com/94/216094-050-DE56809C/teacher-at-chalkboard.jpg',
      background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)'
    },
    {
      id: 'interview',
      name: 'Interview Scenario',
      image: '/img/stage1_5.png',
      background: 'linear-gradient(45deg, #4facfe, #00f2fe)'
    },
    {
      id: 'podcast',
      name: 'Podcast Scenario',
      image: 'https://www.atulhost.com/wp-content/uploads/2019/12/podcast.jpg',
      background: 'linear-gradient(45deg, #43e97b, #38f9d7)'
    },
    {
      id: 'single-model',
      name: 'Single Model',
      image: '/img/sin.png',
      background: 'linear-gradient(45deg, #ee0979, #ff6a00)'
    }
  ];

  const languages = ['english', 'urdu'];

  const scenarioRedirects = {
    'teacher-student': {
      english: '/stage1_4',
      urdu: '/stage1_4'
    },
    'interview': {
      english: '/stage1_5',
      urdu: '/stage1_5'
    },
    'podcast': {
      english: '/stage1_3',
      urdu: '/stage1_3'
    },
    'single-model': {
      english: '/stage1_1',
      urdu: '/stage1_1'
    }
  };

  const handleScenarioClick = (scenarioId) => {
    setSelectedScenario(scenarioId);
    setSelectedLanguage(''); 
  };

  const handleLanguageSelect = (scenarioId, language) => {
    setSelectedLanguage(language);
    const redirectUrl = scenarioRedirects[scenarioId][language];
    window.location.href = redirectUrl;
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <Container>
      <Title>Communication Scenarios</Title>
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
            </CardContent>
            <LanguageOverlay show={selectedScenario === scenario.id}>
              <CardTitle>Select Language</CardTitle>
              {languages.map((lang) => (
                <LanguageButton
                  key={lang}
                  selected={selectedLanguage === lang}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLanguageSelect(scenario.id, lang);
                  }}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </LanguageButton>
              ))}
            </LanguageOverlay>
          </ScenarioCard>
        ))}
      </CardsContainer>
    </Container>
  );
};

export default ScenarioSelection;