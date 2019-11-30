# Start Scouting

```
mutation {
  startScouting(input: {
    userId: "054cb265-b527-4983-a4fd-db0abb8dc07d",
    characterId: "69e305da-3e22-43b3-84c4-669275caac31"
		targetId: "WB-Kazzak",
    startTime: 1574992818
  }) {
    _id
    name
    scouting {
      name
    }
  }
}
```

# Get Scouts for boss/bosses
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

# Get Character's current Scouting Target
```
{
  characters {
    _id
    name
    owner {
      name
    }
    scouting {
      target {
        name
      }
      startTime
      stopTime
    }
  }
}

```