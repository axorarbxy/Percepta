import React from 'react';

const Loader = ({ label = 'Percepta is processing your cues' }) => {
  return (
    <span className="folder-cue-loader" role="status" aria-label={label}>
      <span className="folder-cue-loader__vessel" aria-hidden="true" />
      <span className="folder-cue-loader__text">{label}</span>
    </span>
  );
};

export default Loader;
