//import logo from './logo.svg';
import './App.css';

import Form from '@rjsf/mui';
//import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import React, { useState, useEffect } from 'react';
//import CSVReader from 'react-csv';



function App() {
  const [fetch_schema, setSchema] = useState(null);

  // const [data, setData] = useState(null)

  useEffect(() => {
    //fetch('https://raw.githubusercontent.com/ddbj/template_generator_api/main/src/dev_schemas/ddbj_submission_dev1.json')
    //fetch('https://raw.githubusercontent.com/ddbj/template_generator_client/main/schemas/example_schema_minimum_test.json')
    //fetch('https://raw.githubusercontent.com/ddbj/template_generator_api/main/src/dev_schemas/MSS_COMMON_template.json')
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
    // form3: {
    //   "ui:FieldTemplate": CustomFieldTemplate
    // },
    // form4: {
    //   "ui:widget": MyCustomWidget
    // }
  };


  function CustomFieldTemplate(props) {
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

  // function MyCustomWidget(props) {
  //   const {options} = props;
  //   const {color, backgroundColor} = options;
  //   const {id, classNames, label, help, required, description, errors, children} = props;
  //   console.log("chi: ", {children})
  //   return (
  //     <div className={classNames}>
  //       <label htmlFor={id}>{label}{required ? "*" : null}</label>
  //       {description}
  //       {children}
  //     </div>
  //   );
  // }

  function CsvTable(json) {
    console.log(json)
    // const [data, setData] = useState([]);
  
    // const handleForce = (data, errors) => {
    //   if (errors) {
    //     console.error(errors);
    //   } else {
    //     setData(data);
    //   }
    // };
  
    const data = createCommon(json);
    console.log(data)

    return (
      <div>
        {/* <CSVReader
          cssClass="csv-reader"
          label="Select CSV"
          onFileLoaded={handleForce}
        /> */}
        {/* <table>
          <thead>
            <tr>
              {data.length > 0 ? data[0].map((head, index) => <th key={index}>{head}</th>) : null}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.slice(1).map((row, i) => <tr key={i}>
              {row.map((cell, j) => <td key={j}>{cell}</td>)}
            </tr>) : null}
          </tbody>
        </table> */}
      blank
      </div>
    );
  }


  
  return (
    <div className='app_container'>
      <div style={{display: 'inline-block', width: '49%', verticalAlign: 'top'}}>
        {fetch_schema ?
            <Form 
                className='form_container'  //test
                schema={fetch_schema} 
                validator={validator} 
                uiSchema={uiSchema}
                CustomFieldTemplate = {CustomFieldTemplate}
                formData={fetch_schema}
                onChange={(e) => {
                  const { formData } = e
                  console.log(formData, e)
                }}
            >
            </Form>
        :
        <p>loading...</p>
        }
      </div>
      <div style={{display: 'inline-block', width: '49%', verticalAlign: 'top'}}>
        <div class="table_containr">
          {fetch_schema ? CsvTable(fetch_schema): "loading..."}
        </div>

      </div>
        

      
    </div>

    
  );
}

// 谷澤さんのコード

function createQualifier(qualifierKey, value) {
    const ret = [];
    if (Array.isArray(value)) { // For array data
        for (const v of value) {
            ret.push(["", "", "", qualifierKey, v]);
        }
    } else { // For string
        ret.push(["", "", "", qualifierKey, value]);
    }
    return ret;
}

function createFeature(featureName, featureValues) {
    let ret = [];
    if (Array.isArray(featureValues)) { // For array data (REFERENCE and COMMENT)
        for (const v of featureValues) {
            ret = ret.concat(createFeature(featureName, v));
        }
    } else {
        for (const qualifierKey in featureValues) {
            if (featureValues.hasOwnProperty(qualifierKey)) {
                const value = featureValues[qualifierKey];
                ret = ret.concat(createQualifier(qualifierKey, value));
            }
        }
    }
    if (ret.length > 0) {
        ret[0][1] = featureName;
    }
    return ret;
}

function createCommon(commonJson) {
    let ret = [];
    for (const featureName in commonJson) {
        if (commonJson.hasOwnProperty(featureName) && !featureName.startsWith("_")) {
            const featureValues = commonJson[featureName];
            ret = ret.concat(createFeature(featureName, featureValues));
        }
    }
    if (ret.length > 0) {
        ret[0][0] = "COMMON";
    }
    return ret;
}



// 谷澤さんのコードここまで


export default App;
