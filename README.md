# Exam 3 - Accessible Form Toolkit (useRef, useState)

Run: `npm install` then `npm run dev`.

## Completed requirements
- Controlled name, email, and password inputs (`useState`).
- Three refs, each attached with the `ref` attribute.
- Validation: name required, email structure checked, password at least 8 characters. Each invalid field shows a message (`role="alert"`, `aria-invalid`, `aria-describedby`).
- After a failed submit, focus moves to the first invalid field in the order name, email, password.
- The previous submitted email is kept in a ref (`lastEmailRef`), updated in the submit handler without causing a render.
  It is shown after the next successful submission (the old value is copied into success state inside the handler).

## Debugging case
Displaying `clicks.current` does not update because mutating `ref.current` does not schedule a re-render; React only re-renders on state changes.
Data shown in the UI belongs in state (`const [clicks, setClicks] = useState(0)`), as in the Click counter demo.

## Restriction check
`ref.current` is read or written only inside the submit handler. Nothing reads it during rendering.

## Known limitations
- Email validation is a simple structure check, not a full RFC check.
- Nothing is sent to a server; submission only shows a confirmation.

## Test steps
1. Submit empty: three messages, focus on Name.
2. Fill name only and submit: focus goes to Email. Fix email only: focus goes to Password.
3. Submit valid data (password 8+ characters): success message says previous email is "none".
4. Submit a second valid email: message shows the first email as the previous one.
