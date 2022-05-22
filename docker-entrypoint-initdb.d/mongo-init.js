print("Started adding the users.");
db = db.getSiblingDB("admin");
db.createUser({
  user: process.env.dbuser,
  pwd: process.env.dbpwd,
  roles: [{ role: "readWrite", db: "admin" }],
});
print("End adding the user roles.");
