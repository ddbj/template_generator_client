//import logo from './logo.svg';
import './App.css';

import Form from '@rjsf/mui';
//import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
//import CSVReader from 'react-csv';



function App() {
  // 初期値nullで、fetch_schemaに更新関数setSchemaで値をセットする
  const [fetch_schema, setSchema] = useState(null);

  // const [data, setData] = useState(null)

  useEffect(() => {
    //fetch('https://raw.githubusercontent.com/ddbj/template_generator_api/main/src/dev_schemas/ddbj_submission_dev1.json')
    fetch('https://raw.githubusercontent.com/ddbj/template_generator_api/main/src/dev_schemas/MSS_COMMON_template.json')
    //fetch('test.json')
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
    console.log("CsvTable", json)
    // 
    //const [csv_data, setData] = useState([]);
  
    // const handleForce = (data, errors) => {
    //   if (errors) {
    //     console.error(errors);
    //   } else {
    //     setData(data);
    //   }
    // };
    const data = createCommon(json);
    console.log("CsvTable CreateCommon", data)
    const columns = ['Entry', 'Feature', 'Location', 'Qualifier','Value'];
    const MssTableThead = styled.thead`
      background-color: #5c7aa4;
      min-width: 400px;
      color: #ffffff;
      text-align: left;
      ;  `
    const MssTableTh = styled.th`
        min-width: 80px;
        border:1px solid #cccccc;
        padding: 0 6px 0 4px;
    `
    const MssTableTr = styled.tr`
      border-bottom: 1px solid #dddddd;
      ＆tr:nth-of-type(even) {
          background-color: #f3f3f3;
      }
    `;
    const MssBodyTd = styled.td`
      border:1px solid #cccccc;
      min-width: 60px;
      padding: 0 10px 0 2px;
    `

    return (
      <div>
        {/* <CSVReader
          cssClass="csv-reader"
          label="Select CSV"
          onFileLoaded={handleForce}
        /> */}

        {<table
          className="mss_table"
        >
          <MssTableThead>
            <tr>
              {columns.map((column, index) => (
                <MssTableTh key={index}>{column}</MssTableTh>
              ))}
            </tr>
          </MssTableThead>
          <tbody>
            
            {data.slice(0,32).map((row, index)=>(
              // row, indexを渡せない？
              <MssTableTr>
                
                {row.map((cell, cellIndex) => (
                  <MssBodyTd key={cellIndex}>{cell}</MssBodyTd>
                ))}

              </MssTableTr>
            ))}

          </tbody>
        </table> }
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
                  // setSchema(formData)することで、フォームの内容が更新されるとfetch_schemaに反映される
                  setSchema(formData)
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

// 谷澤さんのjson2csvコード
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
