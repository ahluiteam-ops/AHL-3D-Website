import { useId, useState } from 'react'
import { ArrowUpRight, CircleCheck } from 'lucide-react'
import { useReveal } from '../hooks'
import { formAction, formCities, formDone, formTitle } from '../site'

type Fields = { name: string; phone: string; city: string }
type Errors = Partial<Record<keyof Fields, string>>

const EMPTY: Fields = { name: '', phone: '', city: '' }

/** Indian mobile numbers are ten digits; the field accepts the spaces, dashes
 *  and +91 people actually type and counts what is left. */
function digits(value: string) {
  return value.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
}

function validate(values: Fields): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 2) errors.name = 'Please tell us your name.'
  if (digits(values.phone).length !== 10)
    errors.phone = 'A 10-digit mobile number, so a consultant can call you.'
  if (!values.city) errors.city = 'Pick the city nearest you.'
  return errors
}

/**
 * "Fill This Form To Get The Right Guidance".
 *
 * Deliberately the one section on the page with no perspective on it. A form
 * is the only place a visitor has to be accurate, and tilting the surface
 * someone is typing into makes the target move under the pointer — depth here
 * costs more than it buys. What it gets instead is the interaction that
 * matters in a form: a lit field on focus, validation that waits until you
 * have finished a field rather than scolding you while you type, errors tied
 * to their input by `aria-describedby`, and a settled success state.
 *
 * Fields are validated on blur once, and on every change afterwards, so the
 * error clears as soon as it is fixed rather than at the next submit.
 *
 * ⚠ There is no backend. Submitting shows the success state and nothing is
 * sent anywhere; see §7 of PROJECT-CONTEXT.
 */
export function Form() {
  const { ref, shown } = useReveal<HTMLDivElement>()
  const id = useId()
  const [values, setValues] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [done, setDone] = useState(false)

  const set = (field: keyof Fields, value: string) => {
    const next = { ...values, [field]: value }
    setValues(next)
    if (touched[field]) setErrors(validate(next))
  }

  const blur = (field: keyof Fields) => {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors(validate(values))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    setTouched({ name: true, phone: true, city: true })
    if (Object.keys(found).length === 0) setDone(true)
  }

  const field = (key: keyof Fields) => ({
    id: `${id}-${key}`,
    'aria-invalid': errors[key] && touched[key] ? true : undefined,
    'aria-describedby': errors[key] && touched[key] ? `${id}-${key}-error` : undefined,
    onBlur: () => blur(key),
  })

  return (
    <section className="form" aria-labelledby="form-title">
      <div className="form__in wrap" data-shown={shown ? 'true' : 'false'} ref={ref}>
        <h2 className="form__title" id="form-title">
          {formTitle.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <div className="form__card">
          {done ? (
            <div className="form__done" role="status">
              <CircleCheck size={30} strokeWidth={1.8} aria-hidden="true" />
              <h3>{formDone.title}</h3>
              <p>{formDone.body}</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="form__row" data-error={errors.name && touched.name ? 'true' : 'false'}>
                <label htmlFor={`${id}-name`}>Name</label>
                <input
                  {...field('name')}
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Full Name"
                  value={values.name}
                  onChange={(e) => set('name', e.target.value)}
                />
                {errors.name && touched.name ? (
                  <p className="form__error" id={`${id}-name-error`}>
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className="form__row" data-error={errors.phone && touched.phone ? 'true' : 'false'}>
                <label htmlFor={`${id}-phone`}>Phone Number</label>
                <input
                  {...field('phone')}
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="(123)-456 7890"
                  value={values.phone}
                  onChange={(e) => set('phone', e.target.value)}
                />
                {errors.phone && touched.phone ? (
                  <p className="form__error" id={`${id}-phone-error`}>
                    {errors.phone}
                  </p>
                ) : null}
              </div>

              <div className="form__row" data-error={errors.city && touched.city ? 'true' : 'false'}>
                <label htmlFor={`${id}-city`}>City</label>
                <div className="form__select">
                  <select
                    {...field('city')}
                    name="city"
                    value={values.city}
                    onChange={(e) => set('city', e.target.value)}
                  >
                    <option value="">Please select</option>
                    {formCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.city && touched.city ? (
                  <p className="form__error" id={`${id}-city-error`}>
                    {errors.city}
                  </p>
                ) : null}
              </div>

              <button type="submit" className="btn btn--lg form__submit">
                {formAction}
                <ArrowUpRight
                  className="btn__arrow"
                  size={16}
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
