# roll-call-bot
A simple roll call bot for telegram. It can help you with creating and managing roll calls in the Group Chats.

To get started, simply add the bot to your telegram Group Chat. Group Chat administrator can contact the bot in direct messages and set up the roll call schedule.

### Constraints:
* The bot will handle roll calls only on weekdays, currently, this is hardcoded in the cron job definition.
* The bot will let you set up roll calls only between 8 AM and 12 PM, currently, this is hardcoded too.
* The bot consumes the timezone of your local machine, to change this and set a specific time zone, set TZ environment variable to any time zone of tz database time zones. Full list of tz database timeszones: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

### Prerequisites:
* Node.js v.12
* Setup environment variables

### Run bot:
Set environment variables
```
$ setx ROLL_CALL_BOT_TOKEN <your telegram bot token>
$ setx ROLL_CALL_BOT_CONNECTION_STRING <path to your .sqlite database file>
```

Run
```
$ npm install
$ npm run start
```

### Run bot with docker:
Add a **bot.env** file to the **./config** folder, example:
```
$ cat bot.env
ROLL_CALL_BOT_TOKEN=<your telegram bot token>
```
Add a **node.env** file to the **./config** folder, example:
```
$ cat node.env
TZ=<tz database time zone>
NODE_ENV=production
```

Run
```
$ docker-compose up
```
