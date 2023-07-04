module.exports = (logged_in, user, owner) => {

  let inventory = ''

  const truncText = (text, limit = 100) => {

    if (text.length > limit) {
      text = text.substr(0, limit) + '...';
    }
    return text;
  }

  console.log(logged_in, owner)

  if (logged_in && owner ) {
    inventory += `
    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">Welcome back, ${user.name.first} ${user.name.last}!</h5>
        <a href="/${user.name.user}/new" class="card-link">New Item</a>
      </div>
    </div>
    `;
  }
  // new item element button here please
  let itemCount = user.items.length
  
  user.items.reverse()
    .forEach((item) => {
      itemCount -= 1;
      inventory += `
      <div class="card mb-2">
        <div class="card-body">
          <h5 class="card-title"><span class="badge rounded-pill text-bg-primary">${item.quantity}</span> ${item.name}</h5>
          <p>${truncText(item.description)}</p>
          <a href="/${user.name.user}/${itemCount}" class="card-link">View</a>
        </div>
      </div>
    `;
    });


  return `
    ${inventory}
`;
}