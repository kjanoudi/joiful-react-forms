[![npm version](https://badge.fury.io/js/joiful-react-forms.svg)](https://badge.fury.io/js/joiful-react-forms)

# Joiful React Forms

## Installation
`npm i joiful-react-forms`

## Basic Usage
```javascript
import Joi from 'joi'
import { JoifulForm, JoifulInput } from 'joiful-react-forms'

const Form = () =>
    <JoifulForm
        onChange={(event, formValues) => this.setState({ formValues }) }
        onSubmit={(error) => ... } 
        schema={{
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().min(10).max(12)
        }}
        values={this.state.formValues}
    >
        <JoifulInput name="name"/>
        <JoifulInput name="email"/>
        <JoifulInput name="phone"/>
    </JoifulForm>
```

## Props
### `<JoifulForm />`
| Prop         | Type   | Description                              |
| :----------- | :----- | :--------------------------------------- |
| onChange     | func   | Passes (event, formValues) as arguments. |
| onSubmit     | func   | Passes (error) as an argument.           |
| schema       | object | A Joi validation schema.                 |

### `<JoifulInput />`
| Prop          | Type                      | Description                                                             |
| :------------ | :------------------------ | :---------------------------------------------------------------------- |
| is            | func                      | A React component, typically used to override at the instance level. See 'Using custom inputs' for global custom inputs.|
| name          | string                    | The name of the input. (Must correspond to the schema prop on `<JoifulForm />`)|

## Using custom inputs
`joiful-react-forms gives` you default html inputs. You can define a custom input inline. See example below:

```javascript
const Input = ({ error, ...props }) =>
    <div>
        <input type='text' {...props}/>
        {error}
    </div>

const Textarea = ({ error, ...props }) =>
    <div>
        <textarea {...props}/>
        {error}
    </div>

const Form = () =>
    <JoifulForm
        onSubmit={handleSubmit}
        schema={{
            name: Joi.string().required(),
            message: Joi.string().required()
        }}
    >
        <JoifulInput
            is={Input}
            name="name"
        />
        <JoifulInput
            is={Textarea}
            name="message"
        />
    </JoifulForm>

```

Or if you prefer, you can supply your application context a `joifulReactForms` object. See example:

```javascript
class App extends Component {
    static childContextTypes = {
        joifulReactForms: PropTypes.object
    };
    getChildContext() {
        return {
            joifulReactForms: {
                JoifulInput: {
                    types: {
                        text: Input,
                        textarea: Textarea
                    }
                }
            }
        }
    }
    render() {
        ...
    }
}
```
