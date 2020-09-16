# Submit Form

Submit form data asynchronous

## Install

`npm i submit-form-data`

## Usage

```javascript
import submitFormData from 'submit-form-data'

const form = document.querySelector('.form')

const settings = {
	dest: 'process_data.php',
	fields: '.field',
	reciever: 'hello@world-mail.com',
	extraData: {
		foo: 'bar',
	},
}

form.addEventListener('submit', async e => {
	e.preventDefault()

	try {
		const { data } = await submitFormData(form, settings)

		console.log(data)
	} catch (error) {
		const { data, valid } = error

		if (valid) {
			// connection error
			console.log(data.error)
		} else {
			// invalid form field
			console.log(data.field)
		}
	}
})
```

```html
<form class="form">
	<input type="text" class="field" />
	<input type="email" class="field" />
	<textarea class="field"></textarea>

	<input type="submit" value="send" />
</form>
```

## Options (\* required)

| Option     | Type    | Deafult | Description                                       |
| ---------- | ------- | ------- | ------------------------------------------------- |
| dest\*     | String  | -       | Path to file to precess data                      |
| fields\*   | String  | -       | Class name of inputs to send                      |
| reciever   | String  | null    | Email that can be later processed in the back-end |
| urlencoded | Boolean | false   | It will send data url-encoded                     |
| extraData  | Object  | null    | object with extra data to append to form data     |

## Returns: Object

| Property | Type    | Description                                                                                   |
| -------- | ------- | --------------------------------------------------------------------------------------------- |
| ok       | Boolean | true if the server was reached succesfuly                                                     |
| valid    | Boolean | returns false if any field in the form is invalid                                             |
| data     | Object  | returns sent data back. If _ok: false_ returns error. If _valid: false_ returns invalid field |

## Back-end example

```php
<?php

   $data = $_POST;

   $name = $data['name'];
   $email = $data['email'];
   $message = $data['message'];

   // extra data
   $foo = $data['foo']

   $dest = isset( $data['dest'] )
      ? $data['dest']
      : 'hello@world-mail.com';

   $headers = 'From: '. $name .'<'. $email .'>'. "\r\n";
   $headers .= 'X-Mailer: PHP5'. "\n";
   $headers .= 'MIME-Version: 1.0'. "\n";
   $headers .= 'Content-type: text/html; charset=UTF-8'. "\r\n";

   $subject = 'Contact message from '. $name;

   $body = 'Name: '. $name .'<br/>'
   $body .= 'Email: '. $email .'<br/>'
   $body .= 'Message: '. $message;

   mail($dest, '=?UTF-8?B?'. $subject .'?=', $body, $headers);

```
