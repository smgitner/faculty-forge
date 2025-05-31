import React from 'react';

export const FormattingToolbar: React.FC = () => (
  <div id="quill-toolbar" className="border-b border-slate-200 p-3 bg-slate-50 mb-2">
    <select className="ql-header" defaultValue="">
      <option value="1"></option>
      <option value="2"></option>
      <option value=""></option>
    </select>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <button className="ql-underline"></button>
    <button className="ql-list" value="ordered"></button>
    <button className="ql-list" value="bullet"></button>
    <button className="ql-clean"></button>
    {/* Add more Quill toolbar controls as needed */}
  </div>
); 