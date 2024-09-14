// src/features/editorpage/EditorLanding.js
import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../common/axiosInstance';
import { apiURL } from '../../common/constant';

const EditorLanding = () => {
  const { sessionId } = useParams(); // Get editor ID from URL
  const [code, setCode] = useState(""); // State for editor code

  // Fetch document data for the sessionId when the component mounts
  useEffect(() => {
    if (sessionId) {
      handleGetDocument(sessionId);
    }
  }, [sessionId]); // Only depend on sessionId

  const handleGetDocument = async (sessionId) => {
    try {
      const response = await axiosInstance.get(`${apiURL}/documents/${sessionId}`);
      setCode(response.data.content); // Set the code in the editor
    } catch (err) {
      console.error("Error fetching document:", err);
      setCode(""); // Set default code
    }
  };

  // Handle user input in the editor
  const handleEditorChange = (newCode) => {
    setCode(newCode); // Update the local state
  };

  return (
    <div className="editor-container">
      <Editor
        value={code}
        height="80vh"  // Adjust height based on header height
        defaultLanguage="javascript"
        defaultValue="// Start coding..."
        theme="vs-dark"
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default EditorLanding;
