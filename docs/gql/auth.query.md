# Login
```
mutation {
  login(
    auth: {
      name: "Manlet",
      token: "<auth token>"
    }
  ) {
    _id
    authorized
    name
    role
  }
}


```

# Get User by ID
```
{
  users {
    _id
    name
    role
  }
}
```

# Get All Users
```
{
  users {
    _id
    name
    role
  }
}
```
