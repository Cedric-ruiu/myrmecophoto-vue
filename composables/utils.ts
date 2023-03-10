export const reverseString = (email: string): string => {
  return email.split('').reverse().join('')
}

export const encryptEmail = (email: string): string => {
  return reverseString(email)
}

export const decryptEmail = (email: string): string => {
  return reverseString(email)
}
