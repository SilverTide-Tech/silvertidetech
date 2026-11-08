import { useEffect, useId, useRef, useState, type ComponentProps } from 'react';

interface Topic {
  value: string;
  label: string;
}

interface Props {
  topics: ReadonlyArray<Topic>;
}

type Field = 'name' | 'email' | 'topic' | 'message';
type Errors = Partial<Record<Field, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (!data.name.trim()) errors.name = 'Please enter your name.';
  if (!data.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL.test(data.email.trim())) errors.email = 'Please enter a valid email address, like name@example.com.';
  if (!data.topic) errors.topic = 'Please choose a topic.';
  if (data.message.trim().length < 10) errors.message = 'Please write a message of at least 10 characters.';
  return errors;
}

/**
 * Contact form (architecture §6.3, Form template). Accessible labels, inline errors and an error summary.
 * Delivery is NOT connected yet: no form endpoint has been chosen (architecture §9). Submitting a valid
 * form says so plainly instead of pretending the message was sent.
 */
export default function ContactForm({ topics }: Props) {
  const uid = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'not-connected'>('idle');
  const [topic, setTopic] = useState('');
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Preselect a topic from ?topic= (e.g. links from Careers). Topic values are not personal data.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('topic');
    if (requested && topics.some((t) => t.value === requested)) setTopic(requested);
  }, [topics]);

  const onSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      topic: String(form.get('topic') ?? ''),
      message: String(form.get('message') ?? ''),
    };
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus('idle');
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus('not-connected');
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const id = (f: Field) => `${uid}-${f}`;
  const describedBy = (f: Field, hint?: string) => [errors[f] ? `${id(f)}-error` : '', hint ?? ''].filter(Boolean).join(' ') || undefined;
  const inputClass = (f: Field) =>
    `mt-2 block w-full rounded-[var(--radius-btn)] border bg-white px-4 py-3 text-base text-navy-900 placeholder:text-ink-500 transition-colors focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
      errors[f] ? 'border-[#B42318]' : 'border-silver-300 hover:border-ink-500'
    }`;
  const errorText = (f: Field) =>
    errors[f] ? (
      <p id={`${id(f)}-error`} className="mt-2 text-sm font-medium text-[#B42318]">
        {errors[f]}
      </p>
    ) : null;
  const errorList = Object.entries(errors) as Array<[Field, string]>;

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-6" aria-describedby={`${uid}-required`}>
      <p id={`${uid}-required`} className="text-sm text-ink-500">
        All fields are required.
      </p>

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-[var(--radius-btn)] border border-[#B42318] bg-[#FEF3F2] p-4 text-sm text-[#7A271A] focus:outline-none">
          <p className="font-semibold">Please fix {errorList.length === 1 ? 'this' : `these ${errorList.length}`} before sending:</p>
          <ul className="mt-2 list-disc pl-5">
            {errorList.map(([f, msg]) => (
              <li key={f}>
                <a href={`#${id(f)}`} className="underline underline-offset-2">
                  {msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={id('name')} className="font-medium text-navy-900">
            Your name
          </label>
          <input id={id('name')} name="name" type="text" autoComplete="name" className={inputClass('name')} aria-invalid={!!errors.name} aria-describedby={describedBy('name')} />
          {errorText('name')}
        </div>
        <div>
          <label htmlFor={id('email')} className="font-medium text-navy-900">
            Your email
          </label>
          <input id={id('email')} name="email" type="email" autoComplete="email" inputMode="email" className={inputClass('email')} aria-invalid={!!errors.email} aria-describedby={describedBy('email')} />
          {errorText('email')}
        </div>
      </div>

      <div>
        <label htmlFor={id('topic')} className="font-medium text-navy-900">
          How can we help?
        </label>
        <select
          id={id('topic')}
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={`${inputClass('topic')} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 10 10'%3E%3Cpath d='M1.5 3.5 5 7l3.5-3.5' fill='none' stroke='%23475467' stroke-width='1.6' stroke-linecap='round'/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10`}
          aria-invalid={!!errors.topic}
          aria-describedby={describedBy('topic')}
        >
          <option value="">Choose a topic</option>
          {topics.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {errorText('topic')}
      </div>

      <div>
        <label htmlFor={id('message')} className="font-medium text-navy-900">
          Your message
        </label>
        <textarea id={id('message')} name="message" rows={6} className={`${inputClass('message')} resize-y`} aria-invalid={!!errors.message} aria-describedby={describedBy('message')} />
        {errorText('message')}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2.5 rounded-[var(--radius-btn)] bg-navy-900 px-[22px] text-[0.9375rem] font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Send message
        </button>
      </div>

      <div ref={statusRef} tabIndex={-1} role="status" className="focus:outline-none">
        {status === 'not-connected' && (
          <div className="rounded-[var(--radius-btn)] border border-status-dev-bg bg-status-dev-bg p-4 text-sm text-status-dev">
            <p className="font-semibold">Thank you. Online messages aren’t connected yet.</p>
            <p className="mt-1">Your message has not been sent. This form will start delivering messages once our contact service is set up.</p>
          </div>
        )}
      </div>
    </form>
  );
}
