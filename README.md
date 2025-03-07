# Choremates Application

Choremate is a web application designed to simplify the management of shared housing/dorming/rooming responsibilities among roommates or friends. It allows users to track and manage their shared expenses, including rent, chores, and groceries, ensuring that everyone stays accountable for their contributions. Using GitHub authentication, users can securely log in and join a specific roommate group through a unique invite code. Once logged in, they can easily add and track expenses, create grocery lists, and settle payments in a hassle-free manner. The application features a playful and engaging experience, complete with animations upon successfully joining a group, making it a fun and interactive tool for managing both financial and chore-related tasks.

In addition to expense tracking, Choremate offers the ability to create and invite roommate groups through an invite code. There is also a user profile on the top right corner that allows the user to see their access code at all times. The application is designed with responsiveness in mind, ensuring a seamless experience across both desktop and mobile platforms. The backend is built using Node.js, with SQLite utilized for database storage. To access the project, the Choremate can be accessed through the live (http://ec2-54-158-172-176.compute-1.amazonaws.com). 

---

## Deployed Link:
[Access the Live Application](http://ec2-54-158-172-176.compute-1.amazonaws.com)

## GitHub Repository:
[Choremates Repository](https://github.com/cs4241-c25/final-project-team-pike)

---

## Technologies Used

This project leverages a variety of technologies to deliver an efficient and robust solution for managing shared household responsibilities:

### Frontend
- **React**: For building dynamic user interface components.
- **Material-UI**: For modern, responsive design and layout.
- **JavaScript**: To create interactive and engaging web functionality.

### Backend
- **Node.js**: For managing the backend API server and handling server-side logic.
- **SQLite**: For storing and managing user data, expenses, and grocery lists.

---

## Features

### **Expense Tracker**
- Add, edit, and delete expenses.
- Automatically split expenses among users.
- Resolve debts and keep track of outstanding payments using a money algorithm.
#### **Payment Resolution**
- Settle debts with an automated summary of transactions once payments are completed.


### **Grocery List Management**
- Track grocery items with quantities.
- Add and remove items as needed for group shopping.

### **Chores**
- Add  chores relating to Cleaning, Kitchen, Trash and Other
- Assign any users including yourself to tasks with deadlines with timings
- Mark "Done" after the task is completed

### **Group and Profile Management**
- Create and join roommate groups using a unique invite code.
- Personalize your profile by entering your name.
- Use Github Oath

---

## User Guide

### **Login Screen**
Upon launching the app, users will be greeted with a playful "Welcome to Choremates" typing animation, followed by the GitHub login option. The app uses GitHub authentication for secure login, and users will automatically be redirected to the Home screen once authenticated.

### **Create Group Screen**
Create a new roommate group by entering a group name. A unique invite code is generated, which can be easily copied and shared with others.

### **Join Group Screen**
To join a roommate group, users will enter a unique 6-character invite code shared by the group administrator. 

### **Profile Setup Screen**
After logging in, users are prompted to personalize their profile by entering their name. The app automatically generates a profile avatar based on the user’s initials.

---

## Expense Tracker Features

### **Adding an Expense**
- **Description**: Input the name or description of the expense (e.g., "Groceries").
- **Amount**: Enter the expense amount.
- **Payer**: Select the person who paid the expense.
- **Action**: Click “Add Expense” to submit or “Save Expense” to edit an existing one.

### **Editing and Deleting Expenses**
- Modify or remove any expense by selecting the "Edit" or "Delete" button next to the item.

### **Settling Debts**
- Resolve outstanding debts by clicking "Resolve Your Payments," which settles all debts among group members.

### **Viewing Past Expenses**
- Access a history of settled expenses under the “View Past Expenses” section.

---

## API Endpoints

The application interacts with the backend API for managing expenses and grocery lists.

### **Expenses API**
- **GET /api/payments**: Fetch all expenses.
- **POST /api/payments/add**: Add a new expense.
- **DELETE /api/payments/delete/:id**: Delete an expense by ID.
- **POST /api/payments/complete**: Mark debts as resolved.
- **GET /api/payments/resolve**: Retrieve resolved payments.

### **Groceries API**
- **GET /api/groceries**: Fetch all grocery items.
- **POST /api/groceries**: Add a new grocery item.
- **DELETE /api/groceries/:id**: Delete a grocery item by ID.

---

## Group Member Responsibilities

### Vivek Reddy Kasireddy
- Worked primarily on the Chores UI and front-end React page.
- Developed the Expense Tracker page alongside Jahnavi Prudhivi.
- Worked on debugging the grocery page and fixed the database schema to fix the core functionality 

### Jahnavi Prudhivi
- Led the front-end development for the Expense Tracker page.
- Responsible for connecting the front end to the back end (middleware).
- Debugged and fix issues for the Chores page and worked entirely on the middleware for the Chores page. 

### Vivek Voleti
- Focused entirely on the backend, including developing the server logic.
- Implemented the expense tracker money-handling algorithm, which added functionality similar to Venmo for roommates.
- Significantly helped with debugging on the front end and the back-end side for all the pages. 
- Worked on the entire middleware and part of the back-end for the expense tracker 
- Debugged a lot of git/github issues 

### Jacob Ellington
- Worked fully on the backend, including designing the server.js logic.
- Created the database schemas (db.sql).
- Also helped with debugging and fixing issues with the front-end for Chores and Grocery page. 
- Debugged a lot of database and server issues 

### Tanya
- Worked on full-stack development for the grocery feature, implementing both the UI and backend.
- Worked on Navigation Bar, setting up User Profiles, and page routing
- Designed and styled the application using Material-UI, ensuring a visually appealing design.

---

## Challenges Faced

One of the biggest challenges we encountered was connecting the front end to the back end, particularly in managing the middleware. Since the frontend and backend were being developed separately by different team members, the integration process proved to be exceedingly difficult. We faced database connection errors and issues with data syncing between the front end and the backend, which resulted in numerous roadblocks.

Our next biggest challenge was not managing our time well, so we had to cut down on some features we wanted to implement. 

---
## Improvements & Possible Future Additions
During the development of Choremates, we envisioned several features that we were unable to implement due to time constraints and technical limitations in both the frontend and backend. These features would have further enhanced the usability and efficiency of the application, making it an even more powerful tool for managing shared household responsibilities.

### Chores Page Enhancements
- Task Scheduling & Calendar View: We wanted to implement a color-coded chore scheduling system, where each user's tasks would be displayed in an intuitive calendar format.
- Automated Reminders: The ability to send reminders to users when their assigned chore is due.
- Recurring Tasks: Support for chores that repeat on a daily, weekly, or monthly basis.

### Expense Tracker Enhancements
- Venmo API Integration: We planned to integrate the Venmo API to allow users to directly send and receive payments within the app, reducing the need for external money transfer services.
- Smart Debt Settlement Algorithm: Although we implemented an expense-splitting system, we wanted to refine it further to optimize payments between users and minimize the number of transactions needed to settle all debts.

### Grocery Page Enhancements
- Inventory Management: A "Needed Inventory vs. Current Inventory" feature, where users could track what items they currently have in stock versus what is needed.
- Price Estimation & Budgeting: We considered adding a budget tracker that would estimate the total cost of grocery purchases based on average item prices.
- Shared Shopping Lists: A feature allowing users to assign specific grocery items to different roommates, ensuring that everyone contributes to shopping responsibilities.

### General Improvements
- Push Notifications: Implementing real-time push notifications for reminders and updates regarding expenses, chores, and grocery lists.
- Dark Mode: Adding a dark mode toggle to improve accessibility and user experience.
- Mobile App Version: Expanding Choremates into a mobile-friendly app for iOS and Android for better accessibility.

#### While we couldn’t implement these features in our current version due to time constraints, backend limitations, and frontend complexity, they remain exciting possibilities for future iterations of Choremates.
---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Conclusion

Choremates provides a streamlined and user-friendly platform for roommates or housemates to manage shared responsibilities like expenses and groceries. By integrating expense tracking, grocery list management, and payment resolution features, it offers a simple yet effective solution for organizing household tasks. Whether you are managing day-to-day expenses or ensuring fair payment distribution, Choremates simplifies the process while providing a fun, interactive experience for all users.

