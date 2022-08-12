import Config from "../configs";

export const submitForm = (formData: any) => fetch(Config.POST_FORM_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
