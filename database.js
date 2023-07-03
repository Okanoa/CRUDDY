
// this database is not general purpose and is specifically for doing what it needs to.
// also note that this is not a good implementation of a database, but it does function.
// this database will slowdown based on the amount of users and how many items a user has.

// note due to the small size of the database and that it is not a table based system 
// there is no need for Id or UserId and I simply store a users items inside of the user.

const fs = require('fs');

class User {
	// id = 0;
	name = {
		user: "",
		first: "",
		last: ""
	};

	items = [];
	password = "";

	constructor(username, firstname, lastname, hashed_password) {
		this.name = {
			user: username,
			first: firstname,
			last: lastname
		};

		this.password = hashed_password;
	}

	// no need for a getItem function just do user.items

	setItem(ind, name, description, quantity) {
		this.items[ind] = {
			name: name,
			description: description,
			quantity: quantity
		};
	}

	// simple append
	newItem(name, description, quantity) {
		this.setItem(this.items.length, name, description, quantity)
	}

	// a not so useful wrapper.
	delItem(ind) {
		this.items.splice(ind, 1)
	}

	serialize() {
		const json_out = JSON.stringify(this);
		fs.writeFileSync(`./users/${this.name.user}.json`, json_out)
	}

	deserialize(username) {
		const data = fs.readFileSync(`./users/${username}.json`);
		const obj = JSON.parse(data);

		this.name = {
			user: obj.name.user,
			first: obj.name.first,
			last: obj.name.last
		};

		this.password = obj.password;
		this.items = obj.items;
	}
}

const usernameExists = (username) => {
	return fs.existsSync(`./users/${username}.json`);
}

const getUser = (username) => {
	if (usernameExists(username)) {
		let user_instance = new User();
		user_instance.deserialize(username);
		return user_instance;
	}
}

/// true on user creation and undefined on unable to do so.
const newUser = (username, firstname, lastname, hashed_password) => {
	if (!usernameExists(username)) {
		let user_instance = new User(username, firstname, lastname, hashed_password);
		user_instance.serialize();
		return true;
	}
}

module.exports = {
	DB: () => {
		return {
			newUser: newUser,
			getUser: getUser
		}
	}
}