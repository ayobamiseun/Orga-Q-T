"use client"
import React, { useEffect, useState, useCallback } from 'react'
import Button from '@/components/Button';
import AddModal from '@/components/AddModal/AddModal';
import fetchWrapper from '@/utils/fetchWrapper';
import { toast } from 'react-hot-toast';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface Question {
  id: string;
  question: string;
  options: string[];
}

function Home() {

  const [ questions, setQuestions ] = useState([]);
  const [ newQuestion, setNewQuestion ] = useState('');
  const [ options, setOptions ] = useState([ '', '', '' ]);
  const [ token, setToken ] = useState('');
  const [ error, setError ] = useState<string>('');
  const [ isShowingModal, setIsShowingModal ] = useState(false)
  const [ isEditShowingModal, setIsEditShowingModal ] = useState(false)
  const [ selectedQuestion, setSelectedQuestion ] = useState<Question | null>(null);
  const [ upDatedId, setUpdatedId ] = useState('')
  const [ isEditing, setIsEditing ] = useState(false);

  // api endpoint  🫶
  const questionUrl: string | undefined = process.env.NEXT_PUBLIC_QUESTIONS_API;

  const handleCloseModal = useCallback(() => {
    setIsShowingModal(false);
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsShowingModal(true);
  }, []);

  const handleEditCloseModal = useCallback(() => {
    setIsEditShowingModal(false);
  }, []);

  const handleEditOpenModal = useCallback((questionId: string) => {
    const selected = questions[ questionId ];
    setUpdatedId(questionId)

    console.log(selected)
    if (selected) {
      setSelectedQuestion(selected);
      setNewQuestion(selected.question);
      setOptions(selected.options);
      setIsEditShowingModal(true);
    }
  }, [ questions ]);

  useEffect(() => {
    const storedToken = localStorage.getItem('organUserToken');
    console.log(storedToken, "token")
    if (storedToken) {
      setToken(storedToken);
      fetchQuestions(storedToken);
    }
  }, []);


  // fetch questions 😎
  const fetchQuestions = async (token: string) => {
    try {
      const response = await fetchWrapper.get(questionUrl, token);
      const questionsData = await response.json();
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetchWrapper.post(questionUrl,
        {
          question: newQuestion,
          options: options.filter(option => option !== '')
        },
        token
      );
      console.log('New question ID:', response);
      toast.success('Question Added');
      fetchQuestions(token);
      setIsShowingModal(false);
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };
  const handleEditQuestion = async (questionId: string, updatedQuestion: Partial<Question>) => {
    setIsEditing(true);
    try {
      const response = await fetchWrapper.put(
        `${questionUrl}/${questionId}`,
        updatedQuestion,
        token
      );
      if (response.ok) {
        toast.success('Question Updated');
        fetchQuestions(token);
        setIsEditShowingModal(false);
      } else {
        toast.error('Failed to update question');
      }
    } catch (error) {
      console.error('Error editing question:', error);
      toast.error('Failed to update question');
    } finally {
      // Set loading state to false when editing operation completes (whether success or failure)
      setIsEditing(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this question?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const response = await fetchWrapper.del(
                `${questionUrl}/${questionId}`,
                null,
                token
              );
              if (response.ok) {
                toast.success('Question Deleted');
                fetchQuestions(token);
              } else {
                toast.error('Failed to delete question');
              }
            } catch (error) {
              console.error('Error deleting question:', error);
              toast.error('Failed to delete question');
            }
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  };

  return (
    <div className="w-full md:w-2/3 mx-auto p-5 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className="w-2/3">
          <h2 className="section-heading text-bold">
            Questions and Answer
          </h2>
        </div>
        <Button onClick={handleOpenModal} name="Add Question" />
        <AddModal show={isShowingModal}
          onClose={handleCloseModal} >
          <div className="flex w-full mx-auto mt-8 max-w-[80%] h-screen flex-col">
            <div className="mb-5">
              <label className="block mb-2 text-lg font-big font-Bold text-gray-900 dark:text-white">Add Question </label>
              <input type="text" placeholder="Question" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            </div>
            {[ 'a', 'b', 'c', 'd' ].map((option, index) => (
              <div key={index} className="mb-5">
                <label htmlFor={`option-${option}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{`Option ${option.toUpperCase()}`}</label>
                <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" id={`option-${option}`} value={options[ index ]} onChange={(e) => {
                  const updatedOptions = [ ...options ];
                  updatedOptions[ index ] = e.target.value;
                  setOptions(updatedOptions);
                }} />
              </div>
            ))}
            <button onClick={handleAddQuestion} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
          </div>
        </AddModal>
      </div>
      <div className="mt-8 space-y-8">
        {questions === null ? (
           <p className="text-[red]">No questions available. Add Question </p>
      ) : Object.keys(questions).length === 0 || null ? (
          <div>
            <p className="text-[red]">No questions available. Add Question </p>
            {/* Render your register button or any message here */}
          </div>
        ) : (
        Object.keys(questions).map(questionId => (
          <div key={questionId}>
            <div className="flex items-start">
              <div>
                <span className="inline-flex justify-center items-center w-6 h-6 rounded bg-green-500 text-white font-medium text-sm">
                  Q

                </span>
              </div>
              <p className="ml-4 md:ml-6 text-bold">
                {questions[ questionId ].question}
              </p>
            </div>
            {questions[ questionId ].options.map((option, index) => (
              <div className="flex items-start mt-3 ml-12" key={index}>
                <div>
                  <span className="inline-flex justify-center items-center w-6 h-6 rounded bg-gray-200 text-gray-800 font-medium text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                </div>
                <p className="ml-4 md:ml-6 text-bold text-gray-800">
                  {option}
                </p>
              </div>
            ))}
            <div className="flex items-star mt-3 ml-12">
              <button
                className="text-blue-600 hover:text-blue-700 mr-2 flex items-center flex-row gap-1"
                onClick={() => handleEditOpenModal(questionId)}
              >
                <FaEdit />
                Edit

              </button>

              <button
                onClick={() => handleDeleteQuestion(questionId)}
                className="text-red-600 hover:text-red-800 flex items-center flex-row gap-1"
              >
                <MdDelete />
                Delete
              </button>
            </div>
          </div>
        )))}


      </div>
      {/* edit modal */}

      <AddModal show={isEditShowingModal} onClose={handleEditCloseModal}>
        <div className="flex w-full mx-auto mt-8 max-w-[80%] h-screen flex-col">
          <div className="mb-5">
            <label htmlFor="editQuestion" className="block mb-2 text-lg font-big font-Bold text-gray-900 dark:text-white">Edit Question</label>
            <input
              type="text"
              id="editQuestion"
              placeholder="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          {options.map((option, index) => (
            <div key={index} className="mb-5">
              <label htmlFor={`editOption-${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{`Option ${String.fromCharCode(65 + index).toUpperCase()}`}</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                id={`editOption-${index}`}
                value={option}
                onChange={(e) => {
                  const updatedOptions = [ ...options ];
                  updatedOptions[ index ] = e.target.value;
                  setOptions(updatedOptions);
                }}
              />
            </div>
          ))}
          <button onClick={() => handleEditQuestion(upDatedId, { question: newQuestion, options })} type="submit"
            disabled={isEditing}  // Disable the button when editing is in progress
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {isEditing ? 'Editing...' : 'Submit'} </button> </div>
      </AddModal>
      {/* edit modal ends here  */}

    </div>
  )
}

export default Home
