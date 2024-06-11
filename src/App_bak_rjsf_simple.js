//import logo from './logo.svg';
import './App.css';

import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import React, { useState, useEffect } from 'react';


function App() {
  const [fetch_schema, setSchema] = useState(null);

    const fetchData = async () => {
      const response = await fetch('https://raw.githubusercontent.com/ddbj/template_generator_api/main/src/dev_schemas/ddbj_submission_dev1.json');
      const jsonData = await response.json();
      setSchema(jsonData);
    };
  
fetchData();

  return (
    <div className='app_container'>
        {fetch_schema ?
            <Form 
                schema={fetch_schema} 
                validator={validator} 
            >
            </Form>
        :
        <p>loading...</p>
    }
    </div>
    
  );
}

export default App;
