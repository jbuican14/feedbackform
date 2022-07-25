import { createContext, useEffect, useState } from "react";

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true); 
  const [feedback, setFeedback] = useState([]);
  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false
  });

  useEffect(() => {
    fetchFeedback(); 
  },[]);

  const fetchFeedback = async () => {
    try {
      const res = await fetch('/feedback?_sort=id&_order=desc');
      const data = await res.json();
      setFeedback(data); 
      setIsLoading(false);  
    } catch (error) {
      throw Error('sorry there is a server error')
    }
   
  }

  const deleteFeedback = async (id) => {
    if (window.confirm("Are you sure?")) {
      try{
        await fetch( `/feedback/${id}`, { method: 'DELETE'}); 
      }catch(e) {
        throw new Error(`Cannot delete your feedback, something is not right ${e}`)
      }
      setFeedback(feedback.filter((item) => item.id !== id));
    }
  };

  const editFeedback = (item) => {
    setFeedbackEdit({
      item,
      edit: true
    });
  };

  const addFeedback = async (newFeedback) => {
    try{
      const res = await fetch('/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFeedback)
      });
  
      const data = await res.json()
   
      setFeedback([data, ...feedback]);

    }catch(e){
      throw new Error(`Cannot add your feedback, something is not right ${e}`);
    }
  };

  const updateFeedback = async (id, updItem) => {
    const res = await fetch(`/feedback/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify(updItem)
    });
    const data = await res.json();

    setFeedback(
      feedback.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  };

  return (
    <FeedbackContext.Provider
      value={{
        addFeedback,
        deleteFeedback,
        editFeedback,
        feedback,
        feedbackEdit,
        isLoading,
        updateFeedback
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackContext;
