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

const MyTextInput = ({ error, ...props }) =>
    <div>
        <input {...props}/>
        {error}
    </div>


const FormUsingMyInputs = () =>
    <JoifulForm
        elementTypes={{
            text: MyTextInput,
            select: ...,
            textarea: ...
        }}
        onSubmit={handleSubmit}
        schema={{
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().min(10).max(12)
        }}
    >
        <JoifulInput
            is="text"
            name="name"
            placeholder="Name"
        />
        <JoifulInput
            name="email"
            type="email"
            placeholder="Email"
        />
        <JoifulInput
            name="phone"
            placeholder="Phone"
        />
    </JoifulForm>

```
