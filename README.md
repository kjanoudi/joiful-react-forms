# Joiful React Forms

## Installation
`npm i joiful-react-forms`

## Basic Usage
```javascript
import Joi from 'joi'
import { JoifulForm, JoifulInput } from 'joiful-react-forms'

const MyValidatedForm = () =>
    <JoifulForm
        onSubmit={handleSubmit}
        schema={{
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().min(10).max(12)
        }}
    >
        <JoifulInput name="name"/>
        <JoifulInput name="email"/>
        <JoifulInput name="phone"/>
    </JoifulForm>

```

## Advanced Usage

### Try it with your own inputs
```javascript
import Joi from 'joi'
import { JoifulForm, JoifulInput } from 'joiful-react-forms'

const CustomInput = ({ error, ...props }) =>
    <div>
        <input {...props}/>
        {error}
    </div>

class default AppWithCustomJoifulInputs extends Component {

    static childContextTypes = {
        joifulReactForms: PropTypes.object
    };

    getChildContext() {
        return {
            joifulReactForms: {
                JoifulInput: {
                    types: {
                        // text: MyCustomInput // JoifulInput is="text" is default
                        customInput: MyCustomInput
                    }
                }
            }
        }
    }

    render() {
        return <FormWithCustomInputs/>
    }
}

const Form = () =>
    <JoifulForm
        onSubmit={handleSubmit}
        schema={{
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().min(10).max(12)
        }}
    >
        <JoifulInput
            is="customInput"
            name="name"
            placeholder="Name"
        />
        <JoifulInput
            is="customInput"
            name="email"
            type="email"
            placeholder="Email"
        />
        <JoifulInput
            is={MyCustomInput} // you can define custom inputs inline
            name="phone"
            placeholder="Phone"
        />
    </JoifulForm>

```
