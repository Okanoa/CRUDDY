module.exports = (logged_in, username) => {

  let conditional = '<a href="/login">Login</a>';
  let inventory = ''

  if (logged_in) {
    conditional = '<a href="" hx-delete="/logout">Logout</a>';
    inventory = `<a href="/${username}">Inventory</a>`
  }

  return `
    ${conditional}
    ${inventory}
`;
}