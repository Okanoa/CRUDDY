module.exports = (msg) => {

  let conditional = ''

  if (msg) {
    conditional = `<p>${msg}</p>`
  }

  return `
  <h3>Register</h3>
  ${conditional}
  <form action="/register" method="post">
    <input type="text" name="username" />
    <input type="text" name="firstname" />
    <input type="text" name="lastname" />
    <input type="password" name="password" />
    <button type="submit">Submit</button>
  </form>
  <a href="/login">Login</a>
`;
}