
const generateCourseContent = async (title, description) => {
  const prompt = `Create study material for a course titled "${title}". ${description ? `Description: ${description}` : ''}
  
  Respond with ONLY a JSON object in this exact format, no other text:
  {
    "content": "detailed study notes here (at least 500 words)",
    "flashcards": [
      {"question": "q1", "answer": "a1"},
      {"question": "q2", "answer": "a2"},
      {"question": "q3", "answer": "a3"},
      {"question": "q4", "answer": "a4"},
      {"question": "q5", "answer": "a5"}
    ],
    "quiz": [
      {"question": "q1", "options": ["a", "b", "c", "d"], "correct": 0},
      {"question": "q2", "options": ["a", "b", "c", "d"], "correct": 1},
      {"question": "q3", "options": ["a", "b", "c", "d"], "correct": 2},
      {"question": "q4", "options": ["a", "b", "c", "d"], "correct": 0},
      {"question": "q5", "options": ["a", "b", "c", "d"], "correct": 3}
    ]
  }`;

  const response = await fetch('http://127.0.0.1:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'mistral', prompt, stream: false })
  });

  const data = await response.json();
  const clean = data.response.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

module.exports = { generateCourseContent };
