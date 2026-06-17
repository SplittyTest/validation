# Splitty Test Form Validation

This is a validation library for Vue 3 that is both simple but powerful.

## Install

Install with NPM:

```
$ npm install @splitty-test/validation
```

## Usage

Using Composition API...

In the script:

```ts
<script setup>
import { ref } from 'vue';
import { FieldValidation, useFormValidator, rules } from '@splitty-test/validation';

const login_form_validator = useFormValidator();
const email = ref('');
const password = ref('');

async function handleFormSubmit() {
    // Validate the form fields
    const is_valid = await login_form_validator.validate();

    if (is_valid) {
        // DO THE REST OF THE FORM SUBMIT STUFF
    }
}

export {
    email,
    password,
    rules,
    handleFormSubmit
}
</script>
```

In the template:

```html
<template>
    <div class='login-form'>
        <div class='email-field'>
            <FieldValidation name="email" :value="email" :validator="login_form_validator" :rules="[rules.required, rules.email]">
                <input name="email" v-model="email">
            </FieldValidation>
        </div>
        <div class='password-field'>
            <FieldValidation name="password" :value="password" :validator="login_form_validator" :rules="[rules.required]">
                <input name="password" v-model="password">
            </FieldValidation>
        </div>
        <div class='submit-button'>
            <input type="button" @click="handleFormSubmit()">Login</input>
        </div>
    </div>
</template>
```

### FieldValidation Component Properties

- **name (String) - Required:** A unique name for the field that is used intenally to reference the field being validated.
- **:value (any) - Required:** The value that is being validated.
- **group (String):** A group name for validating subsets of fields.
- **validator (FormValidator) - Required:** The instance of the FormValidator that the field is attached to.
- **rules (Rule[]): - Conditionally Required** Rules are a list of functions used to validated the value in the v-model. It is only required on the FieldValidation component if they weren't defined when creating the FormValidator.
- **el (String):** The HTML element in the slot that you want validation triggers applied to. The string should be a selector. For instance, if you want to use a PrimeVue `Select` component inside the validator, you should set `el=".p-select-label"`

### Making Custom Rules

Each rule is a simple function that takes the v-model value as the first argument and returns an error message string if there is an issue or `null` if the value passes validation. If a string message is returned, it will be added to the errors array. You can create custom rules with arguments as long as the function then returns a function with the value passed as the first argument. Make sure you are passing the rule definition (without parenthesis) to the rules array. You can use async functions as well.

Example:

```ts
<script setup>
// The value has to equal 'foo'
function myCustomRule(value: string) {
    if (value !== 'foo') {
        return 'The value MUST equal foo!';
    }
    return null;
}

// The value must be with a range
function myCustomRuleWithArguments(min: number, max: number) {
    return (value: number) => {
        if (value < min || value > max) {
            return `The value must be between ${min} and ${max}`;
        }
        return null;
    };
}

export {
    myCustomRule,
    myCustomRuleWithArguments
}
</script>
```

Then in the template:

```html
<FieldValidation name="pity" :value="who_do_i_pity" :validator="myValidator" :rules="[myCustomRule]">...</FieldVaidation>
<FieldValidation name="age" :value="age" :validator="myValidator" :rules="[myCustomRuleWithArguments(18, 50)]">...</FieldVaidation>
```
