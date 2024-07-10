//import logo from './logo.svg';
//import './App.css';

import Form from '@rjsf/mui';
//import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import React, { useState, useEffect } from 'react';


function App() {
  const [fetch_schema, setSchema] = useState(null);

  const [data, setData] = useState(null)

useEffect(() => {
    //fetch('https://raw.githubusercontent.com/ddbj/template_generator_api/main/src/dev_schemas/ddbj_submission_dev1.json')
    //fetch('https://raw.githubusercontent.com/ddbj/template_generator_client/main/schemas/example_schema_minimum_test.json')
    fetch('test.json')
    .then(res => res.json())
    .then(data => {
        setSchema(data);
    })
  }, []);


  const uiSchema = {
    data_type: {
      "ui:help": (
        <div style={{'fontSize':'1rem'}}>See dfast's <a href="https://dfast.ddbj.nig.ac.jp/">original website</a> for more information.</div>
      )
    },
    form3: {
      "ui:FieldTemplate": CustomFieldTemplate
    }
  };


  function CustomFieldTemplate(props) {
    console.log("props: ", props)
    const {id, classNames, label, help, required, description, errors, children} = props;
    return (
      <div className={classNames}>
        <label htmlFor={id}>{label}{required ? "*" : null}</label>
        {description}
        {children}
        {errors}
        {help}
      </div>
    );
  }


  
  return (
    <div className='app_container'>
        {fetch_schema ?
            <Form 
                schema={fetch_schema} 
                validator={validator} 
                uiSchema={uiSchema}
                CustomFieldTemplate = {CustomFieldTemplate}
                formData={data}
                onChange={(e) => {
                  const { formData } = e
                  console.log(formData.form2)
                }}
            >
            </Form>
        :
        <p>loading...</p>
    }
    </div>
    
  );
}

export default App;
