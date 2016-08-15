[![npm version](https://badge.fury.io/js/joiful-react-forms.svg)](https://badge.fury.io/js/joiful-react-forms)

# Joiful React Forms

## Installation
`npm i joiful-react-forms`

## Basic Usage
```javascript
import { default as React, Component } from 'react'
import { default as Joi } from 'joi'
import { Form, Input } from 'joiful-react-forms'

class Form extends Component {
    render() {
        return (
            <Form
                onChange={(event, values) => this.setState({ values }) }
                onSubmit={(error, values, event) => ... } 
                schema={{
                    name: Joi.string().required(),
                    email: Joi.string().email().required(),
                    phone: Joi.string().min(10).max(12)
                }}
                values={this.state.values}
            >
                <Input name="name" />
                <Input name="email" />
                <Input name="phone" />
            </Form>
        )
    }
}
```

## Props
### `<Form />`
| Prop         | Type   | Description                                              |
| :----------- | :----- | :------------------------------------------------------- |
| schema       | object | Joi validation schema.                                   |
| values       | object | Object with keys corresponding to the schema             |
| onChange     | func   | (event, values) Fires when any value in the form changes |
| onSubmit     | func   | (error, values)                                          |

### `<Input />`
| Prop          | Type                      | Description                                                             |
| :------------ | :------------------------ | :---------------------------------------------------------------------- |
| is ('text')   | func or string            | Either a key from the `joifulReactForms.Input.types` object stored in context (see below), or a React component instance. |
| name          | string                    | The name of the input. (Must correspond to the schema prop on `<Form />`)|

## Using custom inputs
`joiful-react-forms` gives you default html inputs. You can define a custom input inline using the `is` prop. See example below:

```javascript
const TextInput = ({ error, ...props }) =>
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
    <Form
        onSubmit={handleSubmit}
        schema={{
            name: Joi.string().required(),
            message: Joi.string().required()
        }}
    >
        <Input is={TextInput} name="name" />
        <Input is={Textarea} name="message" />
    </Form>

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
                Input: {
                    types: {
                        text: TextInput,
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
<Input is='textarea' />
<Input is='special' />
```
