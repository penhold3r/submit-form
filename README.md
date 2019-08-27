# Submit Form

Submit form data asynchronous

## Instalation

`npm i submit-form-data`

## Usage

```javascript
import { submitFormData } from 'submit-form-data'

const form = document.querySelector('.form')

const settings = {
	dest: 'process_data.php',
	fields: '.field',
	successMsg: 'Message sent!',
	errorMsg: 'There was an error',
	sending: 'Sending message...',
	reciever: 'hello@world-mail.com'
}

submitFormData(form, settings)
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

| Option     | Type    | Deafult      | Description                                                                  |
| ---------- | ------- | ------------ | ---------------------------------------------------------------------------- |
| dest\*     | String  | -            | Path to file to precess data                                                 |
| fields\*   | String  | -            | Class name of inputs to send                                                 |
| successMsg | String  | "ok"         | Confirmation message to display                                              |
| errorMsg   | String  | "error"      | Error message to display                                                     |
| sending    | String  | "sending..." | Message to display while sending                                             |
| reciever   | String  | null         | Email that can be later processed in the back-end                            |
| closeMsg   | Boolean | false        | Will create a div with a "&times;" that when clicked it removes the messages |
| urlencoded | Boolean | false        | It will send data url-encoded                                                |

## Back-end example

```php
<?php

   $data = $_POST;

   $name = $data['name'];
   $email = $data['email'];
   $message = $data['message'];

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
