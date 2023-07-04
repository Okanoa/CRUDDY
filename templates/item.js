module.exports = (mode, api, item, owner, uproute) => {

  switch (mode) {
    case "new":
      return `
      <form action="${api}" method="post">
        <div class="input-group mb-3">
          <input name="name" type="text" class="form-control" placeholder="Name">
          <input name="quantity" type="text" class="form-control" placeholder="Quantity" value="1" >
        </div>

        <div class="mb-3">
          <textarea name="description" class="form-control" ></textarea>
        </div>

        <button type="submit" class="btn btn-outline-primary">Create</button>
      </form>
      `;
      break;
    case "edit":
      return `
      <form action="${api}" method="put">
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="Name" value="${item.name}">
          <input type="text" class="form-control" placeholder="Quantity" value="${item.quantity}" >
        </div>

        <div class="mb-3">
          <textarea name="description" class="form-control">${item.description}</textarea>
        </div>

        <button type="submit" class="btn btn-outline-primary">Save</button>
        <a href="${uproute}" hx-swap="none" class="btn btn-outline-danger">Discard</a>
      </form>
      `;
      break;
    default: // view
      let btn = ''
      if (owner) {
        btn = `
          <button hx-get="${api}/edit" class="btn btn-outline-primary">Edit</button>
          <button hx-swap="none" data-hx-delete="${api}" class="btn btn-outline-danger">Delete</button>
        `
      }
      
      return `
      <form hx-target="this" hx-swap="outerHTML">
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="Name" value="${item.name}" readonly>
          <input type="text" class="form-control" placeholder="Quantity" value="${item.quantity}" readonly>
        </div>

        <div class="mb-3">
          <textarea name="description" class="form-control" readonly>${item.description}</textarea>
        </div>

        ${btn}
      </form>
      `;
      break;
  }

}