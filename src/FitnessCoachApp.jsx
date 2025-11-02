import React, { useState, useEffect } from 'react';
import { Camera, Dumbbell, Apple, Volume2, Download, RefreshCw, Moon, Sun, Sparkles, Heart } from 'lucide-react';
import './index';

const FitnessCoachApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    goal: 'weight-loss',
    level: 'beginner',
    location: 'gym',
    diet: 'non-veg',
    medical: '',
    stress: 'moderate'
  });
  const [plan, setPlan] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [motivation, setMotivation] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('fitnessPlan');
    if (saved) {
      try {
        setPlan(JSON.parse(saved));
      } catch (e) {}
    }
    
    const theme = localStorage.getItem('darkMode');
    if (theme === 'true') setDarkMode(true);
    
    generateMotivation();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const generateMotivation = () => {
    const quotes = [
      "Your body can stand almost anything. It's your mind you have to convince.",
      "Success starts with self-discipline. Let's crush today's goals!",
      "The only bad workout is the one that didn't happen.",
      "Don't wish for it, work for it. Every rep counts!",
      "Strength doesn't come from what you can do. It comes from overcoming what you thought you couldn't."
    ];
    setMotivation(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate AI generation (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedPlan = {
      user: formData,
      workout: {
        title: `${formData.level.charAt(0).toUpperCase() + formData.level.slice(1)} ${formData.goal.replace('-', ' ').toUpperCase()} Plan`,
        schedule: [
          {
            day: 'Monday',
            focus: 'Upper Body',
            exercises: [
              { name: 'Barbell Bench Press', sets: 4, reps: '8-12', rest: '90s' },
              { name: 'Dumbbell Rows', sets: 4, reps: '10-12', rest: '60s' },
              { name: 'Shoulder Press', sets: 3, reps: '10-12', rest: '60s' },
              { name: 'Bicep Curls', sets: 3, reps: '12-15', rest: '45s' }
            ]
          },
          {
            day: 'Tuesday',
            focus: 'Lower Body',
            exercises: [
              { name: 'Barbell Squats', sets: 4, reps: '8-12', rest: '90s' },
              { name: 'Romanian Deadlifts', sets: 4, reps: '10-12', rest: '90s' },
              { name: 'Leg Press', sets: 3, reps: '12-15', rest: '60s' },
              { name: 'Calf Raises', sets: 3, reps: '15-20', rest: '45s' }
            ]
          },
          {
            day: 'Wednesday',
            focus: 'Rest / Active Recovery',
            exercises: [
              { name: 'Light Cardio', sets: 1, reps: '20-30 min', rest: 'N/A' },
              { name: 'Stretching', sets: 1, reps: '15 min', rest: 'N/A' }
            ]
          }
        ],
        tips: [
          'Always warm up for 5-10 minutes before starting',
          'Focus on proper form over heavy weights',
          'Stay hydrated throughout your workout',
          'Get 7-8 hours of sleep for optimal recovery'
        ]
      },
      diet: {
        title: `${formData.diet.toUpperCase()} Meal Plan`,
        meals: {
          breakfast: [
            { name: 'Oatmeal with Berries', calories: 350, protein: '12g', carbs: '55g', fats: '8g' },
            { name: 'Greek Yogurt', calories: 150, protein: '15g', carbs: '12g', fats: '4g' },
            { name: 'Green Tea', calories: 0, protein: '0g', carbs: '0g', fats: '0g' }
          ],
          lunch: [
            { name: 'Grilled Chicken Breast', calories: 280, protein: '45g', carbs: '0g', fats: '9g' },
            { name: 'Brown Rice', calories: 215, protein: '5g', carbs: '45g', fats: '2g' },
            { name: 'Mixed Vegetables', calories: 80, protein: '3g', carbs: '15g', fats: '1g' }
          ],
          snack: [
            { name: 'Protein Shake', calories: 200, protein: '25g', carbs: '10g', fats: '5g' },
            { name: 'Almonds', calories: 160, protein: '6g', carbs: '6g', fats: '14g' }
          ],
          dinner: [
            { name: 'Grilled Salmon', calories: 350, protein: '40g', carbs: '0g', fats: '20g' },
            { name: 'Quinoa', calories: 220, protein: '8g', carbs: '40g', fats: '4g' },
            { name: 'Steamed Broccoli', calories: 55, protein: '4g', carbs: '11g', fats: '1g' }
          ]
        },
        hydration: 'Drink 3-4 liters of water daily',
        supplements: ['Whey Protein', 'Omega-3', 'Multivitamin']
      }
    };

    setPlan(generatedPlan);
    localStorage.setItem('fitnessPlan', JSON.stringify(generatedPlan));
    setLoading(false);
    setStep('plan');
  };

  const speakPlan = (section) => {
    if ('speechSynthesis' in window) {
      const text = section === 'workout' 
        ? `Here is your workout plan. ${plan.workout.schedule.map(day => 
            `${day.day}: ${day.focus}. ${day.exercises.map(ex => 
              `${ex.name}, ${ex.sets} sets of ${ex.reps} reps`
            ).join('. ')}`
          ).join('. ')}`
        : `Here is your diet plan. ${Object.entries(plan.diet.meals).map(([meal, items]) => 
            `For ${meal}: ${items.map(item => item.name).join(', ')}`
          ).join('. ')}`;
      
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser');
    }
  };

  const generateImage = async (itemName, type) => {
    setSelectedImage({ name: itemName, loading: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSelectedImage({
      name: itemName,
      loading: false,
      url: `https://source.unsplash.com/400x300/?${type === 'exercise' ? 'fitness,gym,workout' : 'food,healthy,meal'}`
    });
  };

  const exportPDF = () => {
    alert('PDF export functionality would integrate with libraries like jsPDF or react-pdf');
  };

  const regeneratePlan = () => {
    setPlan(null);
    setStep('form');
    generateMotivation();
  };

  return (
    <div className={`fitness-app ${darkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <header className={`header ${darkMode ? 'dark' : 'light'}`}>
        <div className="header-container">
          <div className="header-logo">
            <Dumbbell className="w-8 h-8 text-blue-500" />
            <h1 className="header-title">AI Fitness Coach</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`theme-toggle ${darkMode ? 'dark' : 'light'}`}
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>
      </header>

      {/* Motivation Banner */}
      <div className={`motivation-banner ${darkMode ? 'dark' : 'light'}`}>
        <div className="motivation-content">
          <Sparkles />
          <p className="motivation-text">{motivation}</p>
        </div>
      </div>

      <div className="main-container">
        {step === 'form' && (
          <div className={`form-container ${darkMode ? 'dark' : 'light'}`}>
            <h2 className="form-title">Tell Us About Yourself</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-grid-2">
                <div>
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`form-input ${darkMode ? 'dark' : 'light'}`}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className={`form-input ${darkMode ? 'dark' : 'light'}`}
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div>
                  <label className="form-label">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className={`form-select ${darkMode ? 'dark' : 'light'}`}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Height (cm)</label>
                  <input
                    type="number"
                    required
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className={`form-input ${darkMode ? 'dark' : 'light'}`}
                    placeholder="170"
                  />
                </div>
                <div>
                  <label className="form-label">Weight (kg)</label>
                  <input
                    type="number"
                    required
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className={`form-input ${darkMode ? 'dark' : 'light'}`}
                    placeholder="70"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label className="form-label">Fitness Goal</label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
                    className={`form-select ${darkMode ? 'dark' : 'light'}`}
                  >
                    <option value="weight-loss">Weight Loss</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="endurance">Endurance</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Fitness Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className={`form-select ${darkMode ? 'dark' : 'light'}`}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label className="form-label">Workout Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className={`form-select ${darkMode ? 'dark' : 'light'}`}
                  >
                    <option value="gym">Gym</option>
                    <option value="home">Home</option>
                    <option value="outdoor">Outdoor</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Diet Preference</label>
                  <select
                    value={formData.diet}
                    onChange={(e) => setFormData({...formData, diet: e.target.value})}
                    className={`form-select ${darkMode ? 'dark' : 'light'}`}
                  >
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="veg">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Medical History (Optional)</label>
                <textarea
                  value={formData.medical}
                  onChange={(e) => setFormData({...formData, medical: e.target.value})}
                  className={`form-textarea ${darkMode ? 'dark' : 'light'}`}
                  rows="3"
                  placeholder="Any injuries or medical conditions..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? 'Generating Your Plan...' : 'Generate My Fitness Plan'}
              </button>
            </form>
          </div>
        )}

        {step === 'plan' && plan && (
          <div className="space-y-8">
            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={() => speakPlan('workout')}
                className={`action-button blue ${darkMode ? 'dark' : ''}`}
              >
                <Volume2 />
                Read Workout Plan
              </button>
              <button
                onClick={() => speakPlan('diet')}
                className={`action-button green ${darkMode ? 'dark' : ''}`}
              >
                <Volume2 />
                Read Diet Plan
              </button>
              <button
                onClick={exportPDF}
                className={`action-button purple ${darkMode ? 'dark' : ''}`}
              >
                <Download />
                Export PDF
              </button>
              <button
                onClick={regeneratePlan}
                className={`action-button gray ${darkMode ? 'dark' : ''}`}
              >
                <RefreshCw />
                Regenerate
              </button>
            </div>

            <div className="plan-grid">
              {/* Workout Plan */}
              <div className={`plan-card ${darkMode ? 'dark' : 'light'}`}>
                <div className="plan-card-header">
                  <Dumbbell className="workout" />
                  <h2 className="plan-card-title">{plan.workout.title}</h2>
                </div>
                
                <div className="plan-sections">
                  {plan.workout.schedule.map((day, idx) => (
                    <div key={idx} className={`day-section ${darkMode ? 'dark' : 'light'}`}>
                      <h3 className="day-title workout">{day.day} - {day.focus}</h3>
                      <div className="exercise-list">
                        {day.exercises.map((ex, exIdx) => (
                          <div
                            key={exIdx}
                            onClick={() => generateImage(ex.name, 'exercise')}
                            className={`exercise-item ${darkMode ? 'dark' : 'light'}`}
                          >
                            <div className="exercise-header">
                              <Camera className="workout" />
                              <p className="exercise-name">{ex.name}</p>
                            </div>
                            <p className="exercise-details">
                              {ex.sets} sets × {ex.reps} reps • Rest: {ex.rest}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`tips-section workout ${darkMode ? 'dark' : 'light'}`}>
                  <h4 className="tips-title">
                    <Heart />
                    Pro Tips
                  </h4>
                  <ul className="tips-list">
                    {plan.workout.tips.map((tip, idx) => (
                      <li key={idx}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Diet Plan */}
              <div className={`plan-card ${darkMode ? 'dark' : 'light'}`}>
                <div className="plan-card-header">
                  <Apple className="diet" />
                  <h2 className="plan-card-title">{plan.diet.title}</h2>
                </div>
                
                <div className="plan-sections">
                  {Object.entries(plan.diet.meals).map(([mealType, items]) => (
                    <div key={mealType} className={`day-section ${darkMode ? 'dark' : 'light'}`}>
                      <h3 className="day-title diet" style={{textTransform: 'capitalize'}}>{mealType}</h3>
                      <div className="exercise-list">
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => generateImage(item.name, 'food')}
                            className={`exercise-item ${darkMode ? 'dark' : 'light'}`}
                          >
                            <div className="exercise-header">
                              <Camera className="diet" />
                              <p className="exercise-name">{item.name}</p>
                            </div>
                            <div className="macros">
                              <span>{item.calories} cal</span>
                              <span>P: {item.protein}</span>
                              <span>C: {item.carbs}</span>
                              <span>F: {item.fats}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`tips-section diet ${darkMode ? 'dark' : 'light'}`}>
                  <h4 className="tips-title">💧 {plan.diet.hydration}</h4>
                  <h4 className="tips-title">💊 Supplements</h4>
                  <div className="supplements">
                    {plan.diet.supplements.map((sup, idx) => (
                      <span key={idx} className={`supplement-tag ${darkMode ? 'dark' : 'light'}`}>
                        {sup}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
              <div
                onClick={() => setSelectedImage(null)}
                className="modal-overlay"
              >
                <div className={`modal-content ${darkMode ? 'dark' : 'light'}`} onClick={(e) => e.stopPropagation()}>
                  <h3 className="modal-title">{selectedImage.name}</h3>
                  {selectedImage.loading ? (
                    <div className="modal-image-container">
                      <div className="modal-spinner"></div>
                    </div>
                  ) : (
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.name}
                      className="modal-image"
                    />
                  )}
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="modal-close-button"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={`footer ${darkMode ? 'dark' : 'light'}`}>
        <p className="footer-text">Built by Ashwin S</p>
      </footer>
    </div>
  );
};

export default FitnessCoachApp;