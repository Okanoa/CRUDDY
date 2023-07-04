module.exports = (msg) => {

  let conditional = ''

  if (msg) {
    conditional = `<p>${msg}</p>`
  }

  return `
  <h3>Register</h3>
  ${conditional}
  <form action="/register" method="post">
    <div class="mb-3">
      <label class="form-label">Username</label>
      <input type="username" name="username" class="form-control" >
    </div>
    <div class="mb-3">
      <label class="form-label">Firstname</label>
      <input type="text" name="firstname" class="form-control" >
    </div>
    <div class="mb-3">
      <label class="form-label">Lastname</label>
      <input type="text" name="lastname" class="form-control" >
    </div>
    <div class="mb-3">
      <label class="form-label">Password</label>
      <input type="password" name="password" class="form-control" >
    </div>

    <button type="submit" class="btn btn-outline-primary">Submit</button>
    <a class="btn btn-link" href="/login">Login</a>

  </form>
`;
}