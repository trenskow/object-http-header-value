@trenskow/object-http-header-value
----
A small library for encoding objects into HTTP headers.

## Usage

Use the library as the example below.

````javascript
import { decode, encode } from '@trenskow/object-http-header-value';

const headerValue = encode({
	first: 'one',
	second: 'two'
}); // Returns 'First=one; Second=two'

const value = decode(
	'First=one; Second=two'
); // Returns { first: 'one', second: 'two' }
````

## Options

These options are supported.

| Key                 |  Type   | Description                                                  |                     Default                      |    Support    |
| ------------------- | :-----: | ------------------------------------------------------------ | :----------------------------------------------: | :-----------: |
| `keyCasing`         | String  | A string that determines the way the keys are encoded (in string when encoding and object when decoding). Available casing is the same as [@trenskow/caseit](https://github.com/trenskow/caseit). | `http`  when encoding and `camel` when decoding. | Encode/Decode |
| `deliminator.value` | String  | The deliminator used to separate key-value pairs in the HTTP header value. |                       `; `                       | Encode/Decode |
| `deliminator.item`  | String  | The deliminator used to separate multiple objects if an array is provided. |                       `, `                       | Encode/Decode |
| `autoWrap`          | Boolean | Wrap in array when decoding only one item.                   |                     `false`                      |    Decode     |

# License

See license in LICENSE.
