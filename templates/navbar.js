module.exports = (logged_in, username) => {

  let conditional = '<a class="btn btn-outline-primary" role="button" aria-disabled="true" href="/login">Login</a>';
  let inventory = ''

  if (logged_in) {
    conditional = '<a class="btn btn-outline-primary me-2" role="button" aria-disabled="true" href="" hx-delete="/logout">Logout</a>';
    inventory = `<a class="btn btn-outline-primary me-2" role="button" aria-disabled="true" href="/${username}">Inventory</a>`
  }

  return `
    ${conditional}
    ${inventory}
`;
}