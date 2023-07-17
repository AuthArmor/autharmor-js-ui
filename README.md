# Auth Armor Javascript Client-Side SDK UI

Auth Armor provides a SaaS solution to authenticate your users exclusively using passwordless authentication methods such as WebAuthn, magic links and the proprietary Auth Armor mobile app.

This package provides a flexible and full-featured UI around the [@autharmor/autharmor-js](https://github.com/AuthArmor/autharmor-js) package. It provides a Web Components-based form component that can be used to log in and register users and an interactive client interface that can be used for imperatively launching login or registration requests (such as for two-factor authentication).

This package is designed to work together with [@autharmor/autharmor-js](https://github.com/AuthArmor/autharmor-js). A knowledge of how that package works will be helpful in using this package.

## Installation

This package is available on the NPM registry as `@autharmor/autharmor-js-ui`. You must have the `@autharmor/autharmor-js` package to use it. Use your project's package manager to install both the packages:

```sh
# NPM
npm install @autharmor/autharmor-js @autharmor/autharmor-js-ui

# PNPM
pnpm add @autharmor/autharmor-js @autharmor/autharmor-js-ui

# Yarn
yarn add @autharmor/autharmor-js @autharmor/autharmor-js-ui
```

You can then import the CSS styles from `node_modules/@autharmor/autharmor-js-ui/dist/esm/autharmor-js-ui.css`.

In projects without an NPM package manager, we also serve an IIFE bundle from our CDN which you can load as follows:

```html
<script src="https://cdn.autharmor.com/scripts/autharmor-js/4.0.0-alpha.9/global/autharmor-js.js"></script>
<script src="https://cdn.autharmor.com/scripts/autharmor-js-ui/4.0.0-alpha.9/global/autharmor-js-ui.js"></script>
```

```html
<link
    rel="stylesheet"
    href="https://cdn.autharmor.com/scripts/autharmor-js-ui/4.0.0-alpha.9/global/autharmor-js-ui.css"
/>
```

This module's exports will then be available in the `authArmorUi` global variable. Instead of `import` statements, you can use destructuring:

```js
const { AuthArmorInteractiveClient } = authArmorUi;
```

## Initial Setup

In order to use the functionality offered by this package, you must first create an `AuthArmorClient` instance. That class and the instructions for doing that are part of the [@autharmor/autharmor-js](https://github.com/AuthArmor/autharmor-js).

Once you have your `AuthArmorClient` instance created, you can use the UI in one of two ways (or both, if that suits your use-case).

The code samples assume that you already have an `AuthArmorClient` ready with the name `authArmorClient`.

## Using the Interactive Client

This package provides the `AuthArmorInteractiveClient` class to imperatively create authentication requests. Unlike the `AuthArmorClient` class where everything is done programmatically, this class includes a UI which will be displayed to the user to request their interaction and show them the status of the authentication request.

### Creating an Interactive Client

To create an `AuthArmorInteractiveClient`, pass it your `AuthArmorClient` as the first parameter, and, optionally, an [`IInteractiveClientConfiguration`](./src/config/IAuthArmorInteractiveClientConfiguration.ts) object as the second parameter:

```ts
const authArmorInteractiveClient = new AuthArmorInteractiveClient(authArmorClient, {});
```

> You must import `AuthArmorinteractiveClient` at the top of your file:
>
> ```ts
> import { AuthArmorInteractiveClient } from "@autharmor/autharmor-js-ui";
> ```

### Logging a User In

Then, to log a user in, you can call the `logInAsync` method passing their username:

```ts
const authenticationResult = await authArmorInteractiveClient.logInAsync("username");
```

The user will be prompted to select their log in method (if applicable—i.e., they have more than one available method), and they will then be authenticated using their selected method.

In most cases, the `AuthenticationResult` will be returned to you. This type is part of the [@autharmor/autharmor-js](https://github.com/AuthArmor/autharmor-js) package and you can refer to its documentation to see how you would use that result.

> Auth Armor will not store the authentication state for you. You _must_ pass it to your backend and process it for authentication to be useful.

However, if the nature of the authentication means that the user will not be authenticated on the same session, `null` will be returned instead. Currently, this applies to email magic link authentication: the user will get authenticated on the tab that opens once they click the link in the email, _not_ on the tab where the authentication request originated. The authentication result will be available on the target page as query string parameters in the URL.

### Registering a User

Registering a user is similar and uses the `registerAsync` method:

```ts
const registrationResult = await authArmorInteractiveClient.registerAsync("username");
```

As before, the user will be prompted to select their registration method (provided you have more than one method enabled) and they will then be registered with that method. Either the `RegistrationResult` or `null` will be returned, following the same principles as with logging in.

## Using the Form

Another way you can authenticate users is by rendering the built-in authentication form. This form collects users' usernames to allow them to start login or registration requests themselves and also displays a QR code that they can simply scan with the app to log themselves in.

### Rendering the Form

This form is automatically registered as a web component with the name `autharmor-form`. You can render it somewhere in your markup, and you will need to get a reference to it in your JavaScript code:

```html
<autharmor-form id="myForm"></autharmor-form>
```

```ts
const authArmorForm = document.getElementById("myForm");
```

It is possible to programmatically create it, too:

```html
<div id="myFormContainer"></div>
```

```ts
const authArmorForm = document.createElement("autharmor-form");

const formContainer = document.getElementById("myFormContainer");
formContainer.appendChild(authArmorForm);
```

In either case, you will have a reference to the form in your JavaScript code. You will need to provide the form with your `AuthArmorClient` as the `client` property:

```ts
authArmorForm.client = authArmorClient;
```

Once you set this property, the form will be rendered.

### Providing a Configuration Object

You can optionally provide an [`IInteractiveClientConfiguration`](./src/config/IAuthArmorInteractiveClientConfiguration.ts) object with the `interactiveConfig` property

```ts
authArmorForm.interactiveConfig = {};
```

For example, to customize the UI, you can specify the `uiOptions` object. For example, you can change the form's background color to `#000510` like this:

```ts
authArmorForm.interactiveConfig = {
    uiOptions: {
        form: {
            backgroundColor: "#000510"
        }
    }
};
```

For a list of all properties you can define within the `uiOptions` property, see [IUiOptions.ts](./src/options/IUiOptions.ts).

Similarly, you can customize all the strings that are displayed in the UI by providing an [`ITranslationTable`](./src/i18n/ITranslationTable.ts) object as the `internationalizationOptions.translationTable` property:

```ts
authArmorForm.interactiveConfig = {
    internationalizationOptions: {
        translationTable: { ... }
    }
};
```

For an example translation table, see [`defaultTranslationTable`](./src/i18n/translationTables.ts).

### Properties and Attributes

The following properties and attributes are available on `autharmor-form` components:

| **Property**         | **Attribute**         | **Type**                          | **Default** | **Description**                                                         |
| -------------------- | --------------------- | --------------------------------- | ----------- | ----------------------------------------------------------------------- |
| `client`             | N/A                   | `AuthArmorClient`                 | `null`      | The `AuthArmorClient` to use for communicating with the Auth Armor API. |
| `interactiveConfig`  | N/A                   | `IInteractiveClientConfiguration` | `{}`        | The configuration to use for this interactive client.                   |
| `enableLogIn`        | `enable-log-in`       | `boolean`                         | `true`      | Whether to allow users to log in with this form or not.                 |
| `enableRegistration` | `enable-registration` | `boolean`                         | `true`      | Whether to allow users to register with this form or not.               |
| `enableUsernameless` | `enable-usernameless` | `boolean`                         | `true`      | Whether to display a usernameless QR code for logging in or not.        |
