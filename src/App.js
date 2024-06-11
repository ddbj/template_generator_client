//import logo from './logo.svg';
//import './App.css';

import Form from '@rjsf/mui';
//import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import React, { useState, useEffect } from 'react';


function App() {
  const [fetch_schema, setSchema] = useState(null);


useEffect(() => {
    fetch('https://raw.githubusercontent.com/ddbj/template_generator_api/main/src/dev_schemas/ddbj_submission_dev1.json')
    //fetch('https://raw.githubusercontent.com/ddbj/template_generator_client/main/schemas/example_schema_minimum_test.json')
    .then(res => res.json())
    .then(data => {
        setSchema(data);
    })
  }, []);


  const uiSchema = {
    "division": {
      'ui:Placeholder': 'Select your division'
    }
  };
  
  return (
    <div className='app_container'>
        {fetch_schema ?
            <Form 
                schema={fetch_schema} 
                validator={validator} 
                uiSchema={uiSchema}
            >
            </Form>
        :
        <p>loading...</p>
    }
    </div>
    
  );
}

export default App;
