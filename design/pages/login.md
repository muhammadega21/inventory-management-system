# Login Page

**Route**: `/login`  
**Component**: `client/src/pages/LoginPage.tsx`

## Overview

Authentication entry point for inventory management users.

## Layout

- Centered authentication card
- Application logo and name
- Email input
- Password input with show/hide control
- Remember me checkbox
- Login button
- Forgot password link (future)

## Behavior

1. Validate credentials with Zod and React Hook Form.
2. Submit through `useLogin()`.
3. Show spinner while request is pending.
4. Display API error using standard alert utility.
5. Redirect authenticated user to `/`.

## States

- Initial form
- Validation error
- Invalid credentials
- Loading
- Successful login

## Accessibility

- Labels associated with inputs
- Enter submits form
- Focus returns to first invalid input
- Password visibility control has accessible label
