import { useRef, useState } from 'react';

const FIELDS = ['name', 'email', 'password']; // focus order
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { name: '', email: '', password: '' };

function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = 'Name is required.';
  if (!EMAIL_RE.test(v.email.trim())) errors.email = 'Enter a valid email such as name@example.com.';
  if (v.password.length < 8) errors.password = 'Password must be at least 8 characters.';
  return errors;
}

// FIXED debugging case: visible data lives in state, so changing it schedules a render.
function ClickCounter() {
  const [clicks, setClicks] = useState(0);
  return (
    <div className="row">
      <button className="secondary" onClick={() => setClicks((c) => c + 1)}>Count click</button>
      <span>Clicks: {clicks}</span>
    </div>
  );
}

export default function App() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const refs = { name: nameRef, email: emailRef, password: passwordRef };
  const lastEmailRef = useRef(''); // previous submitted email; changing it never renders

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setSuccess(null);

    const firstInvalid = FIELDS.find((f) => found[f]);
    if (firstInvalid) {
      refs[firstInvalid].current.focus(); // ref used in an event handler, not during render
      return;
    }

    const previous = lastEmailRef.current;
    lastEmailRef.current = values.email.trim();
    setSuccess({ email: values.email.trim(), previous });
    setValues(EMPTY);
  };

  const field = (name, label, type) => (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        id={name} name={name} type={type} ref={refs[name]}
        value={values[name]} onChange={handleChange}
        aria-invalid={errors[name] ? 'true' : 'false'}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        autoComplete="off" style={{ width: '100%' }}
      />
      {errors[name] && <p id={`${name}-error`} className="err" role="alert">{errors[name]}</p>}
    </>
  );

  return (
    <main>
      <h1>Accessible Form Toolkit</h1>
      <form className="card" onSubmit={handleSubmit} noValidate>
        {field('name', 'Name', 'text')}
        {field('email', 'Email', 'email')}
        {field('password', 'Password', 'password')}
        <p><button type="submit">Register</button></p>
        {success && (
          <p className="ok" role="status">
            Registered {success.email}. Previous submitted email: {success.previous || 'none'}.
          </p>
        )}
      </form>
      <section className="card">
        <h2>Debugging case</h2>
        <p className="muted">Visible click count stored in state (not clicks.current).</p>
        <ClickCounter />
      </section>
    </main>
  );
}
