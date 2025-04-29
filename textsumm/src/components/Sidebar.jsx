import React from 'react';
import "./Layout.css";

export const Sidebar = ({ setSummaryLength,setTargetLanguage }) => {
  return (
    <div className='body'>
      <ul>
        <div className='head'>
        <h4>Add</h4>
        <h3>Filter</h3>
        </div>  

        <div className='Summary-length'>
          <label>Select summary length</label>
          <select onChange={(e) => setSummaryLength(e.target.value)}>
            <option value="" disabled selected>Select length</option>
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>
        <div className='Summary-length'>
          <label>Select target language</label>
          <select onChange={(e) => setTargetLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
          </select>
        </div>

        <div className="head">
            <h4>Supported</h4>
            <h3>Language</h3>
            </div>
            <div className='language'>
            <h1>English</h1>
            <h1>Spanish</h1>
            <h1>French</h1>
            <h1>German</h1>
            <h1>Italian</h1>
            <h1>Russian</h1>
            </div>
      </ul>
      
    </div>
    
  );
};