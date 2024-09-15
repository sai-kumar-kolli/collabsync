import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { socket } from '../../../utils/socket'; // Import the socket
import { getDocument } from '../../API/getDocument';
import { addSessionData, removeSessionData } from '../../Slices/editorSlice';

const EditorLanding = (props) => {
  const { sessionId } = useParams(); // Get editor ID from URL
  const dispatch = useDispatch();

  // const initialCode = useSelector((state) => state.editor.code); // Redux code state
  const [code, setCode] = useState(""); // State for editor code

  useEffect(() => {
    return () => {
      dispatch(addSessionData({}))
    }
  }, [])

  useEffect(() => {
    if (props.code) {
      setCode(props.code.content);
    }
  }, [props.code])


  useEffect(() => {
    if (sessionId && !socket.connected) {
      // Connect WebSocket if not already connected
      socket.connect();

      // Join the room based on editor ID
      socket.emit("joinRoom", sessionId);

      // Listen for session info and update Redux
      socket.on("sessionInfo", (data) => {
        console.log(data, "Session Info");
        dispatch(addSessionData(data)); // Dispatch to Redux store
      });

      // Listen for incoming code changes from the server
      socket.on("receiveCode", (newCode) => {
        setCode(newCode);
      });

      // Cleanup WebSocket listeners and connection when component unmounts
      return () => {
        socket.disconnect(); // Disconnect WebSocket
        // socket.off("sessionExpired");
        socket.off("sessionInfo");
        socket.off("receiveCode");
      };
    }
  }, [sessionId, dispatch]);

  useEffect(() => {
    if (sessionId) {
      dispatch(getDocument(sessionId)); // Fetch document and update Redux store
    }
    return () => {
      dispatch(removeSessionData(sessionId));
    }
  }, [sessionId, dispatch]); // Only depend on sessionId

  // Handle user input in the editor
  const handleEditorChange = (newCode) => {
    setCode(newCode); // Update the local state

    // Send code changes to the server only if the socket connection is active
    if (socket.connected) {
      socket.emit("codeChange", { roomId: sessionId, code: newCode });
    }
  };

  return (
    <div className="editor-container">
      <Editor
        value={code}
        height="80vh"
        defaultLanguage="javascript"
        theme="vs-dark"
        onChange={handleEditorChange}
      />
    </div>
  );
};

//Map Redux state to component props
const mapStateToProps = (state) => ({
  sessionData: state.editor.sessionData, // Session data from Redux store
  code: state.editor.code, // Document code from Redux store
});

// Map Redux actions to component props
const mapDispatchToProps = {
  getDocument,
  addSessionData,
  removeSessionData,
};

// Connect the component to Redux
export default connect(mapStateToProps, mapDispatchToProps)(EditorLanding);