[![npm version](https://badge.fury.io/js/joiful-react-forms.svg)](https://badge.fury.io/js/joiful-react-forms)

# Joiful React Forms

## Installation
`npm i joiful-react-forms`

## Basic Usage
```javascript
import { default as React, Component } from 'react'
import { default as Joi } from 'joi'
import { JoifulForm, JoifulInput } from 'joiful-react-forms'

class Form extends Component {
    render() {
        return (
            <JoifulForm
                onChange={(event, formValues) => this.setState({ formValues }) }
                onSubmit={(error, formValues, event) => ... } 
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
        )
    }
}
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
| is ('text')   | func or string            | Either a key from the `joifulReactForms.JoifulInput.types` object stored in context (see below), or a React component instance. |
| name          | string                    | The name of the input. (Must correspond to the schema prop on `<JoifulForm />`)|

## Using custom inputs
`joiful-react-forms` gives you default html inputs. You can define a custom input inline using the `is` prop. See example below:

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
                        textarea: Textarea,
                        special: () => <input type='special'/>
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

The `is` property also serves as a reference the types of inputs you have in your context. We have defaults for keys like text, textarea and checkbox. As demonstrated above, you can override these with your own and may supply custom inputs which can be named anything you like and referenced as a string in the `is` prop. Take a look:

```javascript
<JoifulInput is='textarea' />
<JoifulInput is='special' />
```
