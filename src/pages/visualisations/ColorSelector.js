import React from 'react';

const ColorSelector = ({ options, value, onChange }) => {
  return (
    <select value={value} onChange={onChange}>
      {options.map(option => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
};

export default ColorSelector;
