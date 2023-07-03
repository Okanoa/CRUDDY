module.exports = (msg) => {

  let conditional = ''

  if (msg) {
    conditional = `<p>${msg}</p>`
  }
  
  return `
  <h3>Login</h3>
  ${conditional}
  <form action="/login" method="post">
    <input type="text" name="username" />
    <input type="password" name="password" />
    <button type="submit">Submit</button>
  </form>
  <a href="/register">Register</a>
`;
}