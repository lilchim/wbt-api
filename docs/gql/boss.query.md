# Get Boss by ID
```
{
  boss(_id: "WB-Kazzak") {
    _id
    name
    scouts {
      name
    }
  }
}

```

# Get All Bosses
```
{
  bosses {
    _id
    name
    lastKilled
    scouts {
      name
    }
  }
}
```

# Spawn Boss
```
mutation {
  spawnBoss(_id: "WB-Kazzak") {
    _id
    name
    alive
  }
}
```

# Kill Boss
```
mutation {
    reportKill(_id: "WB-Kazzak", timeOfDeath: 1574956264) {
        _id
        name
        alive
    }
}
```