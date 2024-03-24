import fetchWrapper from './fetchWrapper'; // Assuming you have a fetchWrapper utility

// Fetch all questions
export const fetchQuestions = async (token) => {
  try {
    const response = await fetchWrapper.get(`${process.env.NEXT_PUBLIC_QUESTIONS_API}`, token);
    const questionsData = await response.json();
    return questionsData;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// Add a new question
export const addQuestion = async (url, question, options, token) => {
  try {
    const response = await fetchWrapper.post(url, { question, options }, token);
    return response;
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
};

// Edit an existing question
export const editQuestion = async (url, updatedQuestion, token) => {
  try {
    const response = await fetchWrapper.put(url, updatedQuestion, token);
    return response;
  } catch (error) {
    console.error('Error editing question:', error);
    throw error;
  }
};

// Delete an existing question
export const deleteQuestion = async (url, token) => {
  try {
    const response = await fetchWrapper.del(url, null, token);
    return response;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};
