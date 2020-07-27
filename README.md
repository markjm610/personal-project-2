# [Chart Your Cash](https://chart-your-cash.herokuapp.com/)

Click "Continue" and demo user information will be filled in by default

## What is Chart Your Cash?

Chart Your Cash is a financial planner that shows a complete picture of a user's financial information on one interactive graph

## Code Highlight
### Subtracting a monthly expense, accounting for different amounts of days in each month
```javascript
const day = dateObj.getDate()

let monthsPassed = 0
let currentMonth = dateObj.getMonth()
let foundDayInMonth = false
// Iterate over each day in plan, starting with first day of expense
for (let i = firstDayIndex; i < graphDataArr.length; i++) {

    // If currentMonth does not match the current day's month, it is a new month, so reassign currentMonth and reset foundDayInMonth to false
    if (graphDataArr[i].x.getMonth() !== currentMonth) {
        currentMonth = graphDataArr[i].x.getMonth()
        foundDayInMonth = false
    }
    
    // If the month and day both match, the day to subtract the expense from has been found, so increment monthsPassed and set foundDayInMonth to true
    if (graphDataArr[i].x.getMonth() === currentMonth && graphDataArr[i].x.getDate() === day) {
        monthsPassed++
        foundDayInMonth = true;
    }
    
    // If the last day of the month is reached (month of current day is not equal to month of next day) and the day to look for hasn't been found, that means the day to look for is after the last day of the current month, so increment the months passed on that day instead. For example, if you are looking for the 31st and a month only has 30 days, you will reach the 30th with foundDayInMonth still being false, so you want to increment the month on the 30th. The same goes for February.
    if (graphDataArr[i + 1] && graphDataArr[i].x.getMonth() !== graphDataArr[i + 1].x.getMonth() && !foundDayInMonth) {
        monthsPassed++
    }
    
    // The graph displays a running total of money, so the expense gets subtracted every day, but is multiplied by the amount of months passed, so the amount that gets subtracted from each day gets increased every month.
    graphDataArr[i].y -= (amount * monthsPassed)
}
```

## Developed By

[Mark Mansolino](https://markjm610.github.io/) ([GitHub](https://github.com/markjm610) | [LinkedIn](https://www.linkedin.com/in/markmansolino/) | [AngelList](https://angel.co/u/mark-mansolino))

## Technologies

- React
- JavaScript
- Express
- MongoDB
- Node

## Third-Party APIs

- Auth0
- Material-UI
- React-Vis
- React-DnD
