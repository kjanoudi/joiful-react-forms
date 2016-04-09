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
        <JoifulInput
            name="name"
            placeholder="Name"
        />
        <JoifulInput
            name="email"
            placeholder="Email"
        />
        <JoifulInput
            name="phone"
            placeholder="Phone"
        />
    </JoifulForm>

```

## Advanced Usage

### Try it with your own inputs
```javascript
import Joi from 'joi'
import { JoifulForm, JoifulInput } from 'joiful-react-forms'

const FormWithCustomInputs = () =>
    <JoifulForm
        onSubmit={handleSubmit}
        schema={{
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().min(10).max(12)
        }}
    >
        <JoifulInput
            is="customInputType" // is defaults to "text"
            name="name"
            placeholder="Name"
        />
        <JoifulInput
            is="customInputType"
            name="email"
            type="email"
            placeholder="Email"
        />
        <JoifulInput
            is="customInputType"
            name="phone"
            placeholder="Phone"
        />
    </JoifulForm>

const MyCustomInput = ({ error, ...props }) =>
    <div>
        <input {...props}/>
        {error}
    </div>

class default App extends Component {

    static childContextTypes = {
        joifulReactForms: PropTypes.object
    };

    getChildContext() {
        return {
            joifulReactForms: {
                JoifulInput: {
                    types: {
                        // text: MyCustomInput // JoifulInput is="text" is default
                        customInputName: MyCustomInput
                    }
                }
            }
        }
    }

    render() {
        return <FormWithCustomInputs/>
    }
}

```
