import React from 'react';
import Editor from '@monaco-editor/react';

const EditorLanding = () => {
  const handleEditorChange = (value) => {
    console.log("Code changed:", value);
  };

  return (
    <div className="editor-container">
      <Editor
        height="calc(100vh - 60px)"  // Adjust height based on header height
        defaultLanguage="javascript"
        defaultValue="// Start coding..."
        theme="vs-dark"
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default EditorLanding;
