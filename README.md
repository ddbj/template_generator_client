# template_generator_client

- react-jsonschema-formを利用して"ddbj_submission_dev1.json"を表示します
- 現状はミニマルなjsonschema formの表示のみ

## デプロイ方法

- git clone <レポジトリ>
- cd <レポジトリ>
- docker build -t react-app .  
- docker run -d -p 3000:80 react-app

### ec2インスタンスではbyobuに入ってbuildを実行するとなぜか上手くいった


## JSONSchemaでif~thenを記述する際のtips

if thenが正しく表示されるサンプルのJSONSchemaを

[schmas/example_schema_minimum_test.json
](https://github.com/ddbj/template_generator_client/blob/main/schemas/example_schema_minimum_test.json)に置きました

if thenを利用したschemaを記述する場合以下のように属性を記述します
- ルートのpropertiesにはif thenに記述する項目は含めない（この場合この属性のレンダリングは既存の属性の最後に追加される）
- propertiesに空の属性のみ記述する
  
