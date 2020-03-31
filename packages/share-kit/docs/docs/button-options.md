---
id: button-options
title: Button Options
hide_title: true
---

# ButtonOptions

:::note Note
This is only used with the rendered button and not the QR code.
:::

Rendering options for the rendered button.

| Name              | Description                                                        | Type                 | Required | Default   |
| ----------------- | ------------------------------------------------------------------ | -------------------- | -------- | --------- |
| buttonCallbackUrl | The url the user will be sent back to after they share their data. | `string`             | Y        | N/A       |
| size              | The size of the button                                             | `'sm' | 'md' | 'lg'` | N        | 'lg'      |
| type              | The type of button, based on the given `size`                      | See below            | N        | See below |

## ButtonType

The type of button to rendered based on it's size

| Size | Type                                                        | Required | Default  |
| ---- | ----------------------------------------------------------- | -------- | -------- |
| sm   | `'square' \| 'rounded-square' \| 'circle' \| 'squircle'`    | Y        | N/A      |
| md   | `'log-in' \| 'sign-up' \| 'connect' \| 'bloom' \| 'verify'` | N        | 'verify' |
| lg   | `'log-in' \| 'sign-up' \| 'connect' \| 'bloom' \| 'verify'` | N        | 'verify' |

## Example

- Small:

  - Square

    ![small sqaure](https://github.com/hellobloom/vc/raw/master/assets/share-kit/buttons/small/square.png)

  - Rounded Square

    ![small rounded-sqaure](https://github.com/hellobloom/vc/raw/master/assets/share-kit/buttons/small/rounded-square.png)

  - Circle

    ![small circle](https://github.com/hellobloom/vc/raw/master/assets/share-kit/buttons/small/circle.png)

  - Squircle

    ![small squircle](https://github.com/hellobloom/vc/raw/master/assets/share-kit/buttons/small/squircle.png)

- Small Inverted:

  - Small buttons can have thier foreground and background colors swaped with the `invert` flag

    ![small inverted buttons](https://github.com/hellobloom/vc/raw/master/assets/share-kit/buttons/small/inverted.png)

- Medium:

  - Log In

    ![medium log-in](https://github.com/hellobloom/vc/raw/master/assets/share-kit/buttons/medium/log-in.png)

  - Sign Up

    ![medium sign-up](https://github.com/hellobloom/vc/raw/master/assets/share-kit/buttons/medium/sign-up.png)

  - Connect

    ![medium connect](https://github.com/hellobloom/vc/raw/master/assets/share-kit/buttons/medium/connect.png)

  - Bloom

    ![medium bloom](https://github.com/hellobloom/vc/raw/master/assets/share-kit/buttons/medium/bloom.png)

  - Verify

    ![medium verify](https://github.com/hellobloom/vc/raw/master/assets/share-kit/buttons/medium/verify.png)

- Large:

  - Log In

    ![large log-in](https://github.com/hellobloom/vc/raw/master/assets/share-kit/buttons/large/log-in.png)

  - Sign Up

    ![large sign-up](https://github.com/hellobloom/vc/raw/master/assets/share-kit/buttons/large/sign-up.png)

  - Connect

    ![large connect](https://github.com/hellobloom/vc/raw/master/assets/share-kit/buttons/large/connect.png)

  - Bloom

    ![large bloom](https://github.com/hellobloom/vc/raw/master/assets/share-kit/buttons/large/bloom.png)

  - Verify

    ![large verify](https://github.com/hellobloom/vc/raw/master/assets/share-kit/buttons/large/verify.png)
