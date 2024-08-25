import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

const App = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest lowercase alphabet' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    try {
      const parsedInput = JSON.parse(input);
      const result = await axios.post('http://localhost:3000/api', parsedInput);
      setResponse(result.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const filterResponse = (response) => {
    if (!response) return null;
    const filteredResponse = {};
    selectedOptions.forEach(option => {
      if (response[option.value]) {
        filteredResponse[option.value] = response[option.value];
      }
    });
    return filteredResponse;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">API Interaction</h1>
          <form onSubmit={handleSubmit} className="mb-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Enter JSON, e.g. { "data": ["A","C","z"] }'
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-4"
              rows="4"
            />
            <button 
              type="submit" 
              className="w-full bg-white text-black font-bold py-2 px-4 border border-black rounded-md hover:bg-gray-100 transition duration-300"
            >
            Submit
            </button>
          </form>
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
          {response && (
            <div>
              <Select
                isMulti
                options={options}
                onChange={setSelectedOptions}
                className="mb-6"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: '#e2e8f0',
                    '&:hover': {
                      borderColor: '#cbd5e0',
                    },
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected ? '#4299e1' : state.isFocused ? '#ebf8ff' : 'white',
                    color: state.isSelected ? 'white' : '#4a5568',
                  }),
                }}
              />
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Filtered Response:</h2>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <JSONPretty id="json-pretty" data={filterResponse(response)}></JSONPretty>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;