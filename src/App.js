import './App.css';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';


function App() {
  // fetch_schemaは初期値nullで、setShema関数で値をsetされサイレンダリングがトリガされる
  const [fetch_schema, setSchema] = useState(null);
  //  csvTable(form_data)を再レンダリングするためのstate。formのonChangeでsetDataが呼ばれれる。
  const [form_data, setData] = useState(null)

  useEffect(() => {
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

  function CsvTable(json) {
    console.log("created json", json)
    // title, type, properties, definitionsがformDataに付加されるので削除
    delete json.title
    delete json.type
    delete json.properties
    delete json.definitions
    delete json.allOf
    const table_data = createCommon(json);
    console.log("created data", table_data)
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
      // table生成
      <div>

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
            
            {table_data.map((row, index)=>(
              
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
                  const form_value  = e
                  // 直しjavascriptの仕様的には{key}なので {formData}==e.formDataなはず
                  console.log("form_value", form_value)
                  // setSchema(formData)することで、フォームの内容が更新されるとfetch_schemaに反映される
                  setData(form_value.formData)
                }}
                onSubmit={(e) => {
                  handleDownload(e.formData)
                }}
            >
              <div>   
              <button type="submit" variant="contained" color="primary">Download Template</button>
              </div>
            </Form>
        :
        <p>loading...</p>
        }
      </div>
      <div style={{display: 'inline-block', width: '49%', verticalAlign: 'top'}}>
        <div class="table_containr">
          {form_data ? CsvTable(form_data): "loading..."}
        </div>
      </div>
    </div>

    
  );
}


// csv download handler
const handleDownload = (d) => {
  let newCsvString = convertToCSV(d);
  newCsvString = "Entry,Feature,Location,Qualifier,Value\n" + newCsvString;

  const blob = new Blob([newCsvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'mss_common_template.csv';
  link.click();
  URL.revokeObjectURL(link.href);
};

const convertToCSV = (data) => {
  const dl_data = createCommon(data)
  console.log("data", data) 
  return dl_data.map(row => row.join(',')).join('\n');
};

// json2csv
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
// json2csv変換コードここまで


export default App;
