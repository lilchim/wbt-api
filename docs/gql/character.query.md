# Get Character by ID
Gets a single character by ID

Parameters:
- `_id` The ID of the character
```
{
  character (_id: "69e305da-3e22-43b3-84c4-669275caac31") {
    _id
    name
    owner {
      name
      role
    }
  }
}
```

# Get All Characters
Gets all characters. Should accept a filter at some point.
```
{
  characters {
    _id
    name
    owner {
      name
    }
  }
}
```


# Update Character
Updates or Inserts a new character.

Parameters: 
- `owner` The owning User by ID
- `name` The name of the character
- `guild` The Guild of the character
- `characterClass` The class of the character by CharacterClass Enum
```
mutation {
  upsertCharacter(
    character: {
      owner: "054cb265-b527-4983-a4fd-db0abb8dc07d"
      name: "Goshu"
      guild: "Mandate of Heaven"
      characterClass: MAGE
    }
  ) {
    _id
    name
    owner {
      name
    }
    characterClass
  }
}

```

# Get Characters by Owner
The Character service can supply a list of characters owned by a given user.
```
{
  users {
    _id
    name
    role
    characters {
      name
    }
  }
}
```